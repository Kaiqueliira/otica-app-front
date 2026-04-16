# React Patterns (Boas Práticas)

## 1. Tipagem Estrita (TypeScript)

- **SEMPRE** defina interfaces em `src/types/` e importe nos componentes e serviços.
- Exemplo de retorno de serviço:
  ```typescript
  async getAll(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
  }
  ```

## 2. Separação de Preocupações (Hooks customizados)

- Ao criar formulários, utilize a abstração `useForm` ou crie state local separado por objetos (`const [form, setForm] = useState<Dto>({...})`), mas extraia regras pesadas do componente principal.
- Para fetch inicial em tabelas/listas, prefira invocar Services num `useEffect` na montagem (`useEffect(() => { loadData(); }, [])`), exibindo um `LoadingSpinner` enquanto `loading === true`.

## 3. Gestão de CSS (Vanilla)

- As variáveis de cor, raio e espaçamentos (ex: `--primary-color`, `--border-radius`) devem ser definidas em `src/index.css` e reutilizadas em todas as folhas de estilo dos componentes.
- Nomeie os arquivos CSS com o mesmo nome do componente associado (ex: `ClienteDetalhes.css` ao lado de `ClienteDetalhes.tsx`).

## 4. UI Feedback

- Modificações de dados (POST, PUT, DELETE) devem invocar `toast.success` ou `toast.error` utilizando a biblioteca `react-toastify` em caso de sucesso/falha.
