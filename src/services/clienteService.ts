// src/services/clienteService.ts
import api, { handleApiSuccess } from "./apiServices";
import type { Cliente, CreateClienteDto, UpdateClienteDto } from "@/types";

export const clienteService = {
  // Listar todos os clientes
  async getAll(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
  },

  // Buscar cliente por ID
  async getById(id: number): Promise<Cliente> {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  // Criar novo cliente
  async create(clienteData: CreateClienteDto): Promise<Cliente> {
    const response = await api.post<Cliente>("/clientes", clienteData);
    handleApiSuccess("Cliente criado com sucesso!");
    return response.data;
  },

  // Atualizar cliente
  async update(id: number, clienteData: UpdateClienteDto): Promise<void> {
    await api.put(`/clientes/${id}`, clienteData);
    handleApiSuccess("Cliente atualizado com sucesso!");
  },

  // Deletar cliente
  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
    handleApiSuccess("Cliente removido com sucesso!");
  },

  // Buscar clientes (com filtro)
  async search(searchTerm: string): Promise<Cliente[]> {
    const allClientes = await this.getAll();
    const searchLower = searchTerm.toLowerCase();

    return allClientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchLower) ||
        cliente.cpf.includes(searchTerm) ||
        cliente.email?.toLowerCase().includes(searchLower) ||
        false
    );
  },
};
