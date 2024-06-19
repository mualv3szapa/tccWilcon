import { StatusBar } from "expo-status-bar";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Container } from "./src/components/Container/Container";
import { ButtonONOFF } from "./src/components/Button/Button";
import { useState } from "react";

export default function App() {
  const [status, setStatus] = useState("aberto");
  const [automaticStatus, setAutomaticStatus] = useState(false);
  const toggleSwitch = () => setAutomaticStatus((previousState) => !previousState);

  function toggleStatus() {
    setStatus((prevStatus) => (prevStatus === "aberto" ? "fechado" : "aberto"));
  }
  return (
    <Container>
      <ButtonONOFF
        TextBtn={status == "aberto" ? "Fechado" : "Aberto"}
        clickButton={status === "fechado"}
        onPress={toggleStatus}
      />

      <Switch
        trackColor={{ false: "#767577", true: "#589ae8" }}
        thumbColor={automaticStatus ? "#4858E8" : "#f4f3f4"}
        onValueChange={toggleSwitch}
        value={automaticStatus}
      />

      <Text
        style={{
          fontSize: 18,
          marginTop: 40,
        }}
      >
        Temperatura Ambiente: 25°C
      </Text>
      <Text
        style={{
          fontSize: 18,
          marginTop: 20,
        }}
      >
        Clima Atual: Nublado
      </Text>
    </Container>
  );
}
