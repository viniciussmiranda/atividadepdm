import {
  adicionarTarefa,
  atualizarTarefa,
  getTarefas,
} from "@/back4app";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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

export default function TarefasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const [descricao, setDescricao] = useState("");
  const [dataDeExpiracao, setDataDeExpiracao] = useState("");

  const mutationAdicionar = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  const mutationAtualizar = useMutation({
    mutationFn: atualizarTarefa,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });

  function formatarData(texto) {
    // Remove tudo que não for número
    const numeros = texto.replace(/\D/g, "");
    // Aplica a máscara dd/mm/yyyy
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  }

  function handleChangeData(texto) {
    setDataDeExpiracao(formatarData(texto));
  }

  function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK" },
      ]);
      return;
    }
    if (dataDeExpiracao.length < 10) {
      Alert.alert("Data inválida", "Preencha a data no formato dd/mm/yyyy", [
        { text: "OK" },
      ]);
      return;
    }

    // Converte dd/mm/yyyy para yyyy-mm-dd para o Back4App
    const [dia, mes, ano] = dataDeExpiracao.split("/");
    const dataISO = `${ano}-${mes}-${dia}`;

    mutationAdicionar.mutate({ descricao, dataDeExpiracao: dataISO });
    setDescricao("");
    setDataDeExpiracao("");
  }

  function handleToggleConcluida(tarefa) {
    mutationAtualizar.mutate({
      objectId: tarefa.objectId,
      concluida: !tarefa.concluida,
    });
  }

  const isPending =
    isFetching ||
    mutationAdicionar.isPending ||
    mutationAtualizar.isPending;

  return (
    <View style={styles.container}>
      {isPending && <ActivityIndicator size="large" />}
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.inputData}
        placeholder="Data de expiração * (dd/mm/yyyy)"
        value={dataDeExpiracao}
        onChangeText={handleChangeData}
        keyboardType="numeric"
        maxLength={10}
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
            <TouchableOpacity onPress={() => router.push(`/tarefas/${t.objectId}`)}>
              <Text style={[styles.taskText, t.concluida && styles.strikethroughText]}>
                {t.descricao}
              </Text>
              {t.dataDeExpiracao && (
                <Text style={styles.dataText}>
                  ⏰ Expira: {new Date(t.dataDeExpiracao.iso).toLocaleDateString("pt-BR")}
                </Text>
              )}
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
  taskText: { fontSize: 16 },
  dataText: { fontSize: 12, color: "red", fontWeight: "bold" },
  input: { borderColor: "black", borderWidth: 1, width: "90%", marginBottom: 5, padding: 4 },
  inputData: {
    borderColor: "red",
    borderWidth: 2,
    width: "90%",
    marginBottom: 5,
    padding: 4,
    color: "red",
  },
  hr: { height: 1, backgroundColor: "black", width: "95%", marginVertical: 10 },
  strikethroughText: {
    textDecorationLine: "line-through",
    textDecorationColor: "red",
    color: "#999",
  },
});