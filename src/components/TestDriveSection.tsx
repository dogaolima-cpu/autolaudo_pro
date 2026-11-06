import React from 'react';
import { TestDriveData, MaintenanceRecord, CondicaoMecanica } from '../types/laudo';
import { Activity, Gauge, Wrench, Plus, Trash2, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

interface TestDriveSectionProps {
  testDrive: TestDriveData;
  onTestDriveChange: (data: TestDriveData) => void;
  maintenances: MaintenanceRecord[];
  onMaintenancesChange: (records: MaintenanceRecord[]) => void;
  condicaoMecanica: CondicaoMecanica;
  onCondicaoMecanicaChange: (cond: CondicaoMecanica) => void;
  currentKm: number;
  readOnly?: boolean;
}

export const TestDriveSection: React.FC<TestDriveSectionProps> = ({
  testDrive,
  onTestDriveChange,
  maintenances,
  onMaintenancesChange,
  condicaoMecanica,
  onCondicaoMecanicaChange,
  currentKm,
  readOnly = false,
}) => {
  const handleAddMaintenance = () => {
    const newRecord: MaintenanceRecord = {
      id: `maint_${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      km: currentKm,
      tipo: 'preventiva',
      descricao: '',
      pecasTrocadas: '',
      comprovadaComNota: true,
    };
    onMaintenancesChange([...maintenances, newRecord]);
  };

  const handleUpdateMaintenance = (id: string, updates: Partial<MaintenanceRecord>) => {
    onMaintenancesChange(
      maintenances.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const handleRemoveMaintenance = (id: string) => {
    onMaintenancesChange(maintenances.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Test Drive Dynamic Evaluation Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-500" />
              Teste de Rodagem Dinâmico (Avaliação em Percurso)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Análise prática do veículo em movimento (trajeto urbano e rodoviário)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Status Geral:</span>
            <select
              value={testDrive.statusGeralRodagem}
              disabled={readOnly}
              onChange={(e) =>
                onTestDriveChange({
                  ...testDrive,
                  statusGeralRodagem: e.target.value as any,
                })
              }
              className="text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
            >
              <option value="excelente">Excelente (Sem Ruídos)</option>
              <option value="bom">Bom (Desgaste Normal)</option>
              <option value="regular">Regular (Exige Reparos)</option>
              <option value="critico">Crítico (Inapropriado p/ Rodagem)</option>
            </select>
          </div>
        </div>

        {/* Test Drive Grid Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ruídos e Falhas de Motor / Câmbio
            </label>
            <input
              type="text"
              readOnly={readOnly}
              value={testDrive.ruidosMotorTransmissao}
              onChange={(e) =>
                onTestDriveChange({ ...testDrive, ruidosMotorTransmissao: e.target.value })
              }
              placeholder="Ex: Marcha lenta estável, sem trancos em trocas de marchas..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Comportamento da Suspensão e Estabilidade
            </label>
            <input
              type="text"
              readOnly={readOnly}
              value={testDrive.comportamentoSuspensao}
              onChange={(e) =>
                onTestDriveChange({ ...testDrive, comportamentoSuspensao: e.target.value })
              }
              placeholder="Ex: Absorção firme em lombadas, sem batidas secas em desníveis..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Anomalias e Sensibilidade nos Pedais
            </label>
            <input
              type="text"
              readOnly={readOnly}
              value={testDrive.anomaliasPedais}
              onChange={(e) =>
                onTestDriveChange({ ...testDrive, anomaliasPedais: e.target.value })
              }
              placeholder="Ex: Pedal de freio firme sem afundamento, embreagem macia..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vibrações, Trepidações e Alinhamento
            </label>
            <input
              type="text"
              readOnly={readOnly}
              value={testDrive.vibracoesTrepidacoes}
              onChange={(e) =>
                onTestDriveChange({ ...testDrive, vibracoesTrepidacoes: e.target.value })
              }
              placeholder="Ex: Direção alinhada a 80km/h, sem trepidações no volante ao frear..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observações Gerais do Percurso de Teste (Quilômetros percorridos: {testDrive.percursoKm} km)
            </label>
            <textarea
              rows={2}
              readOnly={readOnly}
              value={testDrive.observacoesPercurso}
              onChange={(e) =>
                onTestDriveChange({ ...testDrive, observacoesPercurso: e.target.value })
              }
              placeholder="Ex: Teste realizado em percurso misto de 6 km com trecho em asfalto rugoso e via rápida. Nenhum ruído anormal de rolamento..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
            />
          </div>
        </div>

        {/* Condição Mecânica Geral Status Picker */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-sky-500" />
            Classificação da Condição Mecânica Geral:
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'excelente', label: 'Excelente', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' },
              { id: 'boa', label: 'Boa', color: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 border-sky-300' },
              { id: 'regular', label: 'Regular (Atenção)', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-300' },
              { id: 'critica', label: 'Crítica (Reprovado)', color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 border-rose-300' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={readOnly}
                onClick={() => onCondicaoMecanicaChange(option.id as CondicaoMecanica)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  condicaoMecanica === option.id
                    ? `${option.color} ring-2 ring-sky-500/40 font-bold`
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance History Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              Histórico de Manutenções Realizadas e Comprovadas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Registro com data, quilometragem e peças substituídas
            </p>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={handleAddMaintenance}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Manutenção
            </button>
          )}
        </div>

        {maintenances.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            Nenhuma manutenção cadastrada ainda. Clique em "Adicionar Manutenção" para registrar trocas de óleo, revisões ou peças.
          </div>
        ) : (
          <div className="space-y-3">
            {maintenances.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">
                    Data da Manutenção
                  </label>
                  <input
                    type="date"
                    readOnly={readOnly}
                    value={item.data}
                    onChange={(e) => handleUpdateMaintenance(item.id, { data: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">
                    KM Registrado
                  </label>
                  <input
                    type="number"
                    readOnly={readOnly}
                    value={item.km}
                    onChange={(e) => handleUpdateMaintenance(item.id, { km: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md font-mono tabular-nums"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">
                    Tipo de Serviço
                  </label>
                  <select
                    disabled={readOnly}
                    value={item.tipo}
                    onChange={(e) => handleUpdateMaintenance(item.id, { tipo: e.target.value as any })}
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                  >
                    <option value="preventiva">Preventiva</option>
                    <option value="corretiva">Corretiva</option>
                    <option value="revisao_concessionaria">Revisão Autorizada</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold mb-0.5">
                    Descrição do Serviço
                  </label>
                  <input
                    type="text"
                    readOnly={readOnly}
                    value={item.descricao}
                    placeholder="Ex: Troca de óleo 5W30, filtro e velas"
                    onChange={(e) => handleUpdateMaintenance(item.id, { descricao: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={readOnly}
                      checked={item.comprovadaComNota}
                      onChange={(e) => handleUpdateMaintenance(item.id, { comprovadaComNota: e.target.checked })}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">Nota / Carimbo</span>
                  </label>
                </div>

                {!readOnly && (
                  <div className="sm:col-span-1 flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveMaintenance(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Excluir item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
