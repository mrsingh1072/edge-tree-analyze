import axios from "axios";

const api = axios.create({
  baseURL: "https://edge-tree-backend.onrender.com",
  timeout: 10_000,
});

export async function postBfhl(payload) {
  const res = await api.post("/bfhl", payload);
  return res.data;
}

