import React, { useState, useRef } from 'react';
import { CarDamagePoint, CarView, TipoDano, DanosSeveridade } from '../types/laudo';
import { DAMAGE_TYPES } from '../constants/defaultChecklist';
import { Plus, Trash2, AlertTriangle, ShieldAlert, Sparkles, X, Edit3 } from 'lucide-react';

interface VehicleDamageCanvasProps {
  damages: CarDamagePoint[];
  onChange: (damages: CarDamagePoint[]) => void;
  readOnly?: boolean;
}

export const VehicleDamageCanvas: React.FC<VehicleDamageCanvasProps> = ({
  damages,
  onChange,
  readOnly = false,
}) => {
  const [activeView, setActiveView] = useState<CarView>('top');
  const [selectedDamageId, setSelectedDamageId] = useState<string | null>(null);
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState<{ x: number; y: number } | null>(null);

  // Form state for adding/editing damage
  const [formType, setFormType] = useState<TipoDano>('risco_superficial');
  const [formPartName, setFormPartName] = useState('Capô');
  const [formSeverity, setFormSeverity] = useState<DanosSeveridade>('leve');
  const [formCost, setFormCost] = useState(250);
  const [formNotes, setFormNotes] = useState('');
  const [editingDamageId, setEditingDamageId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentViewDamages = damages.filter((d) => d.view === activeView);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Default part name based on click coordinates and active view
    let suggestedPart = 'Carroceria';
    if (activeView === 'top') {
      if (y < 25) suggestedPart = 'Capô / Para-choque Diant.';
      else if (y < 42) suggestedPart = 'Para-brisa Dianteiro';
      else if (y < 68) suggestedPart = 'Teto / Coluna Central';
      else if (y < 85) suggestedPart = 'Vidro Traseiro';
      else suggestedPart = 'Tampa do Porta-malas / Traseira';
    } else if (activeView === 'front') {
      if (y < 45) suggestedPart = 'Grade / Emblema';
      else suggestedPart = 'Para-choque Dianteiro / Faróis';
    } else if (activeView === 'rear') {
      if (y < 45) suggestedPart = 'Tampa / Vidro Traseiro';
      else suggestedPart = 'Para-choque Traseiro / Lanternas';
    } else if (activeView === 'left' || activeView === 'right') {
      if (x < 30) suggestedPart = 'Para-lama / Roda Dianteira';
      else if (x < 55) suggestedPart = 'Porta Dianteira';
      else if (x < 78) suggestedPart = 'Porta Traseira';
      else suggestedPart = 'Para-lama / Lateral Traseira';
    }

    setTempCoords({ x, y });
    setFormPartName(suggestedPart);
    setFormType('amassado');
    setFormSeverity('leve');
    setFormCost(DAMAGE_TYPES.amassado.defaultCost);
    setFormNotes('');
    setEditingDamageId(null);
    setIsAddingModalOpen(true);
  };

  const handleSaveDamage = () => {
    if (editingDamageId) {
      // Editing existing
      const updated = damages.map((d) =>
        d.id === editingDamageId
          ? {
              ...d,
              type: formType,
              partName: formPartName,
              severity: formSeverity,
              estimatedCost: Number(formCost) || 0,
              notes: formNotes,
            }
          : d
      );
      onChange(updated);
    } else if (tempCoords) {
      // Adding new
      const newPoint: CarDamagePoint = {
        id: `dmg_${Date.now()}`,
        view: activeView,
        x: tempCoords.x,
        y: tempCoords.y,
        type: formType,
        partName: formPartName,
        severity: formSeverity,
        estimatedCost: Number(formCost) || 0,
        notes: formNotes,
      };
      onChange([...damages, newPoint]);
    }
    setIsAddingModalOpen(false);
    setTempCoords(null);
    setEditingDamageId(null);
  };

  const handleRemoveDamage = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange(damages.filter((d) => d.id !== id));
    if (selectedDamageId === id) setSelectedDamageId(null);
  };

  const handleEditDamage = (damage: CarDamagePoint, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingDamageId(damage.id);
    setFormType(damage.type);
    setFormPartName(damage.partName);
    setFormSeverity(damage.severity);
    setFormCost(damage.estimatedCost);
    setFormNotes(damage.notes || '');
    setActiveView(damage.view);
    setIsAddingModalOpen(true);
  };

  const totalDamageCost = damages.reduce((acc, d) => acc + (d.estimatedCost || 0), 0);
  const structuralDamages = damages.filter((d) => d.type === 'dano_estrutural' || d.severity === 'grave');
  const aestheticDamages = damages.filter((d) => d.type !== 'dano_estrutural' && d.severity !== 'grave');

  return (
    <div className="space-y-6">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total de Avarias</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {damages.length} <span className="text-xs font-normal text-slate-500 font-sans">apontamento(s)</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Danos Estruturais</div>
            <div className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {structuralDamages.length} <span className="text-xs font-normal text-slate-500 font-sans">{structuralDamages.length > 0 ? 'Crítico' : 'Nenhum'}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Custo Previsto de Funilaria</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalDamageCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="w-9 h-9 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Diagram Area with View Tabs */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs">
        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveView('top')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'top'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Superior (Carroceria)
            </button>
            <button
              type="button"
              onClick={() => setActiveView('front')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'front'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Frente
            </button>
            <button
              type="button"
              onClick={() => setActiveView('rear')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'rear'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Traseira
            </button>
            <button
              type="button"
              onClick={() => setActiveView('left')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'left'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lateral Esquerda
            </button>
            <button
              type="button"
              onClick={() => setActiveView('right')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'right'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lateral Direita
            </button>
          </div>

          {!readOnly && (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
              Clique no diagrama para marcar uma avaria
            </div>
          )}
        </div>

        {/* Blueprint Canvas Graphic Area */}
        <div className="relative my-4 flex items-center justify-center">
          <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className={`relative w-full max-w-xl mx-auto aspect-4/3 sm:aspect-16/10 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-4 transition-all select-none overflow-hidden ${
              !readOnly ? 'cursor-crosshair hover:border-sky-400/50' : ''
            }`}
          >
            {/* View SVG Schematics */}
            {activeView === 'top' && (
              <svg viewBox="0 0 400 560" className="w-full h-full max-h-96 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor">
                {/* Car Silhouette Top View */}
                <path
                  d="M130,30 C150,20 250,20 270,30 C300,50 320,100 320,150 C320,180 330,220 330,320 C330,420 320,460 310,500 C300,535 250,545 200,545 C150,545 100,535 90,500 C80,460 70,420 70,320 C70,220 80,180 80,150 C80,100 100,50 130,30 Z"
                  strokeWidth="3"
                  className="fill-slate-100 dark:fill-slate-900"
                />
                {/* Windshield front */}
                <path d="M110,130 C130,110 270,110 290,130 L275,190 C250,180 150,180 125,190 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                {/* Roof */}
                <path d="M125,195 C150,185 250,185 275,195 L270,360 C250,370 150,370 130,360 Z" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Rear Window */}
                <path d="M130,365 C150,375 250,375 270,365 L280,430 C260,440 140,440 120,430 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                {/* Hood line */}
                <path d="M130,55 C160,70 240,70 270,55" strokeWidth="1.5" />
                {/* Trunk line */}
                <path d="M120,480 C150,470 250,470 280,480" strokeWidth="1.5" />
                {/* Side Mirrors */}
                <rect x="55" y="145" width="22" height="14" rx="4" strokeWidth="2" className="fill-slate-200 dark:fill-slate-800" />
                <rect x="323" y="145" width="22" height="14" rx="4" strokeWidth="2" className="fill-slate-200 dark:fill-slate-800" />
                {/* Wheels outline */}
                <rect x="55" y="70" width="18" height="50" rx="4" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <rect x="327" y="70" width="18" height="50" rx="4" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <rect x="55" y="420" width="18" height="50" rx="4" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <rect x="327" y="420" width="18" height="50" rx="4" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                {/* Section labels */}
                <text x="200" y="85" textAnchor="middle" className="text-[11px] font-medium fill-slate-400 stroke-none select-none">CAPÔ</text>
                <text x="200" y="275" textAnchor="middle" className="text-[12px] font-medium fill-slate-400 stroke-none select-none">TETO</text>
                <text x="200" y="505" textAnchor="middle" className="text-[11px] font-medium fill-slate-400 stroke-none select-none">PORTA-MALAS</text>
              </svg>
            )}

            {activeView === 'front' && (
              <svg viewBox="0 0 500 320" className="w-full h-full max-h-96 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor">
                {/* Front View */}
                <path
                  d="M120,40 C180,30 320,30 380,40 C430,70 450,150 450,220 C450,260 410,270 250,270 C90,270 50,260 50,220 C50,150 70,70 120,40 Z"
                  strokeWidth="3"
                  className="fill-slate-100 dark:fill-slate-900"
                />
                {/* Windshield */}
                <path d="M125,50 C180,45 320,45 375,50 L400,120 C320,115 180,115 100,120 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                {/* Headlights */}
                <polygon points="75,140 145,135 155,165 85,170" strokeWidth="2" className="fill-amber-100/50 dark:fill-amber-950/40" />
                <polygon points="425,140 355,135 345,165 415,170" strokeWidth="2" className="fill-amber-100/50 dark:fill-amber-950/40" />
                {/* Front Grille */}
                <rect x="175" y="140" width="150" height="40" rx="8" strokeWidth="2" className="fill-slate-200 dark:fill-slate-800" />
                {/* Plate Area */}
                <rect x="205" y="200" width="90" height="30" rx="3" strokeWidth="1.5" className="fill-white dark:fill-slate-900" />
                {/* Tires */}
                <rect x="52" y="235" width="45" height="55" rx="5" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <rect x="403" y="235" width="45" height="55" rx="5" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <text x="250" y="105" textAnchor="middle" className="text-[12px] font-medium fill-slate-400 stroke-none">FRENTE / PARA-CHOQUE</text>
              </svg>
            )}

            {activeView === 'rear' && (
              <svg viewBox="0 0 500 320" className="w-full h-full max-h-96 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor">
                {/* Rear View */}
                <path
                  d="M120,40 C180,30 320,30 380,40 C430,70 450,150 450,220 C450,260 410,270 250,270 C90,270 50,260 50,220 C50,150 70,70 120,40 Z"
                  strokeWidth="3"
                  className="fill-slate-100 dark:fill-slate-900"
                />
                {/* Rear window */}
                <path d="M130,55 C180,50 320,50 370,55 L395,120 C320,125 180,125 105,120 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                {/* Taillights */}
                <polygon points="70,140 140,145 135,175 75,170" strokeWidth="2" className="fill-rose-200/60 dark:fill-rose-950/50" />
                <polygon points="430,140 360,145 365,175 425,170" strokeWidth="2" className="fill-rose-200/60 dark:fill-rose-950/50" />
                {/* Trunk cut line */}
                <path d="M150,135 L150,200 L350,200 L350,135" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Plate Area */}
                <rect x="205" y="155" width="90" height="30" rx="3" strokeWidth="1.5" className="fill-white dark:fill-slate-900" />
                {/* Tires */}
                <rect x="52" y="235" width="45" height="55" rx="5" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <rect x="403" y="235" width="45" height="55" rx="5" strokeWidth="2" className="fill-slate-400 dark:fill-slate-700" />
                <text x="250" y="100" textAnchor="middle" className="text-[12px] font-medium fill-slate-400 stroke-none">TRASEIRA / TAMPA</text>
              </svg>
            )}

            {(activeView === 'left' || activeView === 'right') && (
              <svg viewBox="0 0 620 280" className="w-full h-full max-h-96 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor">
                {/* Side Silhouette */}
                <g transform={activeView === 'right' ? 'scale(-1, 1) translate(-620, 0)' : undefined}>
                  <path
                    d="M30,190 C30,170 50,160 80,155 L160,145 L240,65 C280,55 420,55 480,85 L560,145 C580,150 600,160 600,185 C600,210 580,215 560,215 L500,215 C495,180 445,180 440,215 L200,215 C195,180 145,180 140,215 L50,215 C35,215 30,205 30,190 Z"
                    strokeWidth="3"
                    className="fill-slate-100 dark:fill-slate-900"
                  />
                  {/* Windows */}
                  <path d="M245,75 L340,75 L340,135 L175,135 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                  <path d="M350,75 L460,95 L490,135 L350,135 Z" strokeWidth="2" className="fill-sky-100/40 dark:fill-sky-950/30" />
                  {/* Doors lines */}
                  <line x1="345" y1="75" x2="345" y2="215" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="225" y1="135" x2="225" y2="215" strokeWidth="1.5" strokeDasharray="3 3" />
                  {/* Door handles */}
                  <rect x="310" y="145" width="22" height="5" rx="2" strokeWidth="1.5" className="fill-slate-400" />
                  <rect x="420" y="145" width="22" height="5" rx="2" strokeWidth="1.5" className="fill-slate-400" />
                  {/* Wheels */}
                  <circle cx="170" cy="210" r="38" strokeWidth="3" className="fill-slate-800 text-slate-300" />
                  <circle cx="170" cy="210" r="22" strokeWidth="2" className="fill-slate-300 dark:fill-slate-600 text-slate-800" />
                  <circle cx="470" cy="210" r="38" strokeWidth="3" className="fill-slate-800 text-slate-300" />
                  <circle cx="470" cy="210" r="22" strokeWidth="2" className="fill-slate-300 dark:fill-slate-600 text-slate-800" />
                </g>
                <text x="310" y="260" textAnchor="middle" className="text-[12px] font-medium fill-slate-400 stroke-none">
                  {activeView === 'left' ? 'LATERAL ESQUERDA (MOTORISTA)' : 'LATERAL DIREITA (PASSAGEIRO)'}
                </text>
              </svg>
            )}

            {/* Render Damage Markers for Active View */}
            {currentViewDamages.map((dmg, idx) => {
              const dmgConfig = DAMAGE_TYPES[dmg.type] || { color: '#ef4444', label: dmg.type };
              const isSelected = selectedDamageId === dmg.id;

              return (
                <div
                  key={dmg.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDamageId(dmg.id);
                  }}
                  style={{ left: `${dmg.x}%`, top: `${dmg.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white shadow-md cursor-pointer transition-transform duration-150 z-20 ${
                    isSelected ? 'ring-3 ring-sky-400 scale-125' : 'hover:scale-110'
                  }`}
                  title={`${dmg.partName}: ${dmgConfig.label} (R$ ${dmg.estimatedCost})`}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-90"
                    style={{ backgroundColor: dmgConfig.color }}
                  ></span>
                  <span className="relative z-10">{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Damage Legend & Points List */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Avarias Cadastradas nesta Visão ({currentViewDamages.length})
            </h4>
            <div className="text-xs text-slate-400">Clique em qualquer item para editar ou excluir</div>
          </div>

          {currentViewDamages.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
              Nenhuma avaria marcada nesta visualização. Toque no desenho para cadastrar um ponto.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {currentViewDamages.map((dmg, index) => {
                const conf = DAMAGE_TYPES[dmg.type] || { label: dmg.type, color: '#64748b' };
                return (
                  <div
                    key={dmg.id}
                    onClick={() => setSelectedDamageId(dmg.id)}
                    className={`p-2.5 rounded-lg border transition-all text-left flex items-start justify-between gap-2 cursor-pointer ${
                      selectedDamageId === dmg.id
                        ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <div
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: conf.color }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {dmg.partName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                          <span>{conf.label}</span>
                          <span>·</span>
                          <span
                            className={
                              dmg.severity === 'grave'
                                ? 'text-rose-600 font-semibold'
                                : dmg.severity === 'moderada'
                                ? 'text-amber-600'
                                : 'text-slate-500'
                            }
                          >
                            {dmg.severity.toUpperCase()}
                          </span>
                        </div>
                        {dmg.notes && (
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                            "{dmg.notes}"
                          </div>
                        )}
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums mt-1">
                          R$ {dmg.estimatedCost.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {!readOnly && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleEditDamage(dmg, e)}
                          className="p-1 text-slate-400 hover:text-sky-600 rounded"
                          title="Editar avaria"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveDamage(dmg.id, e)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Excluir avaria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Dialog for Adding / Editing Damage Details */}
      {isAddingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                {editingDamageId ? 'Editar Avaria na Carroceria' : 'Registrar Nova Avaria'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peça / Painel do Veículo
                </label>
                <input
                  type="text"
                  value={formPartName}
                  onChange={(e) => setFormPartName(e.target.value)}
                  placeholder="Ex: Capô, Porta Dianteira Esq., Para-choque..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tipo de Dano Detectado
                </label>
                <select
                  value={formType}
                  onChange={(e) => {
                    const newType = e.target.value as TipoDano;
                    setFormType(newType);
                    setFormCost(DAMAGE_TYPES[newType]?.defaultCost || 250);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                >
                  {Object.entries(DAMAGE_TYPES).map(([typeKey, data]) => (
                    <option key={typeKey} value={typeKey}>
                      {data.label} (Sugestão: R$ {data.defaultCost})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Severidade do Dano
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as DanosSeveridade)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                  >
                    <option value="leve">Leve (Estético)</option>
                    <option value="moderada">Moderada (Requer Funilaria)</option>
                    <option value="grave">Grave (Estrutural/Troca)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Custo Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(Number(e.target.value))}
                    step="50"
                    min="0"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono tabular-nums text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observações Técnicas / Anotações
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ex: Ponto de massa detectado no medidor de espessura de tinta (280 micras)..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingModalOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDamage}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs"
              >
                {editingDamageId ? 'Atualizar Ponto' : 'Salvar no Diagrama'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
