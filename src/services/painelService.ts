import api from "./apiServices";
import type { Painel } from "@/types";

export const painelService = {
  async getInfo(): Promise<Painel> {
    const response = await api.get<Painel>("/painel");
    return response.data;
  },
};
