// src/services/apiService.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ApiError } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Configuração do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptador de respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${
        response.status
      }`
    );
    return response;
  },
  (error: AxiosError<any>) => {
    console.error(
      `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${
        error.response?.status
      }`
    );

    // Tratamento de erros globais
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          if (data?.errors) {
            // Erros de validação do FluentValidation
            const errorMessages = Object.values(data.errors).flat() as string[];
            errorMessages.forEach((message: string) => toast.error(message));
          } else if (data?.message) {
            toast.error(data.message);
          } else {
            toast.error("Dados inválidos");
          }
          break;
        case 404:
          toast.error(data?.message || "Recurso não encontrado");
          break;
        case 500:
          toast.error("Erro interno do servidor");
          break;
        default:
          toast.error("Erro inesperado");
      }
    } else if (error.request) {
      toast.error("Erro de conexão com o servidor");
    } else {
      toast.error("Erro inesperado");
    }

    return Promise.reject(error);
  }
);

export default api;

// Funções utilitárias tipadas
export const handleApiError = (
  error: AxiosError<ApiError>,
  customMessage?: string
): void => {
  console.error("API Error:", error);
  if (customMessage) {
    toast.error(customMessage);
  }
};

export const handleApiSuccess = (message: string): void => {
  toast.success(message);
};
