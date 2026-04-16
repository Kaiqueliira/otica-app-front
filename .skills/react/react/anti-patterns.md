# React Anti-Patterns (O que NÃO fazer)

## 1. Múltiplos fetches perdidos no componente

🚫 **NÃO FAÇA:** Chamar `axios.get("http://localhost:5000/api/clientes")` diretamente dentro dos seus componentes `useEffect` sem um service intermediário.
✅ **FAÇA:** Use a pasta `src/services/` (ex: `clienteService.getAll()`).

## 2. Abuso do `any` no TypeScript

🚫 **NÃO FAÇA:** `const [cliente, setCliente] = useState<any>(null);`
✅ **FAÇA:** `const [cliente, setCliente] = useState<Cliente | null>(null);`

## 3. Estado solto para propriedades do mesmo contexto

🚫 **NÃO FAÇA:** Declarar dezenas de `useState` para um formulário (ex: `setNome`, `setCpf`, `setEmail`, etc).
✅ **FAÇA:** Use um objeto consolidado (`useState<CreateClienteDto>({...})`) ou o Hook de gerenciamento `useForm` contido no projeto.

## 4. Estilos Hardcoded

🚫 **NÃO FAÇA:** Passar dezenas de propriedades via `style={{ color: '#000', margin: '10px' }}` diretamente no JSX.
✅ **FAÇA:** Crie classes no arquivo CSS do componente. O uso de `style` inline só é justificado para propriedades extremamente dinâmicas calculadas em runtime.

## 5. Ignorar erros não tratados

🚫 **NÃO FAÇA:** Blocos `.catch(e => console.log(e))`.
✅ **FAÇA:** Apresente um erro compreensível ao usuário via UI (Toast ou mensagem inline), por exemplo `toast.error("Não foi possível excluir o cliente")`.
