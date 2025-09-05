// src/types/index.ts
export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento: string;
  dataCadastro: string;
}

export interface CreateClienteDto {
  nome: string;
  cpf: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento: string;
}

export interface UpdateClienteDto {
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}

export interface GrauLente {
  id: number;
  clienteId: number;
  clienteNome?: string;
  esfericoOD: number;
  cilindricoOD: number;
  eixoOD: number;
  dpod: number;
  esfericoOE: number;
  cilindricoOE: number;
  eixoOE: number;
  dpoe: number;
  observacoes?: string;
  dataReceita: string;
}

export interface CreateGrauLenteDto {
  clienteId: number;
  esfericoOD: number;
  cilindricoOD: number;
  eixoOD: number;
  dpod: number;
  esfericoOE: number;
  cilindricoOE: number;
  eixoOE: number;
  dpoe: number;
  observacoes?: string;
  dataReceita: string;
}

export enum TipoServico {
  Venda = 1,
  Conserto = 2,
  Ajuste = 3,
  Troca = 4,
}

export enum StatusServico {
  Pendente = 1,
  Concluido = 2,
  Cancelado = 3,
}

export interface Servico {
  id: number;
  clienteId: number;
  clienteNome?: string;
  tipoServico: TipoServico;
  tipoServicoDescricao: string;
  descricao: string;
  valor: number;
  dataServico: string;
  status: StatusServico;
  statusDescricao: string;
}

export interface CreateServicoDto {
  clienteId: number;
  tipoServico: TipoServico;
  descricao: string;
  valor: number;
  dataServico: string;
}

export interface UpdateServicoDto {
  tipoServico: TipoServico;
  descricao: string;
  valor: number;
  dataServico: string;
  status: StatusServico;
}

// Tipos utilitários
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Tipos para formulários
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean;
}

// Tipos para hooks
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<T>;
  execute: (...args: any[]) => Promise<T>;
}

export interface UseFormResult<T> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  setValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, isTouched?: boolean) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  validate: () => boolean;
  reset: () => void;
  setFormValues: (newValues: Partial<T>) => void;
  isValid: boolean;
  isDirty: boolean;
}
