// src/components/Home.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Settings,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";
import "./Home.css";

const Home: React.FC = () => {
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
      count: "156",
      color: "primary",
    },
    {
      title: "Graus de Lentes",
      description: "Consultar e gerenciar graus",
      icon: Search,
      link: "/graus",
      count: "89",
      color: "success",
    },
    {
      title: "Serviços",
      description: "Acompanhar vendas e serviços",
      icon: Settings,
      link: "/servicos",
      count: "234",
      color: "warning",
    },
  ];

  const stats = [
    {
      label: "Total de Clientes",
      value: "156",
      icon: Users,
      change: "+12",
      changeType: "positive",
    },
    {
      label: "Serviços Pendentes",
      value: "8",
      icon: Clock,
      change: "-3",
      changeType: "positive",
    },
    {
      label: "Concluídos Hoje",
      value: "23",
      icon: CheckCircle,
      change: "+5",
      changeType: "positive",
    },
    {
      label: "Receita Mensal",
      value: "R$ 12.5k",
      icon: BarChart3,
      change: "+18%",
      changeType: "positive",
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Bem-vindo à Ótica CRUD</h1>
        <p className="page-description">
          Sistema de gerenciamento completo para sua ótica
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={`stat-change ${stat.changeType}`}>
                  {stat.change} este mês
                </div>
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

      {/* Recent Activity */}
      <div className="section">
        <h2 className="section-title">Atividade Recente</h2>
        <div className="activity-card">
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <CheckCircle size={16} />
              </div>
              <div className="activity-content">
                <p>
                  <strong>João Silva</strong> - Serviço concluído
                </p>
                <span className="activity-time">2 minutos atrás</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon primary">
                <Users size={16} />
              </div>
              <div className="activity-content">
                <p>
                  <strong>Maria Santos</strong> - Novo cliente cadastrado
                </p>
                <span className="activity-time">15 minutos atrás</span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon warning">
                <Search size={16} />
              </div>
              <div className="activity-content">
                <p>
                  <strong>Pedro Costa</strong> - Grau atualizado
                </p>
                <span className="activity-time">1 hora atrás</span>
              </div>
            </div>
          </div>

          <div className="activity-footer">
            <Link to="/atividades" className="btn btn-outline btn-sm">
              Ver todas as atividades
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
