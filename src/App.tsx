// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Componentes comuns
import Navbar from "@/components/common/Navbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// CSS
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Lazy loading dos componentes
const Home = React.lazy(() => import("@/components/Home"));
const ClientesList = React.lazy(
  () => import("@/components/clientes/ClientesList")
);
const ClienteForm = React.lazy(
  () => import("@/components/clientes/ClienteForm")
);
const ClienteDetalhes = React.lazy(
  () => import("@/components/clientes/ClienteDetalhes")
);
const GrausList = React.lazy(() => import("@/components/graus/GrausList"));
const GrauForm = React.lazy(() => import("@/components/graus/GrauForm"));
const ServicosList = React.lazy(
  () => import("@/components/servicos/ServicosList")
);
const ServicoForm = React.lazy(
  () => import("@/components/servicos/ServicoForm")
);

function App(): JSX.Element {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <ErrorBoundary>
            <Suspense
              fallback={<LoadingSpinner message="Carregando página..." />}
            >
              <Routes>
                <Route path="/" element={<Home />} />

                {/* Rotas de Clientes */}
                <Route path="/clientes" element={<ClientesList />} />
                <Route path="/clientes/novo" element={<ClienteForm />} />
                <Route path="/clientes/editar/:id" element={<ClienteForm />} />
                <Route path="/clientes/:id" element={<ClienteDetalhes />} />

                {/* Rotas de Graus */}
                <Route path="/graus" element={<GrausList />} />
                <Route path="/graus/novo" element={<GrauForm />} />
                <Route path="/graus/editar/:id" element={<GrauForm />} />

                {/* Rotas de Serviços */}
                <Route path="/servicos" element={<ServicosList />} />
                <Route path="/servicos/novo" element={<ServicoForm />} />
                <Route path="/servicos/editar/:id" element={<ServicoForm />} />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="not-found">
                      <h2>Página não encontrada</h2>
                      <p>A página que você está procurando não existe.</p>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
