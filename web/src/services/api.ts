import axios from "axios";

function isLocalhostHost() {
  try {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

const envBaseUrl = process.env.REACT_APP_API_URL;

// Em produção (ex.: Vercel), NÃO podemos cair em localhost.
// Só usamos o fallback localhost quando o próprio frontend está rodando localmente.
const baseURL = envBaseUrl || (isLocalhostHost() ? "http://localhost:3333" : undefined);

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  // Se baseURL estiver vazio em ambiente remoto, aborta com erro claro
  // para evitar bater no próprio domínio (SPA) ou em localhost (bloqueado).
  if (!config.baseURL) {
    throw new Error(
      "REACT_APP_API_URL não configurada. Defina a URL pública da API nas variáveis de ambiente (ex.: Vercel) e faça redeploy."
    );
  }
  return config;
});

export default api;
