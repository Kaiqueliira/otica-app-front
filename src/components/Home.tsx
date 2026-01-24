// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Settings,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import "./Home.css";
import { painelService } from "@/services/painelService";
import { Painel } from "@/types";

const Home: React.FC = () => {
  const [painelData, setPainelData] = useState<Painel | null>(null);
  const [showReceita, setShowReceita] = useState(false); // controle de exibição

  useEffect(() => {
    const obterDadosPainel = async () => {
      try {
        const painel = await painelService.getInfo();
        setPainelData(painel);
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      }
    };

    obterDadosPainel();
  }, []);

  const quickActions = [
    {
      title: "Novo Cliente",
      description: "Cadastrar um novo cliente",
      icon: Users,
      link: "/clientes/novo",
      color: "primary",
    },
    {
      title: "Novo Grau",
      description: "Registrar grau de lente",
      icon: Search,
      link: "/graus/novo",
      color: "success",
    },
    {
      title: "Novo Serviço",
      description: "Criar novo serviço",
      icon: Settings,
      link: "/servicos/novo",
      color: "warning",
    },
  ];

  const menuItems = [
    {
      title: "Clientes",
      description: "Gerenciar cadastro de clientes",
      icon: Users,
      link: "/clientes",
      count: painelData?.clientes?.toString() || "0",
      color: "primary",
    },
    {
      title: "Graus de Lentes",
      description: "Consultar e gerenciar graus",
      icon: Search,
      link: "/graus",
      count: painelData?.graus?.toString() || "0",
      color: "success",
    },
    {
      title: "Serviços",
      description: "Acompanhar vendas e serviços",
      icon: Settings,
      link: "/servicos",
      count: painelData?.servicos?.toString() || "0",
      color: "warning",
    },
  ];

  const stats = [
    {
      label: "Total de Clientes",
      value: painelData?.clientes?.toString() || "0",
      icon: Users,
    },
    {
      label: "Serviços Pendentes",
      value: painelData?.servicosPendentes?.toString() || "0",
      icon: Clock,
    },
    {
      label: "Concluídos Hoje",
      value: painelData?.concluidosHoje?.toString() || "0",
      icon: CheckCircle,
    },
    {
      label: "Receita Mensal",
      value: `R$ ${
        painelData?.receitaMensal?.toLocaleString("pt-BR") || "0,00"
      }`,
      icon: BarChart3,
      isReceitaMensal: true, // flag para saber que tem controle de visualização
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Bem-vindo</h1>
        <p className="page-description">Sistema de gerenciamento</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isReceita = stat.isReceitaMensal;

          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {isReceita && !showReceita ? "••••••" : stat.value}
                  {isReceita && (
                    <button
                      type="button"
                      className="btn-eye-toggle"
                      onClick={() => setShowReceita((prev) => !prev)}
                      title={showReceita ? "Ocultar valor" : "Mostrar valor"}
                    >
                      <Eye size={18} />
                    </button>
                  )}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Ações Rápidas</h2>
        <div className="quick-actions">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`quick-action-card ${action.color}`}
              >
                <div className="quick-action-icon">
                  <Icon size={24} />
                </div>
                <div className="quick-action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <Plus size={20} className="quick-action-arrow" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Menu */}
      <div className="section">
        <h2 className="section-title">Menu Principal</h2>
        <div className="menu-grid">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} to={item.link} className="menu-card">
                <div className={`menu-card-header ${item.color}`}>
                  <Icon size={32} />
                  <span className="menu-card-count">{item.count}</span>
                </div>
                <div className="menu-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
