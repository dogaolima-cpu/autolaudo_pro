import React, { useState, useEffect } from 'react';
import { Laudo, RecomendacaoStatus, CondicaoMecanica } from '../types/laudo';
import { FipeService, FipeMarca, FipeModelo, FipeAno } from '../services/fipe';
import { VehicleDamageCanvas } from './VehicleDamageCanvas';
import { ChecklistSection } from './ChecklistSection';
import { TestDriveSection } from './TestDriveSection';
import { PhotoGallerySection } from './PhotoGallerySection';
import { PricingCalculator } from './PricingCalculator';
import { DigitalSignaturePad } from './DigitalSignaturePad';
import { createDefaultChecklist } from '../constants/defaultChecklist';
import {
  Car,
  ShieldCheck,
  CheckSquare,
  Activity,
  Camera,
  DollarSign,
  FileText,
  Search,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface NewLaudoWizardProps {
  initialLaudo?: Laudo | null;
  onSave: (laudo: Laudo) => void;
  onCancel: () => void;
  userName: string;
}

export const NewLaudoWizard: React.FC<NewLaudoWizardProps> = ({
  initialLaudo,
  onSave,
  onCancel,
  userName,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State initialized either with existing laudo or fresh template
  const [laudo, setLaudo] = useState<Laudo>(() => {
    if (initialLaudo) return initialLaudo;

    const nextId = Math.floor(1000 + Math.random() * 9000);
    return {
      id: `laudo_${Date.now()}`,
      numeroLaudo: `LAU-2026-${nextId}`,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      status: 'em_andamento',
      criadoPor: userName || 'Perito Consultor Automotivo',
      cliente: {
        nome: '',
        telefone: '',
        email: '',
        cpfCnpj: '',
        cidadeUf: '',
      },
      veiculo: {
        placa: '',
        chassi: '',
        renavam: '',
        marca: 'Chevrolet',
        modelo: 'Onix',
        versao: 'Hatch LT 1.0 12V Flex 5p Mec.',
        anoFabricacao: 2023,
        anoModelo: 2023,
        cor: 'Prata',
        kmAtual: 34500,
        combustivel: 'Flex',
        cambio: 'Manual',
        codigoFipe: '004499-7',
        mesReferenciaFipe: 'Novembro de 2026',
        valorFipe: 76200,
      },
      danosCarroceria: [],
      checklist: createDefaultChecklist(),
      equipamentos: {
        'Ar-condicionado Digital': true,
        'Direção Elétrica / Hidráulica': true,
        'Airbags Frontais e Laterais': true,
        'Freios ABS com EBD': true,
        'Controle de Estabilidade (ESP/ESC)': true,
        'Vidros Elétricos nas 4 Portas com One-Touch': true,
        'Travas Elétricas com Alarme Volumétrico': true,
      },
      testeRodagem: {
        ruidosMotorTransmissao: 'Motor sereno em marcha lenta, engates do câmbio suaves.',
        comportamentoSuspensao: 'Absorção padrão de impactos, sem ruídos de batentes.',
        anomaliasPedais: 'Pedais com curso normal e boa sensibilidade.',
        vibracoesTrepidacoes: 'Sem vibração no volante.',
        alinhamentoDirecao: 'Direção alinhada.',
        observacoesPercurso: 'Percurso de teste sem intercorrências.',
        statusGeralRodagem: 'excelente',
        percursoKm: 5.0,
      },
      historicoManutencao: [
        {
          id: 'init_m1',
          data: '2024-04-12',
          km: 30000,
          tipo: 'preventiva',
          descricao: 'Troca de óleo sintético, filtro e higienização de ar-condicionado',
          pecasTrocadas: 'Óleo e filtros',
          comprovadaComNota: true,
        },
      ],
      fotos: [],
      precificacao: {
        valorFipe: 76200,
        codigoFipe: '004499-7',
        mesReferenciaFipe: 'Novembro de 2026',
        ajusteMercadoRegional: 1000,
        ajusteConservacaoOpcionais: 0,
        custoEstimadoAvarias: 0,
        margemNegociacaoPercentual: 5,
        precoVendaSugerido: 77200,
        precoMinimoNegociacao: 73340,
        observacoesPrecificacao: 'Veículo com excelente aceitação no mercado particular de seminovos.',
      },
      conclusao: {
        recomendacao: 'aprovado',
        condicaoMecanica: 'boa',
        danosEstruturaisEvidentes: false,
        danosEsteticosEvidentes: false,
        restricoesUso: '',
        parecerTecnico: 'Veículo com integridade estrutural e procedência aprovadas em vistoria pericial. Apto para venda no mercado pelo valor sugerido de anúncio.',
        responsavelNome: userName || 'Perito Consultor Automotivo',
        responsavelCargo: 'Consultor Técnico Especialista',
        responsavelRegistro: 'CREA/AISTUDIO-BR 48291',
        assinaturaTecnicoUrl: '',
        assinaturaClienteUrl: '',
        dataAssinatura: new Date().toISOString().split('T')[0],
      },
    };
  });

  // FIPE Dropdown State
  const [marcas, setMarcas] = useState<FipeMarca[]>([]);
  const [modelos, setModelos] = useState<FipeModelo[]>([]);
  const [anos, setAnos] = useState<FipeAno[]>([]);
  const [selectedMarca, setSelectedMarca] = useState('chevrolet');
  const [selectedModelo, setSelectedModelo] = useState('onix-lt');
  const [selectedAno, setSelectedAno] = useState('2023-1');
  const [isFipeLoading, setIsFipeLoading] = useState(false);

  // Load Marcas
  useEffect(() => {
    async function loadFipeBrands() {
      setIsFipeLoading(true);
      const data = await FipeService.getMarcas();
      setMarcas(data);
      setIsFipeLoading(false);
    }
    loadFipeBrands();
  }, []);

  // Load Modelos when Marca changes
  useEffect(() => {
    if (!selectedMarca) return;
    async function loadFipeModels() {
      setIsFipeLoading(true);
      const data = await FipeService.getModelos(selectedMarca);
      setModelos(data);
      if (data.length > 0) {
        setSelectedModelo(data[0].codigo);
      }
      setIsFipeLoading(false);
    }
    loadFipeModels();
  }, [selectedMarca]);

  // Load Anos when Modelo changes
  useEffect(() => {
    if (!selectedMarca || !selectedModelo) return;
    async function loadFipeYears() {
      setIsFipeLoading(true);
      const data = await FipeService.getAnos(selectedMarca, selectedModelo);
      setAnos(data);
      if (data.length > 0) {
        setSelectedAno(data[0].codigo);
      }
      setIsFipeLoading(false);
    }
    loadFipeYears();
  }, [selectedMarca, selectedModelo]);

  const handleApplyFipeData = async () => {
    if (!selectedMarca || !selectedModelo || !selectedAno) return;
    setIsFipeLoading(true);
    const detalhes = await FipeService.getDetalhes(selectedMarca, selectedModelo, selectedAno);
    if (detalhes) {
      const anoNum = detalhes.anoModelo || 2023;
      const fipeVal = detalhes.valor || 0;
      const reg = laudo.precificacao.ajusteMercadoRegional || 0;
      const cons = laudo.precificacao.ajusteConservacaoOpcionais || 0;
      const precoAnuncio = Math.round(fipeVal + reg + cons);
      const margemPct = (laudo.precificacao.margemNegociacaoPercentual || 5) / 100;
      const precoMin = Math.round(precoAnuncio * (1 - margemPct));

      setLaudo((prev) => ({
        ...prev,
        veiculo: {
          ...prev.veiculo,
          marca: detalhes.marca,
          modelo: detalhes.modelo.split(' ')[0] || detalhes.modelo,
          versao: detalhes.modelo,
          anoFabricacao: anoNum,
          anoModelo: anoNum,
          codigoFipe: detalhes.codigoFipe,
          mesReferenciaFipe: detalhes.mesReferencia,
          valorFipe: detalhes.valor,
          combustivel: detalhes.combustivel.includes('Diesel')
            ? 'Diesel'
            : detalhes.combustivel.includes('Híbrido')
            ? 'Híbrido'
            : 'Flex',
        },
        precificacao: {
          ...prev.precificacao,
          valorFipe: detalhes.valor,
          codigoFipe: detalhes.codigoFipe,
          mesReferenciaFipe: detalhes.mesReferencia,
          precoVendaSugerido: precoAnuncio,
          precoMinimoNegociacao: precoMin,
        },
      }));
    }
    setIsFipeLoading(false);
  };

  const handleSaveDraft = (status: 'em_andamento' | 'concluido' = 'em_andamento') => {
    const updatedLaudo: Laudo = {
      ...laudo,
      status,
      dataAtualizacao: new Date().toISOString(),
    };
    onSave(updatedLaudo);
  };

  const steps = [
    { num: 1, title: 'Cliente & Veículo', icon: Car },
    { num: 2, title: 'Carroceria', icon: ShieldCheck },
    { num: 3, title: 'Checklist', icon: CheckSquare },
    { num: 4, title: 'Teste de Rodagem', icon: Activity },
    { num: 5, title: 'Fotos', icon: Camera },
    { num: 6, title: 'Precificação FIPE', icon: DollarSign },
    { num: 7, title: 'Conclusão & Assinatura', icon: FileText },
  ];

  const damageTotal = laudo.danosCarroceria.reduce((acc, d) => acc + (d.estimatedCost || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header with Stepper Progress */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Car className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              {initialLaudo ? 'Editar Laudo de Consultoria' : 'Nova Avaliação Pericial para Venda'}
            </h2>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Protocolo: <strong className="text-slate-700 dark:text-slate-300">{laudo.numeroLaudo}</strong> · Consultor: {userName}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => handleSaveDraft('em_andamento')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg"
            >
              <Save className="w-3.5 h-3.5" /> Salvar Rascunho
            </button>
            <button
              type="button"
              onClick={() => handleSaveDraft('concluido')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Concluir e Emitir Laudo
            </button>
          </div>
        </div>

        {/* Stepper Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 pt-3">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCurrent = currentStep === st.num;
            const isCompleted = currentStep > st.num;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    : 'opacity-60 border border-transparent text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCurrent
                      ? 'bg-sky-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {st.num}
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-semibold leading-tight truncate">{st.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CLIENTE E VEÍCULO COM TABELA FIPE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* FIPE Online Integration Box */}
          <div className="border border-sky-200 dark:border-sky-900/60 rounded-xl bg-sky-50/40 dark:bg-sky-950/20 p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-sky-200/60 dark:border-sky-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h3 className="text-xs font-bold text-sky-950 dark:text-sky-100 uppercase tracking-wide">
                  Consulta Automatizada à Tabela FIPE (Tempo Real)
                </h3>
              </div>
              <span className="text-[11px] text-sky-700 dark:text-sky-300">
                Selecione para preencher marca, modelo, ano e cotação oficial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Marca</label>
                <select
                  value={selectedMarca}
                  onChange={(e) => setSelectedMarca(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  {marcas.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Modelo</label>
                <select
                  value={selectedModelo}
                  onChange={(e) => setSelectedModelo(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  {modelos.map((m) => (
                    <option key={m.codigo} value={m.codigo}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ano / Versão</label>
                <select
                  value={selectedAno}
                  onChange={(e) => setSelectedAno(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  {anos.map((a) => (
                    <option key={a.codigo} value={a.codigo}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleApplyFipeData}
                  disabled={isFipeLoading}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  {isFipeLoading ? 'Consultando...' : 'Buscar Cotação FIPE'}
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Basic Info Fields */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Car className="w-4 h-4 text-sky-500" />
              Identificação do Veículo do Proprietário
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Placa do Veículo (Mercosul ou Padrão)
                </label>
                <input
                  type="text"
                  value={laudo.veiculo.placa}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, placa: e.target.value.toUpperCase() },
                    })
                  }
                  placeholder="Ex: BRA2E19 ou ABC1234"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono font-bold uppercase text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quilometragem Atual (KM)
                </label>
                <input
                  type="number"
                  value={laudo.veiculo.kmAtual}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, kmAtual: Number(e.target.value) },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono tabular-nums text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cor</label>
                <input
                  type="text"
                  value={laudo.veiculo.cor}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, cor: e.target.value },
                    })
                  }
                  placeholder="Ex: Prata, Preto Perolizado, Branco..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Marca</label>
                <input
                  type="text"
                  value={laudo.veiculo.marca}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, marca: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Modelo</label>
                <input
                  type="text"
                  value={laudo.veiculo.modelo}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, modelo: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Versão Completa</label>
                <input
                  type="text"
                  value={laudo.veiculo.versao}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, versao: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ano Fabricação / Modelo</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={laudo.veiculo.anoFabricacao}
                    onChange={(e) =>
                      setLaudo({
                        ...laudo,
                        veiculo: { ...laudo.veiculo, anoFabricacao: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                  />
                  <input
                    type="number"
                    value={laudo.veiculo.anoModelo}
                    onChange={(e) =>
                      setLaudo({
                        ...laudo,
                        veiculo: { ...laudo.veiculo, anoModelo: Number(e.target.value) },
                      })
                    }
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Câmbio</label>
                <select
                  value={laudo.veiculo.cambio}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, cambio: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="CVT">CVT</option>
                  <option value="Automatizado">Automatizado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Combustível</label>
                <select
                  value={laudo.veiculo.combustivel}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      veiculo: { ...laudo.veiculo, combustivel: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                >
                  <option value="Flex">Flex (Etanol / Gasolina)</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Etanol">Etanol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client / Owner Info Fields */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-500" />
              Dados do Proprietário Vendedor
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nome Completo do Proprietário</label>
                <input
                  type="text"
                  value={laudo.cliente.nome}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      cliente: { ...laudo.cliente, nome: e.target.value },
                    })
                  }
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={laudo.cliente.telefone}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      cliente: { ...laudo.cliente, telefone: e.target.value },
                    })
                  }
                  placeholder="Ex: 11999998888"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">E-mail para Envio do Laudo</label>
                <input
                  type="email"
                  value={laudo.cliente.email}
                  onChange={(e) =>
                    setLaudo({
                      ...laudo,
                      cliente: { ...laudo.cliente, email: e.target.value },
                    })
                  }
                  placeholder="proprietario@email.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MAPEAMENTO DE AVARIAS NA CARROCERIA */}
      {currentStep === 2 && (
        <VehicleDamageCanvas
          damages={laudo.danosCarroceria}
          onChange={(damages) =>
            setLaudo({
              ...laudo,
              danosCarroceria: damages,
              precificacao: {
                ...laudo.precificacao,
                custoEstimadoAvarias: damages.reduce((acc, d) => acc + (d.estimatedCost || 0), 0),
              },
            })
          }
        />
      )}

      {/* STEP 3: CHECKLIST TÉCNICO & EQUIPAMENTOS */}
      {currentStep === 3 && (
        <ChecklistSection
          items={laudo.checklist}
          onChange={(items) => setLaudo({ ...laudo, checklist: items })}
          equipments={laudo.equipamentos}
          onEquipmentsChange={(equipments) => setLaudo({ ...laudo, equipamentos: equipments })}
        />
      )}

      {/* STEP 4: TESTE DE RODAGEM & HISTÓRICO DE MANUTENÇÕES */}
      {currentStep === 4 && (
        <TestDriveSection
          testDrive={laudo.testeRodagem}
          onTestDriveChange={(testDrive) => setLaudo({ ...laudo, testeRodagem: testDrive })}
          maintenances={laudo.historicoManutencao}
          onMaintenancesChange={(m) => setLaudo({ ...laudo, historicoManutencao: m })}
          condicaoMecanica={laudo.conclusao.condicaoMecanica}
          onCondicaoMecanicaChange={(cond) =>
            setLaudo({
              ...laudo,
              conclusao: { ...laudo.conclusao, condicaoMecanica: cond },
            })
          }
          currentKm={laudo.veiculo.kmAtual}
        />
      )}

      {/* STEP 5: GALERIA DE FOTOS */}
      {currentStep === 5 && (
        <PhotoGallerySection
          photos={laudo.fotos}
          onChange={(photos) => setLaudo({ ...laudo, fotos: photos })}
        />
      )}

      {/* STEP 6: PRECIFICAÇÃO FIPE & MARGEM */}
      {currentStep === 6 && (
        <PricingCalculator
          pricing={laudo.precificacao}
          onChange={(pricing) => setLaudo({ ...laudo, precificacao: pricing })}
          damageTotalCost={damageTotal}
        />
      )}

      {/* STEP 7: CONCLUSÃO, PARECER TÉCNICO & ASSINATURAS */}
      {currentStep === 7 && (
        <div className="space-y-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              Certificação Pericial e Parecer Conclusivo para Venda
            </h3>

            {/* Recommendation Status Radio Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Classificação Pericial do Veículo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'aprovado',
                    label: 'Certificado para Venda',
                    desc: 'Estrutura, motor e procedência 100% íntegros',
                    color: 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30',
                  },
                  {
                    id: 'aprovado_apontamentos',
                    label: 'Certificado com Apontamentos',
                    desc: 'Aprovado com ressalvas estéticas de transparência',
                    color: 'text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/30',
                  },
                  {
                    id: 'reprovado',
                    label: 'Restrito para Reparos',
                    desc: 'Necessita reparos antes de ser anunciado',
                    color: 'text-rose-700 border-rose-300 bg-rose-50 dark:bg-rose-950/30',
                  },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() =>
                      setLaudo({
                        ...laudo,
                        conclusao: { ...laudo.conclusao, recomendacao: st.id as RecomendacaoStatus },
                      })
                    }
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      laudo.conclusao.recomendacao === st.id
                        ? `${st.color} shadow-sm ring-2 ring-sky-500/30`
                        : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{st.label}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Parecer Técnico Conclusivo do Consultor
              </label>
              <textarea
                rows={3}
                value={laudo.conclusao.parecerTecnico}
                onChange={(e) =>
                  setLaudo({
                    ...laudo,
                    conclusao: { ...laudo.conclusao, parecerTecnico: e.target.value },
                  })
                }
                placeholder="Insira o texto pericial formal que atesta a integridade e procedência do carro para o comprador..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Observações de Venda / Pontos Fortes do Veículo (Opcional)
              </label>
              <input
                type="text"
                value={laudo.conclusao.restricoesUso || ''}
                onChange={(e) =>
                  setLaudo({
                    ...laudo,
                    conclusao: { ...laudo.conclusao, restricoesUso: e.target.value },
                  })
                }
                placeholder="Ex: Veículo de único dono, revisões em concessionária e pneus novos..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Digital Signatures Pad Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DigitalSignaturePad
              label="Assinatura do Consultor Pericial"
              signeeName={laudo.conclusao.responsavelNome}
              signeeRole={laudo.conclusao.responsavelCargo}
              value={laudo.conclusao.assinaturaTecnicoUrl}
              onChange={(dataUrl) =>
                setLaudo({
                  ...laudo,
                  conclusao: { ...laudo.conclusao, assinaturaTecnicoUrl: dataUrl },
                })
              }
            />

            <DigitalSignaturePad
              label="Assinatura do Proprietário Vendedor"
              signeeName={laudo.cliente.nome || 'Proprietário'}
              signeeRole="Proprietário Solicitante"
              value={laudo.conclusao.assinaturaClienteUrl}
              onChange={(dataUrl) =>
                setLaudo({
                  ...laudo,
                  conclusao: { ...laudo.conclusao, assinaturaClienteUrl: dataUrl },
                })
              }
            />
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Bar */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xs flex items-center justify-between">
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Etapa {currentStep} de 7: <strong className="text-slate-800 dark:text-slate-200">{steps[currentStep - 1].title}</strong>
        </div>

        {currentStep < 7 ? (
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs"
          >
            Próximo <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSaveDraft('concluido')}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" /> Concluir e Emitir Laudo
          </button>
        )}
      </div>
    </div>
  );
};
