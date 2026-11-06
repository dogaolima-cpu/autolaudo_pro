import React, { useState } from 'react';
import { ChecklistItem, ChecklistStatus } from '../types/laudo';
import { DEFAULT_EQUIPMENTS } from '../constants/defaultChecklist';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, SlidersHorizontal, CheckSquare, Square } from 'lucide-react';

interface ChecklistSectionProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  equipments: Record<string, boolean>;
  onEquipmentsChange: (equipments: Record<string, boolean>) => void;
  readOnly?: boolean;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  onChange,
  equipments,
  onEquipmentsChange,
  readOnly = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'motor', label: 'Motor' },
    { id: 'transmissao', label: 'Câmbio / Transmissão' },
    { id: 'suspensao', label: 'Suspensão' },
    { id: 'freios', label: 'Freios' },
    { id: 'eletrica', label: 'Elétrica / Luzes' },
    { id: 'interior', label: 'Interior / Acabamento' },
    { id: 'vidros', label: 'Vidros / Chassi' },
    { id: 'pneus', label: 'Pneus e Rodas' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStatusChange = (id: string, status: ChecklistStatus) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const toggleEquipment = (equipName: string) => {
    if (readOnly) return;
    onEquipmentsChange({
      ...equipments,
      [equipName]: !equipments[equipName],
    });
  };

  const selectAllCategoryAsConforme = (category: string) => {
    if (readOnly) return;
    onChange(
      items.map((item) =>
        category === 'todos' || item.category === category
          ? { ...item, status: 'conforme' as ChecklistStatus }
          : item
      )
    );
  };

  // Metrics
  const conformeCount = items.filter((i) => i.status === 'conforme').length;
  const atencaoCount = items.filter((i) => i.status === 'atencao').length;
  const irregularCount = items.filter((i) => i.status === 'irregular').length;

  return (
    <div className="space-y-6">
      {/* Equipments Checklist Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Equipamentos e Opcionais Instalados
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Marque os itens de série e acessórios presentes e funcionais no veículo
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 font-mono tabular-nums">
            {Object.values(equipments).filter(Boolean).length} de {DEFAULT_EQUIPMENTS.length} selecionados
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {DEFAULT_EQUIPMENTS.map((equip) => {
            const isChecked = !!equipments[equip];
            return (
              <div
                key={equip}
                onClick={() => toggleEquipment(equip)}
                className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 select-none ${
                  !readOnly ? 'cursor-pointer' : ''
                } ${
                  isChecked
                    ? 'border-sky-500/80 bg-sky-50/50 dark:bg-sky-950/20 text-slate-900 dark:text-slate-100'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="font-medium">{equip}</span>
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Inspection Checklist Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-500" />
              Checklist Detalhado da Vistoria Técnica ({items.length} itens)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspeção criteriosa de sistemas mecânicos, estruturais, elétricos e segurança
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{conformeCount} OK</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">{atencaoCount} Atenção</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-rose-600 dark:text-rose-400 font-semibold">{irregularCount} Irregular</span>
            </div>

            {!readOnly && (
              <button
                type="button"
                onClick={() => selectAllCategoryAsConforme(activeCategory)}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Marcar visíveis como "Conforme"
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Checklist Items Table / Rows */}
        <div className="space-y-2 pt-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                item.status === 'irregular'
                  ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20'
                  : item.status === 'atencao'
                  ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20'
              }`}
            >
              <div className="min-w-0 md:max-w-md">
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleStatusChange(item.id, 'conforme')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-all ${
                    item.status === 'conforme'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Conforme
                </button>

                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleStatusChange(item.id, 'atencao')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-all ${
                    item.status === 'atencao'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Atenção
                </button>

                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleStatusChange(item.id, 'irregular')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-all ${
                    item.status === 'irregular'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" /> Irregular
                </button>

                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleStatusChange(item.id, 'nao_se_aplica')}
                  className={`px-2 py-1 rounded-md font-medium text-[11px] flex items-center gap-1 transition-all ${
                    item.status === 'nao_se_aplica'
                      ? 'bg-slate-400 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <MinusCircle className="w-3 h-3" /> N/A
                </button>
              </div>

              {/* Note input if irregular or attention */}
              {(item.status === 'irregular' || item.status === 'atencao' || item.notes) && (
                <div className="w-full md:w-56 shrink-0">
                  <input
                    type="text"
                    readOnly={readOnly}
                    value={item.notes || ''}
                    onChange={(e) => handleNotesChange(item.id, e.target.value)}
                    placeholder="Apontamento / Causa detectada..."
                    className="w-full px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
