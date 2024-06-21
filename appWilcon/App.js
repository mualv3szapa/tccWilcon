import { StatusBar } from "expo-status-bar";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Container } from "./src/components/Container/Container";
import { ButtonONOFF } from "./src/components/Button/Button";
import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("aberto");
  const [automaticStatus, setAutomaticStatus] = useState(false);
  const [appMode, setAppMode] = useState(false);

  const toggleSwitch = () =>
    setAutomaticStatus((previousState) => !previousState);

  function toggleStatus() {
    setStatus((prevStatus) => (prevStatus === "aberto" ? "fechado" : "aberto"));
  }
  return (
    <Container>
      {appMode == false ? (
        <Text style={{ marginTop: 300 }}>
          {" "}
          Modo aplicativo desativado{" "}
          <TouchableOpacity onPress={() => setAppMode(true)}>
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Clique Aqui
            </Text>
          </TouchableOpacity>{" "}
          para ativar
        </Text>
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

          <Text style={{ marginTop: 50, marginBottom: 10 }}>
            Clique para {status == "aberto" ? "fechar" : "abrir"} telha
          </Text>
          <ButtonONOFF
            TextBtn={status == "aberto" ? "Fechado" : "Aberto"}
            clickButton={status === "fechado"}
            onPress={toggleStatus}
          />

          {/* Botão ativar e desativar modo automatico */}

          <View
            style={{
              flexDirection: "row",
              width: 90,
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            {automaticStatus == false ? (
              <Text> Modo Automatico desativado </Text>
            ) : (
              <></>
            )}
            <Switch
              trackColor={{ false: "#767577", true: "#589ae8" }}
              thumbColor={automaticStatus ? "#4858E8" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={automaticStatus}
            />
            {automaticStatus == true ? (
              <Text> Modo Automatico Ativado</Text>
            ) : (
              <></>
            )}
          </View>

          {/* temperatura atual */}
          <Text
            style={{
              fontSize: 18,
              marginTop: 40,
            }}
          >
            Temperatura Ambiente: 25°C
          </Text>
          {/* Clima atual */}
          <Text
            style={{
              fontSize: 18,
              marginTop: 20,
            }}
          >
            Clima Atual: Nublado
          </Text>

          {/* Umidade do ar atual */}
          <Text
            style={{
              fontSize: 18,
              marginTop: 20,
            }}
          >
            Umidade do ar: 20%
          </Text>

          <Text>Modo Aplicativo Ativado</Text>

          <TouchableOpacity
            onPress={() => setAppMode(false)}
            style={{ marginTop: 30 }}
          >
            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
              Desativar modo aplicativo
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Container>
  );
}
