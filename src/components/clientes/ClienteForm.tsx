// src/components/clientes/ClienteForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { useForm } from "@/hooks/useForm";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import type { CreateClienteDto, UpdateClienteDto, Cliente } from "@/types";
import "./ClienteForm.css";

interface ClienteFormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
}

const ClienteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const initialValues: ClienteFormData = {
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
  };

  const validationRules = {
    nome: (value: string) => {
      if (!value.trim()) return "Nome é obrigatório";
      if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres";
      if (value.length > 100) return "Nome deve ter no máximo 100 caracteres";
      return undefined;
    },
    cpf: (value: string) => {
      if (!isEditing) {
        if (!value.trim()) return "CPF é obrigatório";
        if (value.length !== 11) return "CPF deve ter 11 dígitos";
        if (!/^\d+$/.test(value)) return "CPF deve conter apenas números";
      }
      return undefined;
    },
    email: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Email inválido";
      }
      return undefined;
    },
    telefone: (value: string) => {
      if (value && (value.length < 10 || value.length > 15)) {
        return "Telefone deve ter entre 10 e 15 caracteres";
      }
      return undefined;
    },
    dataNascimento: (value: string) => {
      if (!value) return "Data de nascimento é obrigatória";
      const date = new Date(value);
      const today = new Date();
      if (date >= today)
        return "Data de nascimento deve ser anterior à data atual";
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

  // Carregar dados do cliente para edição
  useEffect(() => {
    if (isEditing && id) {
      const loadCliente = async () => {
        try {
          setInitialLoading(true);
          const cliente = await clienteService.getById(parseInt(id));

          setFormValues({
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email || "",
            telefone: cliente.telefone || "",
            endereco: cliente.endereco || "",
            dataNascimento: cliente.dataNascimento.split("T")[0],
          });
        } catch (error) {
          console.error("Erro ao carregar cliente:", error);
          navigate("/clientes");
        } finally {
          setInitialLoading(false);
        }
      };

      loadCliente();
    }
  }, [id, isEditing, navigate, setFormValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing && id) {
        const updateData: UpdateClienteDto = {
          nome: values.nome,
          email: values.email,
          telefone: values.telefone,
          endereco: values.endereco,
        };
        await clienteService.update(parseInt(id), updateData);
      } else {
        const createData: CreateClienteDto = {
          nome: values.nome,
          cpf: values.cpf,
          email: values.email,
          telefone: values.telefone,
          endereco: values.endereco,
          dataNascimento: new Date(values.dataNascimento).toISOString(),
        };
        await clienteService.create(createData);
      }

      navigate("/clientes");
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(\d{4})-(\d)(\d{4})/, "$1$2-$3")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    e.target.value = formatted;
    handleChange(e);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
    handleChange(e);
  };

  if (initialLoading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Carregando dados do cliente..." />
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

          <div>
            <h1 className="page-title">
              <User size={32} />
              {isEditing ? "Editar Cliente" : "Novo Cliente"}
            </h1>
            <p className="page-description">
              {isEditing
                ? "Atualize as informações do cliente"
                : "Cadastre um novo cliente no sistema"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="cliente-form">
        <div className="form-section">
          <h3 className="form-section-title">
            <User size={20} />
            Informações Pessoais
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome" className="form-label required">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={values.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.nome && touched.nome ? "error" : ""
                }`}
                disabled={loading}
                placeholder="Digite o nome completo"
              />
              {errors.nome && touched.nome && (
                <span className="form-error">{errors.nome}</span>
              )}
            </div>

            {!isEditing && (
              <div className="form-group">
                <label htmlFor="cpf" className="form-label required">
                  <CreditCard size={16} />
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={values.cpf}
                  onChange={handleCPFChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.cpf && touched.cpf ? "error" : ""
                  }`}
                  disabled={loading}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && touched.cpf && (
                  <span className="form-error">{errors.cpf}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="dataNascimento" className="form-label required">
                <Calendar size={16} />
                Data de Nascimento
              </label>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                value={values.dataNascimento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.dataNascimento && touched.dataNascimento ? "error" : ""
                }`}
                disabled={loading || isEditing}
              />
              {errors.dataNascimento && touched.dataNascimento && (
                <span className="form-error">{errors.dataNascimento}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">
            <Phone size={20} />
            Contato
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.email && touched.email ? "error" : ""
                }`}
                disabled={loading}
                placeholder="exemplo@email.com"
              />
              {errors.email && touched.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                <Phone size={16} />
                Telefone
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={values.telefone}
                onChange={handlePhoneChange}
                onBlur={handleBlur}
                className={`form-control ${
                  errors.telefone && touched.telefone ? "error" : ""
                }`}
                disabled={loading}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
              {errors.telefone && touched.telefone && (
                <span className="form-error">{errors.telefone}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">
            <MapPin size={20} />
            Endereço
          </h3>

          <div className="form-group">
            <label htmlFor="endereco" className="form-label">
              Endereço Completo
            </label>
            <textarea
              id="endereco"
              name="endereco"
              value={values.endereco}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              disabled={loading}
              rows={3}
              placeholder="Rua, número, bairro, cidade, CEP..."
            />
            <div className="form-help">
              Inclua rua, número, bairro, cidade e CEP
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/clientes")}
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
                {isEditing ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
