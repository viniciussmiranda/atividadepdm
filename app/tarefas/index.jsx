import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adicionarTarefa,
  atualizarTarefa,
  deletarTarefa,
  getTarefas,
} from "@/back4app";

export default function TarefasPage() {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const mutationAdicionar = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const mutationAtualizar = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const mutationDeletar = useMutation({
    mutationFn: deletarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const [descricao, setDescricao] = useState("");

  function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK" },
      ]);
      return;
    }
    mutationAdicionar.mutate({ descricao });
    setDescricao("");
  }

  function handleToggleConcluida(tarefa) {
    mutationAtualizar.mutate({
      objectId: tarefa.objectId,
      concluida: !tarefa.concluida,
    });
  }

  function handleDeletar(tarefa) {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja deletar "${tarefa.descricao}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: () => mutationDeletar.mutate(tarefa.objectId),
        },
      ]
    );
  }

  const isPending =
    isFetching ||
    mutationAdicionar.isPending ||
    mutationAtualizar.isPending ||
    mutationDeletar.isPending;

  return (
    <View style={styles.container}>
      {isPending && <ActivityIndicator size="large" />}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutationAdicionar.isPending}
      />
      <View style={styles.hr} />
      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <View key={t.objectId} style={styles.taskRow}>
            <Switch
              value={!!t.concluida}
              onValueChange={() => handleToggleConcluida(t)}
              disabled={mutationAtualizar.isPending}
            />
            <Text style={[styles.taskText, t.concluida && styles.strikethroughText]}>
              {t.descricao}
            </Text>
            <TouchableOpacity
              onPress={() => handleDeletar(t)}
              disabled={mutationDeletar.isPending}
            >
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 10 },
  tasksContainer: { width: "100%", paddingLeft: 10 },
  taskRow: { flexDirection: "row", alignItems: "center", marginVertical: 6, gap: 8 },
  taskText: { flex: 1, fontSize: 16 },
  input: { borderColor: "black", borderWidth: 1, width: "90%", marginBottom: 5, padding: 4 },
  hr: { height: 1, backgroundColor: "black", width: "95%", marginVertical: 10 },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationColor: "red",
    color: "#999",
  },
  deleteBtn: { fontSize: 20, padding: 4 },
});