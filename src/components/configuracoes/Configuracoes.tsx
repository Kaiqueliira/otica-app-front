import React, { useState, useRef } from "react";
import { Download, Upload, Database } from "lucide-react";
import { toast } from "react-toastify";
import { backupService } from "@/services/backupService";

const Configuracoes: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await backupService.exportBackup();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OpticaApp_Backup_${new Date().toISOString().replace(/[:.]/g, "-")}.bak`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Backup exportado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar backup.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJson = async () => {
    try {
      setIsExporting(true);
      const blob = await backupService.exportBackupJson();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `OpticaApp_Migration_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("JSON de migração exportado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao exportar JSON.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !window.confirm(
        "ATENÇÃO: Restaurar um backup irá sobrescrever TODOS os dados atuais do banco de dados. Deseja continuar?",
      )
    ) {
      e.target.value = "";
      return;
    }

    try {
      setIsImporting(true);
      toast.info("Restaurando backup... Aguarde.", {
        autoClose: false,
        toastId: "restoring",
      });
      await backupService.importBackup(file);
      toast.dismiss("restoring");
      toast.success("Backup restaurado com sucesso!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.dismiss("restoring");
      console.error(error);
      toast.error("Erro ao restaurar backup.");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-description">Gerenciamento do sistema e backups</p>
      </div>

      <div className="section">
        <h2
          className="section-title"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Database size={24} /> Backup e Restauração
        </h2>
        <p style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>
          Gere um arquivo .bak contendo todos os dados do sistema ou restaure a
          partir de um arquivo previamente exportado.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isExporting || isImporting}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Download size={20} />
            {isExporting ? "Exportando..." : "Exportar Backup (.bak)"}
          </button>

          <button
            className="btn btn-primary"
            onClick={handleExportJson}
            disabled={isExporting || isImporting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#10b981",
              borderColor: "#10b981",
            }}
          >
            <Download size={20} />
            Exportar JSON (Para Migração)
          </button>

          <button
            className="btn btn-warning"
            onClick={handleImportClick}
            disabled={isExporting || isImporting}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Upload size={20} />
            {isImporting ? "Restaurando..." : "Importar Backup (.bak)"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".bak"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
