# Skill: React + TypeScript (Frontend OpticaCRUD)

## Visão Geral
Aplicação construída como SPA (Single Page Application) focada em performance e tipagem rigorosa.

## Core Stack
- **Build Tool:** Vite
- **Framework:** React 18
- **Linguagem:** TypeScript
- **Estilização:** CSS puro com CSS Modules (ou arquivos de CSS importados diretamente por componente), usando CSS Variables (`var(--primary-color)`).
- **HTTP Client:** Axios (configurado em `apiServices.ts`).
- **Icons:** `lucide-react`.
- **Alertas:** `react-toastify`.
- **Router:** `react-router-dom` (v6).

## Organização de Pastas (`/src`)
- `/components`: Agrupamento de UI por feature (ex: `clientes`, `graus`, `servicos`) e `/common` para componentes genéricos.
- `/hooks`: Custom hooks como `useApi.ts` e `useForm.ts` para padronizar fetching de dados e state de formulários.
- `/services`: Funções encapsuladas do Axios (ex: `clienteService.ts`), servindo como ponte com o backend.
- `/types`: Definição global de interfaces (DTOs e Entities vindos do backend).

## Diretrizes Principais
- Evitar poluição do CSS global, utilizando escopo por componente.
- Toda requisição assíncrona deve utilizar blocos `try/catch` e mostrar feedbacks (`toast`) baseados em sucesso ou erro.
- Manter a UI o mais declarativa possível.
