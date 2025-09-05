// src/components/graus/GrauForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Search,
  User,
  Eye,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { grauService } from "@/services/grauService";
import { clienteService } from "@/services/clienteService";
import { useForm } from "@/hooks/useForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { CreateGrauLenteDto, Cliente } from "@/types";
import "./GrauForm.css";

interface GrauFormData {
  clienteId: string;
  esfericoOD: string;
  cilindricoOD: string;
  eixoOD: string;
  dpod: string;
  esfericoOE: string;
  cilindricoOE: string;
  eixoOE: string;
  dpoe: string;
  observacoes: string;
  dataReceita: string;
}

const GrauForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const preSelectedClienteId = searchParams.get("clienteId");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const initialValues: GrauFormData = {
    clienteId: preSelectedClienteId || "",
    esfericoOD: "0.00",
    cilindricoOD: "0.00",
    eixoOD: "0",
    dpod: "32.0",
    esfericoOE: "0.00",
    cilindricoOE: "0.00",
    eixoOE: "0",
    dpoe: "32.0",
    observacoes: "",
    dataReceita: new Date().toISOString().split("T")[0],
  };

  const validationRules = {
    clienteId: (value: string) => {
      if (!value) return "Cliente é obrigatório";
      return undefined;
    },
    esfericoOD: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < -30 || num > 30) return "Valor deve estar entre -30 e +30";
      return undefined;
    },
    cilindricoOD: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < -10 || num > 10) return "Valor deve estar entre -10 e +10";
      return undefined;
    },
    eixoOD: (value: string) => {
      const num = parseInt(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < 0 || num > 180) return "Valor deve estar entre 0 e 180";
      return undefined;
    },
    dpod: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < 20 || num > 40) return "Valor deve estar entre 20 e 40";
      return undefined;
    },
    esfericoOE: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < -30 || num > 30) return "Valor deve estar entre -30 e +30";
      return undefined;
    },
    cilindricoOE: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < -10 || num > 10) return "Valor deve estar entre -10 e +10";
      return undefined;
    },
    eixoOE: (value: string) => {
      const num = parseInt(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < 0 || num > 180) return "Valor deve estar entre 0 e 180";
      return undefined;
    },
    dpoe: (value: string) => {
      const num = parseFloat(value);
      if (isNaN(num)) return "Valor inválido";
      if (num < 20 || num > 40) return "Valor deve estar entre 20 e 40";
      return undefined;
    },
    dataReceita: (value: string) => {
      if (!value) return "Data da receita é obrigatória";
      const date = new Date(value);
      const today = new Date();
      if (date > today) return "Data não pode ser futura";
      return undefined;
    },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    setFormValues,
    isValid,
  } = useForm(initialValues, validationRules);

  // Carregar clientes
  useEffect(() => {
    const loadClientes = async () => {
      try {
        const clientesData = await clienteService.getAll();
        setClientes(clientesData);

        // Se houver cliente pré-selecionado
        if (preSelectedClienteId) {
          const cliente = clientesData.find(
            (c) => c.id === parseInt(preSelectedClienteId)
          );
          setSelectedCliente(cliente || null);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    };
    loadClientes();
  }, [preSelectedClienteId]);

  // Carregar dados do grau para edição
  useEffect(() => {
    if (isEditing && id) {
      const loadGrau = async () => {
        try {
          setInitialLoading(true);
          const grau = await grauService.getById(parseInt(id));

          setFormValues({
            clienteId: grau.clienteId.toString(),
            esfericoOD: grau.esfericoOD.toString(),
            cilindricoOD: grau.cilindricoOD.toString(),
            eixoOD: grau.eixoOD.toString(),
            dpod: grau.dpod.toString(),
            esfericoOE: grau.esfericoOE.toString(),
            cilindricoOE: grau.cilindricoOE.toString(),
            eixoOE: grau.eixoOE.toString(),
            dpoe: grau.dpoe.toString(),
            observacoes: grau.observacoes || "",
            dataReceita: grau.dataReceita.split("T")[0],
          });

          const cliente = clientes.find((c) => c.id === grau.clienteId);
          setSelectedCliente(cliente || null);
        } catch (error) {
          console.error("Erro ao carregar grau:", error);
          navigate("/graus");
        } finally {
          setInitialLoading(false);
        }
      };

      loadGrau();
    }
  }, [id, isEditing, navigate, setFormValues, clientes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const grauData: CreateGrauLenteDto = {
        clienteId: parseInt(values.clienteId),
        esfericoOD: parseFloat(values.esfericoOD),
        cilindricoOD: parseFloat(values.cilindricoOD),
        eixoOD: parseInt(values.eixoOD),
        dpod: parseFloat(values.dpod),
        esfericoOE: parseFloat(values.esfericoOE),
        cilindricoOE: parseFloat(values.cilindricoOE),
        eixoOE: parseInt(values.eixoOE),
        dpoe: parseFloat(values.dpoe),
        observacoes: values.observacoes,
        dataReceita: new Date(values.dataReceita).toISOString(),
      };

      if (isEditing && id) {
        await grauService.update(parseInt(id), grauData);
      } else {
        await grauService.create(grauData);
      }

      navigate("/graus");
    } catch (error) {
      console.error("Erro ao salvar grau:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
    const clienteId = parseInt(e.target.value);
    const cliente = clientes.find((c) => c.id === clienteId);
    setSelectedCliente(cliente || null);
  };

  const copyODtoOE = () => {
    setFormValues({
      esfericoOE: values.esfericoOD,
      cilindricoOE: values.cilindricoOD,
      eixoOE: values.eixoOD,
      dpoe: values.dpod,
    });
  };

  if (initialLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando dados do grau..." />
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
              onClick={() => navigate("/graus")}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>

          <div>
            <h1 className="page-title">
              <Search size={32} />
              {isEditing ? "Editar Grau" : "Novo Grau"}
            </h1>
            <p className="page-description">
              {isEditing
                ? "Atualize as informações do grau de lente"
                : "Cadastre um novo grau de lente"}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Cliente Info */}
      {selectedCliente && (
        <div className="selected-cliente-info">
          <div className="cliente-avatar">
            {selectedCliente.nome.charAt(0).toUpperCase()}
          </div>
          <div className="cliente-details">
            <h3>{selectedCliente.nome}</h3>
            <p>
              CPF:{" "}
              {selectedCliente.cpf.replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                "$1.$2.$3-$4"
              )}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grau-form">
        <div className="form-section">
          <h3 className="form-section-title">
            <User size={20} />
            Cliente e Data
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clienteId" className="form-label required">
                Cliente
              </label>
              <select
                id="clienteId"
                name="clienteId"
                value={values.clienteId}
                onChange={handleClienteChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.clienteId && touched.clienteId ? "error" : ""
                }`}
                disabled={loading || !!preSelectedClienteId}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} -{" "}
                    {cliente.cpf.replace(
                      /(\d{3})(\d{3})(\d{3})(\d{2})/,
                      "$1.$2.$3-$4"
                    )}
                  </option>
                ))}
              </select>
              {errors.clienteId && touched.clienteId && (
                <span className="form-error">{errors.clienteId}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="dataReceita" className="form-label required">
                <Calendar size={16} />
                Data da Receita
              </label>
              <input
                type="date"
                id="dataReceita"
                name="dataReceita"
                value={values.dataReceita}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.dataReceita && touched.dataReceita ? "error" : ""
                }`}
                disabled={loading}
              />
              {errors.dataReceita && touched.dataReceita && (
                <span className="form-error">{errors.dataReceita}</span>
              )}
            </div>
          </div>
        </div>

        <div className="olhos-container">
          {/* Olho Direito */}
          <div className="olho-section">
            <h3 className="form-section-title">
              <Eye size={20} />
              Olho Direito (OD)
            </h3>

            <div className="grau-fields">
              <div className="form-group">
                <label htmlFor="esfericoOD" className="form-label">
                  Esférico
                </label>
                <input
                  type="number"
                  id="esfericoOD"
                  name="esfericoOD"
                  value={values.esfericoOD}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.esfericoOD && touched.esfericoOD ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.25"
                  min="-30"
                  max="30"
                />
                {errors.esfericoOD && touched.esfericoOD && (
                  <span className="form-error">{errors.esfericoOD}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cilindricoOD" className="form-label">
                  Cilíndrico
                </label>
                <input
                  type="number"
                  id="cilindricoOD"
                  name="cilindricoOD"
                  value={values.cilindricoOD}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.cilindricoOD && touched.cilindricoOD ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.25"
                  min="-10"
                  max="10"
                />
                {errors.cilindricoOD && touched.cilindricoOD && (
                  <span className="form-error">{errors.cilindricoOD}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="eixoOD" className="form-label">
                  Eixo (°)
                </label>
                <input
                  type="number"
                  id="eixoOD"
                  name="eixoOD"
                  value={values.eixoOD}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.eixoOD && touched.eixoOD ? "error" : ""
                  }`}
                  disabled={loading}
                  min="0"
                  max="180"
                />
                {errors.eixoOD && touched.eixoOD && (
                  <span className="form-error">{errors.eixoOD}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dpod" className="form-label">
                  DP (mm)
                </label>
                <input
                  type="number"
                  id="dpod"
                  name="dpod"
                  value={values.dpod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.dpod && touched.dpod ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.5"
                  min="20"
                  max="40"
                />
                {errors.dpod && touched.dpod && (
                  <span className="form-error">{errors.dpod}</span>
                )}
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <div className="copy-section">
            <button
              type="button"
              onClick={copyODtoOE}
              className="btn btn-outline btn-sm copy-button"
              disabled={loading}
              title="Copiar valores do olho direito para o esquerdo"
            >
              ↓ Copiar OD → OE ↓
            </button>
          </div>

          {/* Olho Esquerdo */}
          <div className="olho-section">
            <h3 className="form-section-title">
              <Eye size={20} />
              Olho Esquerdo (OE)
            </h3>

            <div className="grau-fields">
              <div className="form-group">
                <label htmlFor="esfericoOE" className="form-label">
                  Esférico
                </label>
                <input
                  type="number"
                  id="esfericoOE"
                  name="esfericoOE"
                  value={values.esfericoOE}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.esfericoOE && touched.esfericoOE ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.25"
                  min="-30"
                  max="30"
                />
                {errors.esfericoOE && touched.esfericoOE && (
                  <span className="form-error">{errors.esfericoOE}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cilindricoOE" className="form-label">
                  Cilíndrico
                </label>
                <input
                  type="number"
                  id="cilindricoOE"
                  name="cilindricoOE"
                  value={values.cilindricoOE}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.cilindricoOE && touched.cilindricoOE ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.25"
                  min="-10"
                  max="10"
                />
                {errors.cilindricoOE && touched.cilindricoOE && (
                  <span className="form-error">{errors.cilindricoOE}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="eixoOE" className="form-label">
                  Eixo (°)
                </label>
                <input
                  type="number"
                  id="eixoOE"
                  name="eixoOE"
                  value={values.eixoOE}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.eixoOE && touched.eixoOE ? "error" : ""
                  }`}
                  disabled={loading}
                  min="0"
                  max="180"
                />
                {errors.eixoOE && touched.eixoOE && (
                  <span className="form-error">{errors.eixoOE}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dpoe" className="form-label">
                  DP (mm)
                </label>
                <input
                  type="number"
                  id="dpoe"
                  name="dpoe"
                  value={values.dpoe}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.dpoe && touched.dpoe ? "error" : ""
                  }`}
                  disabled={loading}
                  step="0.5"
                  min="20"
                  max="40"
                />
                {errors.dpoe && touched.dpoe && (
                  <span className="form-error">{errors.dpoe}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="form-section">
          <h3 className="form-section-title">
            <MessageSquare size={20} />
            Observações
          </h3>

          <div className="form-group">
            <label htmlFor="observacoes" className="form-label">
              Observações Adicionais
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={values.observacoes}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              disabled={loading}
              rows={4}
              placeholder="Digite observações sobre o grau, recomendações especiais, etc..."
            />
            <div className="form-help">
              Informações adicionais sobre o grau, recomendações especiais, etc.
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/graus")}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !isValid}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEditing ? "Atualizar Grau" : "Cadastrar Grau"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrauForm;
