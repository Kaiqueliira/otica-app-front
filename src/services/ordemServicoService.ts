import api from "./apiServices";

export interface CreateOrdemServicoDto {
  clienteId: number;
  servicoId?: number;
  grauLenteId?: number;
  tipo: "Servico" | "Grau";
  dataEntregaPrevista?: string;
  armacao?: string;
  lente?: string;
  altura?: number;
  medico?: string;
  valorTotal: number;
}

export interface OrdemServicoDto {
  id: number;
  numeroOS: string;
  clienteId: number;
  clienteNome: string;
  servicoId?: number;
  grauLenteId?: number;
  tipo: string;
  dataCriacao: string;
  dataEntregaPrevista?: string;
  armacao?: string;
  lente?: string;
  altura?: number;
  medico?: string;
  valorTotal: number;
}

const ordemServicoService = {
  create: async (osData: CreateOrdemServicoDto): Promise<OrdemServicoDto> => {
    const response = await api.post<OrdemServicoDto>("/OrdensServico", osData);
    return response.data;
  },

  getByClienteId: async (clienteId: number): Promise<OrdemServicoDto[]> => {
    const response = await api.get<OrdemServicoDto[]>(
      `/OrdensServico/cliente/${clienteId}`,
    );
    return response.data;
  },

  getHtml: async (id: number): Promise<string> => {
    const response = await api.get<string>(`/OrdensServico/${id}/html`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/OrdensServico/${id}`);
  },
};

export default ordemServicoService;
