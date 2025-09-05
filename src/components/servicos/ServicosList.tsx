// src/components/servicos/ServicosList.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  User,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { servicoService } from "@/services/servicoService";
import { clienteService } from "@/services/clienteService";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Servico, Cliente } from "@/types";
import "./ServicosList.css";

const ServicosList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const {
    data: servicos,
    loading,
    error,
    refetch,
  } = useApi<Servico[]>(servicoService.getAll);

  // Buscar clientes para relacionar com serviços
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const data = await clienteService.getAll();
        setClientes(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadClientes();
  }, []);

  // Filtrar lista
  useEffect(() => {
    if (!servicos) return;

    const filtered = servicos.filter((s) => {
      const cli = clientes.find((c) => c.id === s.clienteId);
      const nome = cli?.nome || "";
      return (
        nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredServicos(filtered);
  }, [servicos, clientes, searchTerm]);

  const getClienteNome = (id: number) =>
    clientes.find((c) => c.id === id)?.nome || "Cliente não encontrado";

  const handleDelete = async (id: number) => {
    if (window.confirm("Deseja realmente excluir este serviço?")) {
      await servicoService.delete(id);
      refetch();
    }
  };

  const statusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Pendente
          </span>
        );
      case 2:
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Concluído
          </span>
        );
      case 3:
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) return <LoadingSpinner message="Carregando serviços..." />;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Serviços</h1>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/servicos/novo">
            <Plus size={16} /> Novo Serviço
          </Link>
        </div>
      </div>

      <div className="list-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            placeholder="Buscar serviços ou clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-outline">
          <Filter size={14} /> Filtros
        </button>
        <button className="btn btn-outline">
          <Download size={14} /> Exportar
        </button>
      </div>

      {filteredServicos.length === 0 ? (
        <div className="empty-state">Nenhum serviço encontrado.</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredServicos.map((s) => (
                <tr key={s.id}>
                  <td>{getClienteNome(s.clienteId)}</td>
                  <td>{s.descricao}</td>
                  <td>R$ {s.valor.toFixed(2)}</td>
                  <td>{new Date(s.dataServico).toLocaleDateString("pt-BR")}</td>
                  <td>{statusBadge(s.status)}</td>
                  <td>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => navigate(`/servicos/editar/${s.id}`)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-icon btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServicosList;
