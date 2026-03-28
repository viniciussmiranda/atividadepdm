import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/tarefa";
const headers = {
  "X-Parse-Application-Id": "cBYlta75GLSijbU7KUV4ZjXdhSdmxfLUuULSbKF4",
  "X-Parse-JavaScript-Key": "QwpjPcaNXPAXHXrB4cq75su6qzFv27tmvGk5KFFj",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, { headers });
  return response.data.results;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(
    urlBase,
    { descricao: novaTarefa.descricao, concluida: false },
    { headers: headersJson }
  );
  return response.data;
}

export async function atualizarTarefa({ objectId, concluida }) {
  const response = await axios.put(
    `${urlBase}/${objectId}`,
    { concluida },
    { headers: headersJson }
  );
  return response.data;
}

export async function deletarTarefa(objectId) {
  const response = await axios.delete(`${urlBase}/${objectId}`, { headers });
  return response.data;
}