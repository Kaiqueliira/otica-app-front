// src/components/servicos/ServicoForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Wrench,
  User,
  Calendar,
  DollarSign,
  FileText,
  Settings,
} from "lucide-react";
import { servicoService } from "@/services/servicoService";
import { clienteService } from "@/services/clienteService";
import { useForm } from "@/hooks/useForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type {
  CreateServicoDto,
  UpdateServicoDto,
  Cliente,
  TipoServico,
  StatusServico,
} from "@/types";

interface ServicoFormData {
  clienteId: string;
  tipoServico: string;
  descricao: string;
  valor: string;
  dataServico: string;
  status: string;
}

const ServicoForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const initialValues: ServicoFormData = {
    clienteId: searchParams.get("clienteId") || "",
    tipoServico: "1",
    descricao: "",
    valor: "",
    dataServico: new Date().toISOString().split("T")[0],
    status: "1",
  };

  const validationRules = {
    clienteId: (v: string) => !v && "Cliente é obrigatório",
    tipoServico: (v: string) => !v && "Tipo é obrigatório",
    descricao: (v: string) => v.length < 5 && "Descrição muito curta",
    valor: (v: string) => parseFloat(v) <= 0 && "Informe um valor válido",
    dataServico: (v: string) => !v && "Data é obrigatória",
    status: (v: string) => !v && "Status é obrigatório",
  };

  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFormValues,
    validate,
    isValid,
  } = useForm(initialValues, validationRules);

  useEffect(() => {
    clienteService.getAll().then(setClientes);
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      servicoService.getById(parseInt(id)).then((servico) => {
        setFormValues({
          clienteId: String(servico.clienteId),
          tipoServico: String(servico.tipoServico),
          descricao: servico.descricao,
          valor: String(servico.valor),
          dataServico: servico.dataServico.split("T")[0],
          status: String(servico.status),
        });
        setInitialLoading(false);
      });
    }
  }, [id, isEditing, setFormValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing && id) {
        const data: UpdateServicoDto = {
          tipoServico: parseInt(values.tipoServico) as TipoServico,
          descricao: values.descricao,
          valor: parseFloat(values.valor),
          dataServico: values.dataServico,
          status: parseInt(values.status) as StatusServico,
        };
        await servicoService.update(parseInt(id), data);
      } else {
        const data: CreateServicoDto = {
          clienteId: parseInt(values.clienteId),
          tipoServico: parseInt(values.tipoServico) as TipoServico,
          descricao: values.descricao,
          valor: parseFloat(values.valor),
          dataServico: values.dataServico,
        };
        await servicoService.create(data);
      }
      navigate("/servicos");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner message="Carregando serviço..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <div className="page-title">
              <Wrench size={20} />
              {isEditing ? "Editar Serviço" : "Novo Serviço"}
            </div>
            <p className="page-description">
              {isEditing
                ? "Altere os dados do serviço conforme necessário"
                : "Preencha as informações do novo serviço"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="servico-form">
        {/* Seção Cliente */}
        <div className="form-section">
          <h3 className="form-section-title">
            <User size={18} />
            Dados do Cliente
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Cliente</label>
              <select
                name="clienteId"
                value={values.clienteId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  touched.clienteId && errors.clienteId ? "error" : ""
                }`}
                disabled={isEditing}
              >
                <option value="">Selecione o cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {touched.clienteId && errors.clienteId && (
                <span className="form-error">{errors.clienteId}</span>
              )}
              {isEditing && (
                <span className="form-help">
                  O cliente não pode ser alterado durante a edição
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Seção Serviço */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Settings size={18} />
            Detalhes do Serviço
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Tipo de Serviço</label>
              <select
                name="tipoServico"
                value={values.tipoServico}
                onChange={handleChange}
                className="form-control"
              >
                <option value="1">Venda</option>
                <option value="2">Conserto</option>
                <option value="3">Ajuste</option>
                <option value="4">Troca</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="valor"
                value={values.valor}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  touched.valor && errors.valor ? "error" : ""
                }`}
                placeholder="0,00"
              />
              {touched.valor && errors.valor && (
                <span className="form-error">{errors.valor}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Data do Serviço</label>
              <input
                type="date"
                name="dataServico"
                value={values.dataServico}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  touched.dataServico && errors.dataServico ? "error" : ""
                }`}
              />
              {touched.dataServico && errors.dataServico && (
                <span className="form-error">{errors.dataServico}</span>
              )}
            </div>

            {isEditing && (
              <div className="form-group">
                <label className="form-label required">Status</label>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="1">Pendente</option>
                  <option value="2">Concluído</option>
                  <option value="3">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label required">Descrição</label>
              <textarea
                name="descricao"
                value={values.descricao}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  touched.descricao && errors.descricao ? "error" : ""
                }`}
                rows={4}
                placeholder="Descreva os detalhes do serviço..."
              />
              {touched.descricao && errors.descricao && (
                <span className="form-error">{errors.descricao}</span>
              )}
              <span className="form-help">Mínimo de 5 caracteres</span>
            </div>
          </div>
        </div>

        {/* Ações do formulário */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/servicos")}
            disabled={loading}
          >
            <ArrowLeft size={14} />
            Cancelar
          </button>

          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading || !isValid}
          >
            {!loading && <Save size={14} />}
            {isEditing ? "Salvar Alterações" : "Cadastrar Serviço"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServicoForm;
