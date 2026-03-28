import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adicionarTarefa, getTarefas } from "@/back4app";

export default function TarefasPage() {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });
  const mutation = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });
  const [descricao, setDescricao] = useState("");

  async function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    mutation.mutate({ descricao });
    setDescricao("");
  }

  return (
    <View style={styles.container}>
      {(isFetching || mutation.isPending) && <ActivityIndicator size="large" />}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutation.isPending}
      />
      <View style={styles.hr} />
      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <Text
            key={t.objectId}
            style={t.concluida && styles.strikethroughText}
          >
            {t.descricao}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  tasksContainer: {
    paddingLeft: 15,
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    width: "90%",
    marginBottom: 5,
  },
  hr: {
    height: 1,
    backgroundColor: "black",
    width: "95%",
    marginVertical: 10,
  },
  strikethroughText: {
    textDecorationLine: "line-through", // Key property for strikethrough
    textDecorationStyle: "solid", // Optional: Style of the line
    textDecorationColor: "red", // Optional: Color of the line (iOS only)
    // Other styles like fontSize, fontWeight, color can also be applied
  },
});
