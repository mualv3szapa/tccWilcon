#include <ESPAsyncWebServer.h>
#include <WiFi.h>
#include <ESP32Servo.h>
#include <LiquidCrystal_I2C.h>
#include <SimpleDHT.h>
#include <ArduinoJson.h> // Inclui a biblioteca ArduinoJson para criação do JSON

// Configurações WiFi
const char* ssid = "iPhone de Wilcon";
const char* password = "1357924680";

// Criação do servidor
AsyncWebServer server(80);

// Inicialização de componentes
LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo meuservo;
SimpleDHT11 dht11; // Para DHT11. Use SimpleDHT22 para DHT22
const int DHT_PIN = 4;
#define pinSensorD 23

// Variável para armazenar o estado do modo automático
bool modoAutomatico = false;

// Variáveis para armazenar os valores de temperatura e umidade
byte temperatura = 0;
byte umidade = 0;

// Função para controle manual do servo
void controleServo(String status) {
  if (status == "abrir") {
    meuservo.write(170);
    Serial.println("Servo abrindo (170 graus)");
  } else if (status == "fechar") {
    meuservo.write(0);
    Serial.println("Servo fechando (0 graus)");
  }
}

void setup() {
  Serial.begin(115200);

  // Configuração do WiFi
  Serial.println("Iniciando conexão WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao WiFi...");
  }
  
  // Log do IP do ESP32 após conexão bem-sucedida
  Serial.println();
  Serial.println("========================================");
  Serial.println("WiFi conectado!");
  Serial.print("SSID: ");
  Serial.println(ssid);
  Serial.print("Endereço IP do ESP32: ");
  Serial.println(WiFi.localIP());
  Serial.println("========================================");
  Serial.println();

  // Inicialização do LCD
  lcd.init();
  lcd.backlight();

  // Configuração do servo
  meuservo.attach(26);
  meuservo.write(0);

  // Configuração dos pinos
  pinMode(pinSensorD, INPUT);
  pinMode(18, INPUT); // Fim de curso

  // Rota para controle do servo
  server.on("/control-servo", HTTP_GET, [](AsyncWebServerRequest *request) {
    if (request->hasParam("status")) {
      String status = request->getParam("status")->value();
      controleServo(status); // Chama a função de controle manual
    }
    request->send(200, "text/plain", "Comando recebido");
  });

  // Rota para alternar o modo automático
  server.on("/toggle-automatic", HTTP_GET, [](AsyncWebServerRequest *request) {
    if (request->hasParam("automatic")) {
      String automatic = request->getParam("automatic")->value();
      if (automatic == "true") {
        modoAutomatico = true; // Ativa o modo automático
        Serial.println("Modo automático ativado");
      } else {
        modoAutomatico = false; // Desativa o modo automático
        Serial.println("Modo automático desativado");
      }
    }
    request->send(200, "text/plain", "Comando de modo automático recebido");
  });

  // Rota para obter o IP do ESP32
  server.on("/get-ip", HTTP_GET, [](AsyncWebServerRequest *request) {
    String ip = WiFi.localIP().toString();
    Serial.println("IP solicitado via Web: " + ip);
    request->send(200, "text/plain", "Endereço IP do ESP32: " + ip);
  });

  // Rota para obter dados de temperatura e umidade do sensor DHT
  server.on("/get-dht", HTTP_GET, [](AsyncWebServerRequest *request) {
    DynamicJsonDocument json(200);
    json["temperatura"] = String(temperatura);
    json["umidade"] = String(umidade);

    String response;
    serializeJson(json, response);
    request->send(200, "application/json", response);

    Serial.println("Dados DHT11 solicitados via Web");
  });

  // Inicialização do servidor
  server.begin();
  Serial.println("Servidor Web iniciado!");
  Serial.println("Acesse o ESP32 via navegador em: http://" + WiFi.localIP().toString());
}

void loop() {
  byte data[40] = {0};

  // Leitura dos dados do sensor DHT
  int err = SimpleDHTErrSuccess;
  if ((err = dht11.read(DHT_PIN, &temperatura, &umidade, data)) != SimpleDHTErrSuccess) {
    Serial.print("Erro ao ler do sensor DHT11, código: ");
    Serial.println(err);
    delay(2000);
    return;
  }

  // Atualização do LCD
  lcd.setCursor(0, 0);
  lcd.print("Temp: " + String(temperatura) + "C");
  lcd.setCursor(11, 1);
  lcd.println(&tempo, "%H:%M");

  // Log das leituras
  Serial.println("Temperatura: " + String(temperatura) + "°C");
  Serial.println("Umidade: " + String(umidade) + "%");

  // Lógica para controle automático baseado nas leituras do DHT11
  if (modoAutomatico) {
    if (digitalRead(pinSensorD) == LOW) {
      // Se o pinSensorD estiver ativado, fecha as telhas
      meuservo.write(0);
      Serial.println("Modo automático: Sensor ativado, fechando as telhas.");
    } else {
      // Se o pinSensorD não estiver ativado, abre as telhas
      meuservo.write(170);
      Serial.println("Modo automático: Sensor desativado, abrindo as telhas.");
    }
  }

  delay(2000);
}
