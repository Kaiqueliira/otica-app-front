// src/components/clientes/ClientesList.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  UserCheck,
} from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Cliente } from "@/types";
import "./ClientesList.css";

const ClientesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);

  const {
    data: clientes,
    loading,
    error,
    refetch,
  } = useApi<Cliente[]>(clienteService.getAll);

  // Filtrar clientes baseado na busca
  useEffect(() => {
    if (!clientes) {
      setFilteredClientes([]);
      return;
    }

    const filtered = clientes.filter(
      (cliente) =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
    );

    setFilteredClientes(filtered);
  }, [clientes, searchTerm]);

  const handleDelete = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
      try {
        await clienteService.delete(id);
        refetch();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const handleExport = () => {
    // Implementar exportação CSV/PDF
    console.log("Exportar clientes");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando clientes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h3>Erro ao carregar clientes</h3>
          <p>{error.message}</p>
          <button onClick={refetch} className="btn btn-primary">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">
              <UserCheck size={32} />
              Clientes
            </h1>
            <p className="page-description">
              Gerencie todos os clientes cadastrados ({filteredClientes.length}{" "}
              total)
            </p>
          </div>

          <div className="page-actions">
            <button
              onClick={handleExport}
              className="btn btn-outline btn-sm"
              title="Exportar lista"
            >
              <Download size={16} />
              <span className="sm-hidden">Exportar</span>
            </button>

            <Link to="/clientes/novo" className="btn btn-primary">
              <Plus size={16} />
              Novo Cliente
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="list-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-actions">
          <button className="btn btn-outline btn-sm">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredClientes.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <Search size={48} />
              <h3>Nenhum cliente encontrado</h3>
              <p>Tente ajustar os termos da busca</p>
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-outline"
              >
                Limpar busca
              </button>
            </>
          ) : (
            <>
              <UserCheck size={48} />
              <h3>Nenhum cliente cadastrado</h3>
              <p>Comece cadastrando seu primeiro cliente</p>
              <Link to="/clientes/novo" className="btn btn-primary">
                <Plus size={16} />
                Cadastrar Cliente
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-container desktop-only">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>CPF</th>
                  <th>Contato</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="cliente-info">
                        <div className="cliente-avatar">
                          {cliente.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="cliente-details">
                          <div className="cliente-nome">{cliente.nome}</div>
                          {cliente.endereco && (
                            <div className="cliente-endereco">
                              {cliente.endereco}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cpf-text">{formatCPF(cliente.cpf)}</span>
                    </td>
                    <td>
                      <div className="contato-info">
                        {cliente.email && (
                          <div className="contato-item">
                            <span className="contato-label">Email:</span>
                            <span className="contato-value">
                              {cliente.email}
                            </span>
                          </div>
                        )}
                        {cliente.telefone && (
                          <div className="contato-item">
                            <span className="contato-label">Tel:</span>
                            <span className="contato-value">
                              {cliente.telefone}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="date-text">
                        {formatDate(cliente.dataCadastro)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => navigate(`/clientes/${cliente.id}`)}
                          className="btn btn-icon btn-sm"
                          title="Visualizar"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/clientes/editar/${cliente.id}`)
                          }
                          className="btn btn-icon btn-sm"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id, cliente.nome)}
                          className="btn btn-icon btn-sm btn-danger"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards mobile-only">
            {filteredClientes.map((cliente) => (
              <div key={cliente.id} className="cliente-card">
                <div className="cliente-card-header">
                  <div className="cliente-info">
                    <div className="cliente-avatar">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="cliente-details">
                      <h3 className="cliente-nome">{cliente.nome}</h3>
                      <p className="cliente-cpf">{formatCPF(cliente.cpf)}</p>
                    </div>
                  </div>
                  <div className="cliente-actions">
                    <button
                      onClick={() => navigate(`/clientes/${cliente.id}`)}
                      className="btn btn-icon btn-sm"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div className="cliente-card-body">
                  {cliente.email && (
                    <div className="cliente-contact">
                      <strong>Email:</strong> {cliente.email}
                    </div>
                  )}
                  {cliente.telefone && (
                    <div className="cliente-contact">
                      <strong>Telefone:</strong> {cliente.telefone}
                    </div>
                  )}
                  <div className="cliente-contact">
                    <strong>Cadastro:</strong>{" "}
                    {formatDate(cliente.dataCadastro)}
                  </div>
                </div>

                <div className="cliente-card-footer">
                  <button
                    onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id, cliente.nome)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientesList;
