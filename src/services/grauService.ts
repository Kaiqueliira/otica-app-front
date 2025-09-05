import api, { handleApiSuccess } from "./apiServices";
import type { GrauLente, CreateGrauLenteDto } from "@/types";

export const grauService = {
  // Listar todos os graus
  async getAll(): Promise<GrauLente[]> {
    const response = await api.get<GrauLente[]>("/graus");
    return response.data;
  },

  // Obter um grau por ID
  async getById(id: number): Promise<GrauLente> {
    const response = await api.get<GrauLente>(`/graus/${id}`);
    return response.data;
  },

  // Listar graus de um cliente
  async getByClienteId(clienteId: number): Promise<GrauLente[]> {
    const response = await api.get<GrauLente[]>(`/graus/cliente/${clienteId}`);
    return response.data;
  },

  // Obter último grau de um cliente
  async getUltimoGrauCliente(clienteId: number): Promise<GrauLente> {
    const response = await api.get<GrauLente>(
      `/graus/cliente/${clienteId}/ultimo`
    );
    return response.data;
  },

  // Criar um novo grau
  async create(grauData: CreateGrauLenteDto): Promise<GrauLente> {
    const response = await api.post<GrauLente>("/graus", grauData);
    handleApiSuccess("Grau de lente criado com sucesso!");
    return response.data;
  },

  // Atualizar grau existente
  async update(id: number, grauData: CreateGrauLenteDto): Promise<void> {
    await api.put(`/graus/${id}`, grauData);
    handleApiSuccess("Grau de lente atualizado com sucesso!");
  },

  // Excluir grau
  async delete(id: number): Promise<void> {
    await api.delete(`/graus/${id}`);
    handleApiSuccess("Grau de lente excluído com sucesso!");
  },
};
