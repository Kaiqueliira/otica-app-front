// src/components/clientes/ClienteDetalhes.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Plus,
  Eye,
} from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { grauService } from "@/services/grauService";
import { servicoService } from "@/services/servicoService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { Cliente, GrauLente, Servico } from "@/types";
import "./ClienteDetalhes.css";

const ClienteDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [graus, setGraus] = useState<GrauLente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"info" | "graus" | "servicos">(
    "info"
  );

  useEffect(() => {
    if (!id) {
      navigate("/clientes");
      return;
    }

    const loadClienteData = async () => {
      try {
        setLoading(true);
        const clienteId = parseInt(id);

        const [clienteData, grausData, servicosData] = await Promise.all([
          clienteService.getById(clienteId),
          grauService.getByClienteId(clienteId),
          servicoService.getByClienteId(clienteId),
        ]);

        setCliente(clienteData);
        setGraus(grausData);
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error);
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };

    loadClienteData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!cliente) return;

    if (
      window.confirm(
        `Tem certeza que deseja excluir o cliente "${cliente.nome}"?`
      )
    ) {
      try {
        await clienteService.delete(cliente.id);
        navigate("/clientes");
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  const getIdade = (dataNascimento: string) => {
    const birth = new Date(dataNascimento);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando dados do cliente..." />
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h3>Cliente não encontrado</h3>
          <p>O cliente solicitado não existe ou foi removido.</p>
          <Link to="/clientes" className="btn btn-primary">
            Voltar para Lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="page-nav">
            <button
              onClick={() => navigate("/clientes")}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>

          <div className="cliente-header-info">
            <div className="cliente-avatar-large">
              {cliente.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="page-title">{cliente.nome}</h1>
              <p className="page-description">
                Cliente desde {formatDate(cliente.dataCadastro)}
              </p>
            </div>
          </div>

          <div className="page-actions">
            <Link
              to={`/clientes/editar/${cliente.id}`}
              className="btn btn-outline"
            >
              <Edit2 size={16} />
              Editar
            </Link>

            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={16} />
              Excluir
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="cliente-stats">
        <div className="stat-item">
          <div className="stat-value">{graus.length}</div>
          <div className="stat-label">Graus Cadastrados</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{servicos.length}</div>
          <div className="stat-label">Serviços Realizados</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{getIdade(cliente.dataNascimento)}</div>
          <div className="stat-label">Anos de Idade</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            R${" "}
            {servicos
              .reduce((total, servico) => total + servico.valor, 0)
              .toFixed(2)}
          </div>
          <div className="stat-label">Total em Serviços</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="cliente-tabs">
        <div className="tab-list">
          <button
            className={`tab-button ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            <User size={16} />
            Informações
          </button>
          <button
            className={`tab-button ${activeTab === "graus" ? "active" : ""}`}
            onClick={() => setActiveTab("graus")}
          >
            <Search size={16} />
            Graus ({graus.length})
          </button>
          <button
            className={`tab-button ${activeTab === "servicos" ? "active" : ""}`}
            onClick={() => setActiveTab("servicos")}
          >
            <Settings size={16} />
            Serviços ({servicos.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "info" && (
            <div className="info-content">
              <div className="info-section">
                <h3 className="info-section-title">
                  <User size={20} />
                  Dados Pessoais
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nome Completo:</label>
                    <span>{cliente.nome}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <CreditCard size={16} /> CPF:
                    </label>
                    <span>{formatCPF(cliente.cpf)}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <Calendar size={16} /> Data de Nascimento:
                    </label>
                    <span>
                      {formatDate(cliente.dataNascimento)} (
                      {getIdade(cliente.dataNascimento)} anos)
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Cadastrado em:</label>
                    <span>{formatDate(cliente.dataCadastro)}</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3 className="info-section-title">
                  <Phone size={20} />
                  Contato
                </h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>
                      <Mail size={16} /> Email:
                    </label>
                    <span>{cliente.email || "Não informado"}</span>
                  </div>
                  <div className="info-item">
                    <label>
                      <Phone size={16} /> Telefone:
                    </label>
                    <span>
                      {cliente.telefone
                        ? formatPhone(cliente.telefone)
                        : "Não informado"}
                    </span>
                  </div>
                </div>
              </div>

              {cliente.endereco && (
                <div className="info-section">
                  <h3 className="info-section-title">
                    <MapPin size={20} />
                    Endereço
                  </h3>
                  <div className="info-grid">
                    <div className="info-item full-width">
                      <label>Endereço Completo:</label>
                      <span>{cliente.endereco}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "graus" && (
            <div className="graus-content">
              <div className="section-header">
                <h3>Graus de Lentes</h3>
                <Link
                  to={`/graus/novo?clienteId=${cliente.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} />
                  Novo Grau
                </Link>
              </div>

              {graus.length === 0 ? (
                <div className="empty-state-small">
                  <Search size={32} />
                  <p>Nenhum grau cadastrado para este cliente</p>
                  <Link
                    to={`/graus/novo?clienteId=${cliente.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Cadastrar Primeiro Grau
                  </Link>
                </div>
              ) : (
                <div className="graus-list">
                  {graus.map((grau) => (
                    <div key={grau.id} className="grau-card">
                      <div className="grau-header">
                        <span className="grau-date">
                          {formatDate(grau.dataReceita)}
                        </span>
                        <Link
                          to={`/graus/editar/${grau.id}`}
                          className="btn btn-icon btn-sm"
                        >
                          <Edit2 size={14} />
                        </Link>
                      </div>

                      <div className="grau-body">
                        <div className="olho-info">
                          <h4>Olho Direito (OD)</h4>
                          <div className="grau-values">
                            <span>Esf: {grau.esfericoOD}</span>
                            <span>Cil: {grau.cilindricoOD}</span>
                            <span>Eixo: {grau.eixoOD}°</span>
                            <span>DP: {grau.dpod}</span>
                          </div>
                        </div>

                        <div className="olho-info">
                          <h4>Olho Esquerdo (OE)</h4>
                          <div className="grau-values">
                            <span>Esf: {grau.esfericoOE}</span>
                            <span>Cil: {grau.cilindricoOE}</span>
                            <span>Eixo: {grau.eixoOE}°</span>
                            <span>DP: {grau.dpoe}</span>
                          </div>
                        </div>
                      </div>

                      {grau.observacoes && (
                        <div className="grau-footer">
                          <strong>Observações:</strong> {grau.observacoes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "servicos" && (
            <div className="servicos-content">
              <div className="section-header">
                <h3>Serviços</h3>
                <Link
                  to={`/servicos/novo?clienteId=${cliente.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} />
                  Novo Serviço
                </Link>
              </div>

              {servicos.length === 0 ? (
                <div className="empty-state-small">
                  <Settings size={32} />
                  <p>Nenhum serviço registrado para este cliente</p>
                  <Link
                    to={`/servicos/novo?clienteId=${cliente.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Registrar Primeiro Serviço
                  </Link>
                </div>
              ) : (
                <div className="servicos-list">
                  {servicos.map((servico) => (
                    <div key={servico.id} className="servico-card">
                      <div className="servico-header">
                        <div className="servico-info">
                          <h4>{servico.tipoServicoDescricao}</h4>
                          <span className="servico-date">
                            {formatDate(servico.dataServico)}
                          </span>
                        </div>
                        <div className="servico-actions">
                          <span
                            className={`badge badge-${
                              servico.status === 1
                                ? "warning"
                                : servico.status === 2
                                ? "success"
                                : "danger"
                            }`}
                          >
                            {servico.statusDescricao}
                          </span>
                          <Link
                            to={`/servicos/editar/${servico.id}`}
                            className="btn btn-icon btn-sm"
                          >
                            <Edit2 size={14} />
                          </Link>
                        </div>
                      </div>

                      <div className="servico-body">
                        <p className="servico-descricao">{servico.descricao}</p>
                        <div className="servico-valor">
                          <strong>Valor: R$ {servico.valor.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetalhes;
