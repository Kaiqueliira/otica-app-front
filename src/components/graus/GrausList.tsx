// src/components/graus/GrausList.tsx
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
  User,
  Calendar,
} from "lucide-react";
import { grauService } from "@/services/grauService";
import { clienteService } from "@/services/clienteService";
import { useApi } from "@/hooks/useApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { GrauLente, Cliente } from "@/types";
import "./GrausList.css";

const GrausList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredGraus, setFilteredGraus] = useState<GrauLente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const {
    data: graus,
    loading,
    error,
    refetch,
  } = useApi<GrauLente[]>(grauService.getAll);

  // Carregar clientes para mostrar nomes
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const clientesData = await clienteService.getAll();
        setClientes(clientesData);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };
    loadClientes();
  }, []);

  // Filtrar graus baseado na busca
  useEffect(() => {
    if (!graus) {
      setFilteredGraus([]);
      return;
    }

    const filtered = graus.filter((grau) => {
      const cliente = clientes.find((c) => c.id === grau.clienteId);
      const clienteNome = cliente?.nome || "";

      return (
        clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grau.observacoes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    });

    setFilteredGraus(filtered);
  }, [graus, clientes, searchTerm]);

  const handleDelete = async (id: number, clienteNome: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o grau do cliente "${clienteNome}"?`
      )
    ) {
      try {
        await grauService.delete(id);
        refetch();
      } catch (error) {
        console.error("Erro ao excluir grau:", error);
      }
    }
  };

  const getClienteNome = (clienteId: number): string => {
    const cliente = clientes.find((c) => c.id === clienteId);
    return cliente?.nome || "Cliente não encontrado";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatGrau = (valor: number): string => {
    return valor > 0 ? `+${valor}` : valor.toString();
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando graus..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h3>Erro ao carregar graus</h3>
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
              <Search size={32} />
              Graus de Lentes
            </h1>
            <p className="page-description">
              Gerencie os graus de lentes dos clientes ({filteredGraus.length}{" "}
              total)
            </p>
          </div>

          <div className="page-actions">
            <button
              onClick={() => console.log("Exportar graus")}
              className="btn btn-outline btn-sm"
              title="Exportar lista"
            >
              <Download size={16} />
              <span className="sm-hidden">Exportar</span>
            </button>

            <Link to="/graus/novo" className="btn btn-primary">
              <Plus size={16} />
              Novo Grau
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
            placeholder="Buscar por cliente ou observações..."
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
      {filteredGraus.length === 0 ? (
        <div className="empty-state">
          {searchTerm ? (
            <>
              <Search size={48} />
              <h3>Nenhum grau encontrado</h3>
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
              <Search size={48} />
              <h3>Nenhum grau cadastrado</h3>
              <p>Comece cadastrando o primeiro grau de lente</p>
              <Link to="/graus/novo" className="btn btn-primary">
                <Plus size={16} />
                Cadastrar Grau
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
                  <th>Olho Direito (OD)</th>
                  <th>Olho Esquerdo (OE)</th>
                  <th>Data da Receita</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredGraus.map((grau) => (
                  <tr key={grau.id}>
                    <td>
                      <div className="cliente-info">
                        <div className="cliente-avatar">
                          {getClienteNome(grau.clienteId)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="cliente-details">
                          <div className="cliente-nome">
                            {getClienteNome(grau.clienteId)}
                          </div>
                          {grau.observacoes && (
                            <div className="grau-observacoes">
                              {grau.observacoes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="grau-values">
                        <div className="grau-value">
                          <span className="label">Esf:</span>
                          <span className="value">
                            {formatGrau(grau.esfericoOD)}
                          </span>
                        </div>
                        <div className="grau-value">
                          <span className="label">Cil:</span>
                          <span className="value">
                            {formatGrau(grau.cilindricoOD)}
                          </span>
                        </div>
                        <div className="grau-value">
                          <span className="label">Eixo:</span>
                          <span className="value">{grau.eixoOD}°</span>
                        </div>
                        <div className="grau-value">
                          <span className="label">DP:</span>
                          <span className="value">{grau.dpod}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="grau-values">
                        <div className="grau-value">
                          <span className="label">Esf:</span>
                          <span className="value">
                            {formatGrau(grau.esfericoOE)}
                          </span>
                        </div>
                        <div className="grau-value">
                          <span className="label">Cil:</span>
                          <span className="value">
                            {formatGrau(grau.cilindricoOE)}
                          </span>
                        </div>
                        <div className="grau-value">
                          <span className="label">Eixo:</span>
                          <span className="value">{grau.eixoOE}°</span>
                        </div>
                        <div className="grau-value">
                          <span className="label">DP:</span>
                          <span className="value">{grau.dpoe}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="date-text">
                        {formatDate(grau.dataReceita)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            navigate(`/clientes/${grau.clienteId}`)
                          }
                          className="btn btn-icon btn-sm"
                          title="Ver Cliente"
                        >
                          <User size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/graus/editar/${grau.id}`)}
                          className="btn btn-icon btn-sm"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(
                              grau.id,
                              getClienteNome(grau.clienteId)
                            )
                          }
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
            {filteredGraus.map((grau) => (
              <div key={grau.id} className="grau-card">
                <div className="grau-card-header">
                  <div className="cliente-info">
                    <div className="cliente-avatar">
                      {getClienteNome(grau.clienteId).charAt(0).toUpperCase()}
                    </div>
                    <div className="cliente-details">
                      <h3 className="cliente-nome">
                        {getClienteNome(grau.clienteId)}
                      </h3>
                      <p className="grau-date">
                        <Calendar size={14} />
                        {formatDate(grau.dataReceita)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grau-card-body">
                  <div className="olhos-container">
                    <div className="olho-info">
                      <h4>OD (Direito)</h4>
                      <div className="grau-values-mobile">
                        <span>Esf: {formatGrau(grau.esfericoOD)}</span>
                        <span>Cil: {formatGrau(grau.cilindricoOD)}</span>
                        <span>Eixo: {grau.eixoOD}°</span>
                        <span>DP: {grau.dpod}</span>
                      </div>
                    </div>

                    <div className="olho-info">
                      <h4>OE (Esquerdo)</h4>
                      <div className="grau-values-mobile">
                        <span>Esf: {formatGrau(grau.esfericoOE)}</span>
                        <span>Cil: {formatGrau(grau.cilindricoOE)}</span>
                        <span>Eixo: {grau.eixoOE}°</span>
                        <span>DP: {grau.dpoe}</span>
                      </div>
                    </div>
                  </div>

                  {grau.observacoes && (
                    <div className="grau-observacoes-mobile">
                      <strong>Observações:</strong> {grau.observacoes}
                    </div>
                  )}
                </div>

                <div className="grau-card-footer">
                  <button
                    onClick={() => navigate(`/clientes/${grau.clienteId}`)}
                    className="btn btn-outline btn-sm"
                  >
                    <User size={16} />
                    Ver Cliente
                  </button>
                  <button
                    onClick={() => navigate(`/graus/editar/${grau.id}`)}
                    className="btn btn-primary btn-sm"
                  >
                    <Edit2 size={16} />
                    Editar
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

export default GrausList;
