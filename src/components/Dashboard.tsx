import React, { useState } from 'react';
import { Laudo, UserRole } from '../types/laudo';
import { PdfReportService } from '../services/pdfReport';
import {
  Plus,
  Search,
  FileDown,
  Share2,
  Eye,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Tag,
} from 'lucide-react';

interface DashboardProps {
  laudos: Laudo[];
  onNewLaudo: () => void;
  onViewLaudo: (laudo: Laudo) => void;
  onEditLaudo: (laudo: Laudo) => void;
  onDeleteLaudo: (id: string) => void;
  userRole: UserRole;
  onUserRoleChange: (role: UserRole) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  laudos,
  onNewLaudo,
  onViewLaudo,
  onEditLaudo,
  onDeleteLaudo,
  userRole,
  onUserRoleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Filtered Inspections
  const filteredLaudos = laudos.filter((l) => {
    const matchesSearch =
      l.veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.numeroLaudo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'aprovado' && l.conclusao.recomendacao === 'aprovado') ||
      (statusFilter === 'aprovado_apontamentos' && l.conclusao.recomendacao === 'aprovado_apontamentos') ||
      (statusFilter === 'reprovado' && l.conclusao.recomendacao === 'reprovado') ||
      (statusFilter === 'em_andamento' && l.status === 'em_andamento');

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalLaudos = laudos.length;
  const concluidos = laudos.filter((l) => l.status === 'concluido').length;
  const certificados = laudos.filter((l) => l.conclusao.recomendacao === 'aprovado').length;
  const totalFipeAvaliado = laudos.reduce((acc, l) => acc + (l.precificacao.valorFipe || 0), 0);
  const totalValorAnuncio = laudos.reduce((acc, l) => acc + (l.precificacao.precoVendaSugerido || 0), 0);
  const mediaPrecoAnuncio = totalLaudos > 0 ? Math.round(totalValorAnuncio / totalLaudos) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & User Role Selector */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Consultoria Pericial & Avaliação para Venda de Veículos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Laudos técnicos de procedência e precificação estratégica com Tabela FIPE para o proprietário vendedor
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* User Role Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <span className="text-[11px] font-semibold text-slate-500 px-2 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> Nível:
            </span>
            <button
              type="button"
              onClick={() => onUserRoleChange('avaliador')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                userRole === 'avaliador'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Perito / Consultor
            </button>
            <button
              type="button"
              onClick={() => onUserRoleChange('admin')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                userRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Admin / Gestor
            </button>
            <button
              type="button"
              onClick={() => onUserRoleChange('consultor')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                userRole === 'consultor'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Visualizador
            </button>
          </div>

          {/* New Inspection CTA */}
          {userRole !== 'consultor' && (
            <button
              type="button"
              onClick={onNewLaudo}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Nova Avaliação Pericial
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total de Laudos Emitidos</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
            {totalLaudos}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{concluidos} laudos concluídos para clientes</div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total FIPE dos Veículos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
            {totalFipeAvaliado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Patrimônio avaliado e certificado</div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Preço Médio de Anúncio</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-sky-600 dark:text-sky-400 mt-2">
            {mediaPrecoAnuncio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Valor médio sugerido de vitrine</div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Taxa de Certificação</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
            {totalLaudos > 0 ? Math.round((certificados / totalLaudos) * 100) : 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{certificados} veículos 100% aprovados</div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por placa, modelo, cliente ou número do laudo..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'todos', label: 'Todos os Laudos' },
            { id: 'aprovado', label: 'Certificados para Venda' },
            { id: 'aprovado_apontamentos', label: 'Com Apontamentos' },
            { id: 'reprovado', label: 'Restritos' },
            { id: 'em_andamento', label: 'Em Andamento' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inspections List Table / Cards */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {filteredLaudos.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Car className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nenhum laudo encontrado com os filtros selecionados
            </div>
            <div className="text-xs text-slate-400 max-w-sm mx-auto">
              Inicie uma nova avaliação pericial para o proprietário vendedor.
            </div>
            {userRole !== 'consultor' && (
              <button
                type="button"
                onClick={onNewLaudo}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs mt-2"
              >
                <Plus className="w-4 h-4" /> Iniciar Primeira Avaliação
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLaudos.map((item) => {
              const statusCfg = {
                aprovado: {
                  label: 'Certificado p/ Venda',
                  icon: CheckCircle2,
                  badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
                },
                aprovado_apontamentos: {
                  label: 'Com Apontamentos',
                  icon: AlertTriangle,
                  badge: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
                },
                reprovado: {
                  label: 'Restrito',
                  icon: XCircle,
                  badge: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
                },
              }[item.conclusao.recomendacao];

              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-950/40 transition-colors text-xs"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300 mt-0.5">
                      <Car className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {item.veiculo.placa}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {item.veiculo.marca} {item.veiculo.modelo}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.veiculo.anoFabricacao}/{item.veiculo.anoModelo}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${statusCfg.badge}`}>
                          <StatusIcon className="w-3 h-3" /> {statusCfg.label}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap mt-1">
                        <span>Proprietário: <strong>{item.cliente.nome || 'Não informado'}</strong></span>
                        <span>·</span>
                        <span>KM: {item.veiculo.kmAtual.toLocaleString('pt-BR')} km</span>
                        <span>·</span>
                        <span>Apontamentos: {item.danosCarroceria.length}</span>
                        <span>·</span>
                        <span className="font-mono text-[10px]">{item.numeroLaudo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Valuation badges for the seller */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right font-mono tabular-nums">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Tabela FIPE</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {item.precificacao.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                        Anúncio: {item.precificacao.precoVendaSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Mínimo: {item.precificacao.precoMinimoNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onViewLaudo(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                        title="Ver laudo completo"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Laudo
                      </button>

                      <button
                        type="button"
                        onClick={() => PdfReportService.generatePdf(item)}
                        className="p-1.5 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-600 dark:text-sky-400 rounded-lg transition-colors"
                        title="Download PDF oficial do vendedor"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => PdfReportService.shareWhatsApp(item)}
                        className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors"
                        title="Enviar via WhatsApp para comprador"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {userRole !== 'consultor' && (
                        <button
                          type="button"
                          onClick={() => onEditLaudo(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                          title="Editar avaliação"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}

                      {userRole === 'admin' && (
                        <button
                          type="button"
                          onClick={() => onDeleteLaudo(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Excluir laudo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
