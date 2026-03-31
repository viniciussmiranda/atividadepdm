import { atualizarDescricao, deletarTarefa, getTarefas } from "@/back4app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
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

export default function EditarTarefaPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const tarefa = data?.find((t) => t.objectId === id);
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? "");

  const mutationAtualizar = useMutation({
    mutationFn: atualizarDescricao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      router.back();
    },
  });

  const mutationDeletar = useMutation({
    mutationFn: deletarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      router.back();
    },
  });

  function handleSalvar() {
  if (descricao.trim() === "") {
    Alert.alert("Descrição inválida", "Preencha a descrição da tarefa");
    return;
  }
  Alert.alert(
    "Confirmar alteração",
    `Deseja salvar a nova descrição "${descricao}"?`,
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salvar",
        onPress: () => mutationAtualizar.mutate({ objectId: id, descricao }),
      },
    ]
  );
}

  function handleDeletar() {
    Alert.alert("Confirmar exclusão", `Deseja deletar "${tarefa?.descricao}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () => mutationDeletar.mutate(id),
      },
    ]);
  }

  const isPending = mutationAtualizar.isPending || mutationDeletar.isPending;

  return (
    <View style={styles.container}>
      {isPending && <ActivityIndicator size="large" />}
      <Text style={styles.label}>ID da Tarefa:</Text>
      <Text style={styles.id}>{id}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição da tarefa"
      />

      <View style={styles.buttons}>
        <Button title="Salvar" onPress={handleSalvar} disabled={isPending} />
        <Button title="Deletar" color="red" onPress={handleDeletar} disabled={isPending} />
        <Button title="Voltar" color="gray" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  label: { fontWeight: "bold", fontSize: 14, marginTop: 10 },
  id: { fontSize: 12, color: "#666" },
  input: {
    borderColor: "black",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  buttons: { marginTop: 20, gap: 10 },
});