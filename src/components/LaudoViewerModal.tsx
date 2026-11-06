import React from 'react';
import { Laudo } from '../types/laudo';
import { PdfReportService } from '../services/pdfReport';
import { DAMAGE_TYPES } from '../constants/defaultChecklist';
import {
  X,
  FileDown,
  Share2,
  Mail,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Car,
  User,
  ShieldCheck,
  DollarSign,
  Activity,
  Tag,
  TrendingUp,
} from 'lucide-react';

interface LaudoViewerModalProps {
  laudo: Laudo;
  onClose: () => void;
  onEdit?: () => void;
}

export const LaudoViewerModal: React.FC<LaudoViewerModalProps> = ({ laudo, onClose, onEdit }) => {
  const handleDownloadPdf = () => {
    PdfReportService.generatePdf(laudo);
  };

  const handleShareWhatsApp = () => {
    PdfReportService.shareWhatsApp(laudo);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Laudo Técnico de Consultoria Automotiva - ${laudo.veiculo.modelo} (${laudo.veiculo.placa})`);
    const body = encodeURIComponent(
      `Olá ${laudo.cliente.nome || 'Proprietário'},\n\nSegue o Laudo Técnico Pericial de Consultoria Automotiva com FIPE N° ${laudo.numeroLaudo} para venda do seu veículo ${laudo.veiculo.marca} ${laudo.veiculo.modelo} (${laudo.veiculo.placa}).\n\nResultado: ${laudo.conclusao.recomendacao.toUpperCase()}\nValor FIPE: R$ ${laudo.precificacao.valorFipe.toLocaleString('pt-BR')}\nPreço Sugerido de Anúncio: R$ ${laudo.precificacao.precoVendaSugerido.toLocaleString('pt-BR')}\nPreço Mínimo de Negociação: R$ ${laudo.precificacao.precoMinimoNegociacao.toLocaleString('pt-BR')}\n\nAtenciosamente,\n${laudo.conclusao.responsavelNome || 'Perito Consultor Automotivo'}`
    );
    window.open(`mailto:${laudo.cliente.email || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const statusBadge = {
    aprovado: {
      label: 'VEÍCULO CERTIFICADO PARA VENDA',
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      icon: CheckCircle2,
    },
    aprovado_apontamentos: {
      label: 'CERTIFICADO COM APONTAMENTOS DE TRANSPARÊNCIA',
      bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      icon: AlertTriangle,
    },
    reprovado: {
      label: 'RESTRITO PARA REPAROS ANTES DA VENDA',
      bg: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800',
      icon: XCircle,
    },
  }[laudo.conclusao.recomendacao];

  const StatusIcon = statusBadge.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2 py-1 rounded">
              {laudo.numeroLaudo}
            </span>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
              Laudo Pericial: {laudo.veiculo.marca} {laudo.veiculo.modelo} ({laudo.veiculo.placa})
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Baixar Laudo Técnico em PDF"
            >
              <FileDown className="w-3.5 h-3.5" /> Baixar PDF
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Compartilhar resumo via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </button>

            <button
              type="button"
              onClick={handleShareEmail}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              title="Compartilhar por E-mail"
            >
              <Mail className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              title="Imprimir documento"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Editar
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 text-xs">
          {/* Status Verdict Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${statusBadge.bg}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60">
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-extrabold tracking-wider">{statusBadge.label}</div>
                <div className="text-xs opacity-90 mt-0.5">
                  Consultoria pericial realizada para o proprietário vendedor em{' '}
                  {new Date(laudo.dataCriacao).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="text-right font-mono tabular-nums">
              <div className="text-[11px] opacity-75">Protocolo</div>
              <div className="text-sm font-bold">{laudo.numeroLaudo}</div>
            </div>
          </div>

          {/* Section: Vehicle & Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <Car className="w-4 h-4 text-sky-500" />
                Dados do Automóvel Vistoriado
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Veículo / Versão</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {laudo.veiculo.marca} {laudo.veiculo.modelo}
                  </span>
                  <span className="block text-[11px] text-slate-500">{laudo.veiculo.versao}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Placa</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 uppercase bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-xs">
                    {laudo.veiculo.placa}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ano Fab / Mod</span>
                  <span className="font-mono font-semibold">
                    {laudo.veiculo.anoFabricacao} / {laudo.veiculo.anoModelo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Quilometragem</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {laudo.veiculo.kmAtual.toLocaleString('pt-BR')} km
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Cor / Combustível</span>
                  <span>
                    {laudo.veiculo.cor} · {laudo.veiculo.combustivel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Câmbio</span>
                  <span>{laudo.veiculo.cambio}</span>
                </div>
              </div>
            </div>

            {/* Client & Consultant Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-4 h-4 text-sky-500" />
                Proprietário & Perito Consultor
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Proprietário Vendedor</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {laudo.cliente.nome || 'Não informado'}
                  </span>
                  <div className="text-[11px] text-slate-500">
                    Tel: {laudo.cliente.telefone || 'N/A'} · Email: {laudo.cliente.email || 'N/A'}
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Perito / Consultor Responsável</span>
                  <span className="font-semibold">{laudo.conclusao.responsavelNome || 'Consultor Especialista'}</span>
                  <div className="text-[11px] text-slate-500">
                    {laudo.conclusao.responsavelCargo} · {laudo.conclusao.responsavelRegistro || 'Certificado AutoLaudo Pro'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & FIPE Section (Owner-Centric) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Avaliação de Mercado e Precificação Estratégica para Venda
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Tabela FIPE Oficial</div>
                <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                  {laudo.precificacao.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Código: {laudo.precificacao.codigoFipe || 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800">
                <div className="text-[10px] text-sky-800 dark:text-sky-400 uppercase font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Preço Sugerido de Anúncio
                </div>
                <div className="text-lg font-bold font-mono tabular-nums text-sky-700 dark:text-sky-300 mt-0.5">
                  {laudo.precificacao.precoVendaSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-[10px] text-sky-600 dark:text-sky-400 mt-1">
                  Valor ideal de vitrine e plataformas
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="text-[10px] text-emerald-800 dark:text-emerald-400 uppercase font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Preço Mínimo p/ Negociação
                </div>
                <div className="text-lg font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {laudo.precificacao.precoMinimoNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                  Piso seguro com margem de {laudo.precificacao.margemNegociacaoPercentual || 5}%
                </div>
              </div>
            </div>
          </div>

          {/* Body Damage Summary */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
                Apontamentos de Carroceria para Transparência com Comprador ({laudo.danosCarroceria.length})
              </div>
              <div className="text-xs text-slate-500">
                Relatado com integridade pericial
              </div>
            </div>

            {laudo.danosCarroceria.length === 0 ? (
              <div className="py-3 text-center text-emerald-600 text-xs font-medium bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg">
                Lataria e pintura em estado impecável, sem riscos ou amassados registrados.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {laudo.danosCarroceria.map((dmg, idx) => {
                  const conf = DAMAGE_TYPES[dmg.type] || { label: dmg.type, color: '#64748b' };
                  return (
                    <div
                      key={dmg.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-2"
                    >
                      <div
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: conf.color }}
                      >
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{dmg.partName}</div>
                        <div className="text-[11px] text-slate-500">
                          {conf.label} · {dmg.severity.toUpperCase()}
                        </div>
                        {dmg.notes && <div className="text-[11px] text-slate-400 italic">"{dmg.notes}"</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Test Drive & Technical Conclusion */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              <Activity className="w-4 h-4 text-sky-500" />
              Parecer Conclusivo do Consultor & Teste Dinâmico
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="font-medium text-slate-800 dark:text-slate-200">
                "{laudo.conclusao.parecerTecnico || 'Veículo com integridade estrutural e procedência aprovadas em vistoria pericial completa.'}"
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span>
                  Condição Mecânica: <strong className="text-slate-800 dark:text-slate-200 uppercase">{laudo.conclusao.condicaoMecanica}</strong>
                </span>
                <span>·</span>
                <span>
                  Teste de Rodagem: <strong className="text-slate-800 dark:text-slate-200 uppercase">{laudo.testeRodagem.statusGeralRodagem}</strong>
                </span>
                {laudo.conclusao.restricoesUso && (
                  <>
                    <span>·</span>
                    <span className="text-rose-600 font-semibold">
                      Observações: {laudo.conclusao.restricoesUso}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Digital Signatures Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Assinatura do Consultor Técnico Pericial</div>
              <div className="h-20 flex items-center justify-center">
                {laudo.conclusao.assinaturaTecnicoUrl ? (
                  <img
                    src={laudo.conclusao.assinaturaTecnicoUrl}
                    alt="Assinatura Avaliador"
                    className="max-h-full object-contain filter dark:invert"
                  />
                ) : (
                  <span className="text-slate-400 text-xs italic">Assinatura digital autenticada</span>
                )}
              </div>
              <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                <div className="font-semibold text-xs">{laudo.conclusao.responsavelNome}</div>
                <div className="text-[10px] text-slate-400">{laudo.conclusao.responsavelCargo}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Assinatura do Proprietário Vendedor</div>
              <div className="h-20 flex items-center justify-center">
                {laudo.conclusao.assinaturaClienteUrl ? (
                  <img
                    src={laudo.conclusao.assinaturaClienteUrl}
                    alt="Assinatura Cliente"
                    className="max-h-full object-contain filter dark:invert"
                  />
                ) : (
                  <span className="text-slate-400 text-xs italic">Ciente da consultoria pericial</span>
                )}
              </div>
              <div className="border-t border-slate-300 dark:border-slate-700 pt-1">
                <div className="font-semibold text-xs">{laudo.cliente.nome || 'Proprietário'}</div>
                <div className="text-[10px] text-slate-400">Proprietário Solicitante</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Quick Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Dossiê pericial pronto para o vendedor apresentar com segurança e autoridade a potenciais compradores.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" /> Enviar p/ Comprador
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" /> Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
