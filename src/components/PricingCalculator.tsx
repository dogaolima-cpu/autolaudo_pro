import React from 'react';
import { PricingData } from '../types/laudo';
import { Tag, TrendingUp, ShieldCheck, Percent, Calculator, Info, CheckCircle2 } from 'lucide-react';

interface PricingCalculatorProps {
  pricing: PricingData;
  onChange: (pricing: PricingData) => void;
  damageTotalCost: number;
  readOnly?: boolean;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  pricing,
  onChange,
  damageTotalCost,
  readOnly = false,
}) => {
  // Sync damageTotalCost from body damage mapping for informational display
  React.useEffect(() => {
    if (pricing.custoEstimadoAvarias !== damageTotalCost) {
      updateCalculatedPrices({
        ...pricing,
        custoEstimadoAvarias: damageTotalCost,
      });
    }
  }, [damageTotalCost]);

  const updateCalculatedPrices = (current: PricingData) => {
    const fipeBase = current.valorFipe || 0;
    const regional = current.ajusteMercadoRegional || 0;
    const conservacao = current.ajusteConservacaoOpcionais || 0;

    // Preço sugerido de anúncio para o proprietário colocar na vitrine/portais
    const precoAnuncio = Math.round(fipeBase + regional + conservacao);

    // Margem de folga que o vendedor pode conceder para fechar na mesa
    const margemPercent = (current.margemNegociacaoPercentual || 5) / 100;
    const descontoMargem = Math.round(precoAnuncio * margemPercent);

    // Preço mínimo aceitável para o proprietário fechar sem desvalorizar o bem
    const precoMinimo = Math.max(0, precoAnuncio - descontoMargem);

    onChange({
      ...current,
      precoVendaSugerido: precoAnuncio,
      precoMinimoNegociacao: precoMinimo,
    });
  };

  const handleFieldChange = (field: keyof PricingData, val: number | string) => {
    const updated = {
      ...pricing,
      [field]: val,
    };
    updateCalculatedPrices(updated);
  };

  const diferencaFipe = (pricing.precoVendaSugerido || 0) - (pricing.valorFipe || 0);

  return (
    <div className="space-y-6">
      {/* High-level Valuation Result Cards for the Vehicle Owner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* FIPE Official Reference */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Referência Tabela FIPE
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-1">
              {pricing.valorFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sky-500" />
            <span>Código: {pricing.codigoFipe || 'Oficial'} · {pricing.mesReferenciaFipe || 'Mês vigente'}</span>
          </div>
        </div>

        {/* Recommended Asking / Listing Price (Preço Sugerido de Anúncio) */}
        <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-sky-800 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Preço Sugerido de Anúncio (Vitrine)
            </div>
            <div className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 font-mono tabular-nums mt-1">
              {pricing.precoVendaSugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="text-[11px] text-sky-700 dark:text-sky-400 mt-2 font-medium">
            {diferencaFipe >= 0 ? (
              <span>+{diferencaFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em relação à FIPE</span>
            ) : (
              <span>{diferencaFipe.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em relação à FIPE</span>
            )}
          </div>
        </div>

        {/* Recommended Minimum Negotiation Floor (Preço Mínimo de Negociação) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Preço Mínimo para Negociação
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums mt-1">
              {pricing.precoMinimoNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-medium">
            Piso seguro com margem de {pricing.margemNegociacaoPercentual || 5}% para contrapropostas
          </div>
        </div>
      </div>

      {/* Flexible Valuation Inputs for Owner's Benefit */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-sky-500" />
              Critérios de Precificação Estratégica para o Proprietário
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Valores definidos pelo técnico para posicionar o veículo de forma competitiva e rentável no mercado
            </p>
          </div>

          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Laudo de Valorização
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Base FIPE Value */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor FIPE de Referência (R$)
            </label>
            <input
              type="number"
              readOnly={readOnly}
              value={pricing.valorFipe}
              onChange={(e) => handleFieldChange('valorFipe', Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs"
            />
            <span className="text-[10px] text-slate-400">Base oficial de mercado consultada em tempo real</span>
          </div>

          {/* Regional Market Adjustment (+/- R$) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ajuste de Mercado na Região (+/- R$)
            </label>
            <input
              type="number"
              readOnly={readOnly}
              value={pricing.ajusteMercadoRegional}
              onChange={(e) => handleFieldChange('ajusteMercadoRegional', Number(e.target.value))}
              placeholder="Ex: +1500 ou -1000"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs"
            />
            <span className="text-[10px] text-slate-400">Ágio por alta procura local ou ajuste da praça</span>
          </div>

          {/* Conservation and Options Premium (+ R$) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valorização por Conservação / Opcionais (+ R$)
            </label>
            <input
              type="number"
              readOnly={readOnly}
              value={pricing.ajusteConservacaoOpcionais || 0}
              onChange={(e) => handleFieldChange('ajusteConservacaoOpcionais', Number(e.target.value))}
              placeholder="Ex: +2000"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs text-sky-600 font-semibold"
            />
            <span className="text-[10px] text-slate-400">Diferencial por baixa quilometragem ou itens exclusivos</span>
          </div>

          {/* Negotiation Buffer Percentage */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Margem Sugerida para Negociação na Mesa (%)
            </label>
            <div className="relative">
              <input
                type="number"
                readOnly={readOnly}
                value={pricing.margemNegociacaoPercentual || 5}
                min="0"
                max="25"
                onChange={(e) => handleFieldChange('margemNegociacaoPercentual', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs pr-8"
              />
              <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
            </div>
            <span className="text-[10px] text-slate-400">Gordura de desconto que o vendedor pode conceder</span>
          </div>

          {/* Informational Damages and Repairs */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Apontamentos Estéticos Mapeados (Informativo)
            </label>
            <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>R$ {(pricing.custoEstimadoAvarias || 0).toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-slate-400 font-sans">Sem dedução forçada</span>
            </div>
            <span className="text-[10px] text-slate-400">Relatado para transparência e autoridade na venda</span>
          </div>

          {/* Strategy Notes */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recomendação Estratégica de Venda
            </label>
            <textarea
              rows={2}
              readOnly={readOnly}
              value={pricing.observacoesPrecificacao}
              onChange={(e) => handleFieldChange('observacoesPrecificacao', e.target.value)}
              placeholder="Ex: Anunciar pelo valor sugerido de vitrine. Apresentar o laudo com manutenções comprovadas para defender o preço e ceder no máximo até o preço mínimo..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
