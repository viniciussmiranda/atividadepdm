import axios from "axios";

const urlBase = "https://api-tarefas-nine.vercel.app/tarefas";

export async function getTarefas() {
  const response = await axios.get(urlBase);
  return response.data;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa);
  return response.data;
}

export async function atualizarTarefa({ objectId, concluida }) {
  const response = await axios.put(`${urlBase}/${objectId}`, { concluida });
  return response.data;
}

export async function deletarTarefa(objectId) {
  const response = await axios.delete(`${urlBase}/${objectId}`);
  return response.data;
}

export async function atualizarDescricao({ objectId, descricao }) {
  const response = await axios.put(`${urlBase}/${objectId}`, { descricao });
  return response.data;
}