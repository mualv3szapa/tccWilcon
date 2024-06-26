import { StatusBar } from "expo-status-bar";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Container } from "./src/components/Container/Container";
import { ButtonONOFF } from "./src/components/Button/Button";
import { useState, useEffect } from "react";
import axios from "axios"; // Adiciona a biblioteca axios para fazer requisições HTTP

const ip = "172.20.10.10"; // IP do ESP32

export default function App() {
  const [status, setStatus] = useState("aberto");
  const [automaticStatus, setAutomaticStatus] = useState(true);
  const [appMode, setAppMode] = useState(false);
  const [temperature, setTemperature] = useState(null); // Estado para temperatura
  const [humidity, setHumidity] = useState(null); // Estado para umidade

  const toggleSwitch = async () => {
    setAutomaticStatus((previousState) => !previousState);
    try {
      // Envia a requisição HTTP para o ESP32 para alternar o modo automático
      const response = await axios.get(`http://${ip}/toggle-automatic`, {
        params: {
          automatic: !automaticStatus,
        },
      });
      setAppMode(true);
      console.log("Resposta do ESP32:", response.data);
      console.log(appMode);
    } catch (error) {
      console.error("Erro ao alternar o modo automático:", error);
    }
  };

  const toggleStatus = async () => {
    const newStatus = status === "aberto" ? "fechado" : "aberto";
    setStatus(newStatus);
    try {
      // Envia a requisição HTTP para o ESP32 para controlar o servo
      const response = await axios.get(`http://${ip}/control-servo`, {
        params: {
          status: newStatus === "aberto" ? "abrir" : "fechar",
        },
      });
      console.log("Resposta do ESP32:", response.data);
    } catch (error) {
      console.error("Erro ao controlar o servo:", error);
    }
  };

  const fetchDHTData = async () => {
    try {
      // Envia a requisição HTTP para obter dados do DHT
      const response = await axios.get(`http://${ip}/get-dht`);
      const { temperatura, umidade } = response.data;
      setTemperature(temperatura);
      setHumidity(umidade);
    } catch (error) {
      console.error("Erro ao obter dados do DHT:", error);
    }
  };

  useEffect(() => {
    fetchDHTData(); // Busca os dados do DHT quando o aplicativo é carregado
    const interval = setInterval(fetchDHTData, 10000); // Atualiza os dados a cada 10 segundos
    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, []);

  return (
    <Container>
      {appMode == false ? (
        <>
          <View
            style={{
              alignItems: "center",
              flexDirection: "column",
              gap: 15,
              marginTop: 250,
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#589ae8" }}
              thumbColor={automaticStatus ? "#4858E8" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={automaticStatus}
            />
            <Text>Modo app ativado</Text>
          </View>
        </>
      ) : (
        <>
          <View
            style={{
              marginTop: 90,
              width: "90%",
              borderRadius: 100,
              height: 100,
              backgroundColor: "#589ae8",
              color: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 25,
              }}
            >
              Autotelha
            </Text>
          </View>

          {/* Botão abrir e fechar telhas */}

          {automaticStatus == true ? (
            <></>
          ) : (
            <>
              <Text style={{ marginTop: 50, marginBottom: 10 }}>
                Clique para {status == "aberto" ? "abrir" : "fechar"} telha
              </Text>
              <ButtonONOFF
                TextBtn={status == "aberto" ? "Fechado" : "Aberto"}
                clickButton={status === "fechado"}
                onPress={toggleStatus}
              />
            </>
          )}

          {/* Exibição de dados do DHT */}
          <Text
            style={{
              fontSize: 18,
              marginTop: 40,
            }}
          >
            Temperatura Ambiente:{" "}
            {temperature !== null ? `${temperature}°C` : "Carregando..."}
          </Text>

          <Text
            style={{
              fontSize: 18,
              marginTop: 20,
            }}
          >
            Umidade do ar:{" "}
            {humidity !== null ? `${humidity}%` : "Carregando..."}
          </Text>

          {/* Botão ativar e desativar modo automatico */}

          <View
            style={{
              flexDirection: "row",
              width: 90,
              justifyContent: "space-between",
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#589ae8" }}
              thumbColor={automaticStatus ? "#4858E8" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={automaticStatus}
            />
            <Text> Modo Automatico desativado </Text>
          </View>
        </>
      )}
    </Container>
  );
}
