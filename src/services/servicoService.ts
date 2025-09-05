import api, { handleApiSuccess } from "./apiServices";
import type { Servico, CreateServicoDto, UpdateServicoDto } from "@/types";

export const servicoService = {
  /** Lista todos os serviços */
  async getAll(): Promise<Servico[]> {
    const response = await api.get<Servico[]>("/servicos");
    return response.data;
  },

  /** Busca um serviço pelo ID */
  async getById(id: number): Promise<Servico> {
    const response = await api.get<Servico>(`/servicos/${id}`);
    return response.data;
  },

  /** Lista serviços de um cliente */
  async getByClienteId(clienteId: number): Promise<Servico[]> {
    const response = await api.get<Servico[]>(`/servicos/cliente/${clienteId}`);
    return response.data;
  },

  /** Cria um novo serviço */
  async create(servicoData: CreateServicoDto): Promise<Servico> {
    const response = await api.post<Servico>("/servicos", servicoData);
    handleApiSuccess("Serviço criado com sucesso!");
    return response.data;
  },

  /** Atualiza um serviço existente */
  async update(id: number, servicoData: UpdateServicoDto): Promise<void> {
    await api.put(`/servicos/${id}`, servicoData);
    handleApiSuccess("Serviço atualizado com sucesso!");
  },

  /** Exclui um serviço */
  async delete(id: number): Promise<void> {
    await api.delete(`/servicos/${id}`);
    handleApiSuccess("Serviço excluído com sucesso!");
  },

  /** Marca serviço como concluído */
  async marcarComoConcluido(id: number): Promise<void> {
    await api.patch(`/servicos/${id}/concluir`);
    handleApiSuccess("Serviço marcado como concluído!");
  },

  /** Cancela serviço */
  async cancelar(id: number): Promise<void> {
    await api.patch(`/servicos/${id}/cancelar`);
    handleApiSuccess("Serviço cancelado com sucesso!");
  },
};
