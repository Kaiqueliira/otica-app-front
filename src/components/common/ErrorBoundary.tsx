// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log do erro (em produção, enviar para serviço de monitoramento)
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Ops! Algo deu errado</h2>
            <p>Ocorreu um erro inesperado na aplicação.</p>

            <div className="error-actions">
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Recarregar Página
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => this.setState({ hasError: false })}
              >
                Tentar Novamente
              </button>
            </div>

            {import.meta.env.DEV && (
              <details className="error-details">
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre className="error-stack">
                  {this.state.error?.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
