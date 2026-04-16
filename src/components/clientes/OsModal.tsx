import React, { useState } from 'react';
import { GrauLente, Servico } from '@/types';
import ordemServicoService from '@/services/ordemServicoService';
import './OsModal.css';

interface OsModalProps {
  clienteId: number;
  graus: GrauLente[];
  servicos: Servico[];
  onClose: () => void;
}

const OsModal: React.FC<OsModalProps> = ({ clienteId, graus, servicos, onClose }) => {
  const [tipo, setTipo] = useState<'Servico' | 'Grau'>('Servico');
  const [servicoId, setServicoId] = useState<number | ''>('');
  const [grauLenteId, setGrauLenteId] = useState<number | ''>('');
  
  const [dataEntregaPrevista, setDataEntregaPrevista] = useState('');
  const [armacao, setArmacao] = useState('');
  const [lente, setLente] = useState('');
  const [altura, setAltura] = useState('');
  const [medico, setMedico] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const os = await ordemServicoService.create({
        clienteId,
        tipo,
        servicoId: servicoId ? Number(servicoId) : undefined,
        grauLenteId: grauLenteId ? Number(grauLenteId) : undefined,
        dataEntregaPrevista: dataEntregaPrevista || undefined,
        armacao,
        lente,
        altura: altura ? Number(altura) : undefined,
        medico,
        valorTotal: Number(valorTotal)
      });
      
      const html = await ordemServicoService.getHtml(os.id);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      onClose();
    } catch (error) {
      console.error('Erro ao gerar OS', error);
      alert('Erro ao gerar Ordem de Serviço. Verifique os dados inseridos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="os-modal-overlay">
      <div className="os-modal">
        <div className="os-modal-header">
          <h2>Gerar Ordem de Serviço</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="os-modal-form">
          <div className="form-group">
            <label>Tipo de Referência</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as 'Servico' | 'Grau')}>
              <option value="Servico">Serviço</option>
              <option value="Grau">Grau</option>
            </select>
          </div>
          
          {tipo === 'Servico' && (
            <div className="form-group">
              <label>Selecione o Serviço</label>
              <select value={servicoId} onChange={e => {
                setServicoId(e.target.value);
                const s = servicos.find(s => s.id === Number(e.target.value));
                if (s) setValorTotal(s.valor.toString());
              }} >
                <option value="">-- Selecione --</option>
                {servicos.map(s => (
                  <option key={s.id} value={s.id}>{s.tipoServicoDescricao} - R$ {s.valor}</option>
                ))}
              </select>
            </div>
          )}
          
          {tipo === 'Grau' && (
            <div className="form-group">
              <label>Selecione o Grau</label>
              <select value={grauLenteId} onChange={e => setGrauLenteId(e.target.value)} >
                <option value="">-- Selecione --</option>
                {graus.map(g => (
                  <option key={g.id} value={g.id}>{new Date(g.dataReceita).toLocaleDateString('pt-BR')} - {g.observacoes}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Data Entrega Prevista</label>
            <input type="date" value={dataEntregaPrevista} onChange={e => setDataEntregaPrevista(e.target.value)} required />
          </div>

          {tipo === 'Grau' && (
            <>
              <div className="form-group">
                <label>Armação</label>
                <input type="text" value={armacao} onChange={e => setArmacao(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Lente</label>
                <input type="text" value={lente} onChange={e => setLente(e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label>Altura</label>
                  <input type="number" step="0.01" value={altura} onChange={e => setAltura(e.target.value)} />
                </div>
                <div className="form-group half">
                  <label>Médico</label>
                  <input type="text" value={medico} onChange={e => setMedico(e.target.value)} />
                </div>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Valor Total (R$)</label>
            <input type="number" step="0.01" value={valorTotal} onChange={e => setValorTotal(e.target.value)} required />
          </div>

          <div className="os-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar OS'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OsModal;