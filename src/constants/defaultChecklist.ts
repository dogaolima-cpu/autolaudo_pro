import { ChecklistItem, TipoDano } from '../types/laudo';

export const DAMAGE_TYPES: Record<TipoDano, { label: string; color: string; defaultCost: number }> = {
  risco_superficial: { label: 'Risco Superficial', color: '#38bdf8', defaultCost: 150 },
  risco_profundo: { label: 'Risco Profundo', color: '#f59e0b', defaultCost: 350 },
  amassado: { label: 'Amassado / Martelinho', color: '#f97316', defaultCost: 280 },
  repintura: { label: 'Repintura Detectada', color: '#a855f7', defaultCost: 450 },
  massa_plastica: { label: 'Excesso de Massa Plástica', color: '#ec4899', defaultCost: 650 },
  trinca_vidro: { label: 'Trinca / Pára-brisa', color: '#06b6d4', defaultCost: 600 },
  corrosao: { label: 'Ponto de Corrosão / Ferrugem', color: '#eab308', defaultCost: 500 },
  dano_estrutural: { label: 'Dano Estrutural / Longarina', color: '#ef4444', defaultCost: 2200 },
  peca_quebrada: { label: 'Peça Trincada ou Quebrada', color: '#dc2626', defaultCost: 400 },
  desalinhamento: { label: 'Desalinhamento de Vãos', color: '#6366f1', defaultCost: 300 },
};

export const DEFAULT_EQUIPMENTS = [
  'Ar-condicionado Digital',
  'Direção Elétrica / Hidráulica',
  'Airbags Frontais e Laterais',
  'Freios ABS com EBD',
  'Controle de Estabilidade (ESP/ESC)',
  'Assistente de Partida em Rampa (HSA)',
  'Central Multimídia com Apple CarPlay/Android Auto',
  'Câmera de Marcha a Ré',
  'Sensor de Estacionamento Traseiro/Dianteiro',
  'Piloto Automático (Cruise Control)',
  'Bancos Revestidos em Couro',
  'Teto Solar Elétrico / Panorâmico',
  'Chave Presencial com Botão Start/Stop',
  'Faróis Full LED com DRL',
  'Rodas de Liga Leve',
  'Retrovisores com Ajuste e Rebatimento Elétrico',
  'Vidros Elétricos nas 4 Portas com One-Touch',
  'Travas Elétricas com Alarme Volumétrico',
  'Sensor de Chuva e Crepuscular',
  'Monitoramento de Pressão dos Pneus (TPMS)',
];

export const INITIAL_CHECKLIST_ITEMS: Omit<ChecklistItem, 'id' | 'status' | 'notes'>[] = [
  // Motor
  { category: 'motor', name: 'Nível e Estado do Óleo do Motor', description: 'Viscosidade, coloração, presença de borra ou contaminação por água' },
  { category: 'motor', name: 'Líquido de Arrefecimento e Radiador', description: 'Nível do reservatório, aditivo, ausência de vazamentos e mangueiras' },
  { category: 'motor', name: 'Ruídos Mecânicos e Batimento de Válvulas', description: 'Funcionamento uniforme a frio e quente sem estalos ou grilos' },
  { category: 'motor', name: 'Correia Dentada / Corrente de Sincronismo', description: 'Desgaste aparente, ressecamento, ruído de rolamentos tensores' },
  { category: 'motor', name: 'Emissão de Fumaça no Escapamento', description: 'Ausência de fumaça azulada (óleo), preta (combustível) ou branca (água)' },
  { category: 'motor', name: 'Vazamentos Aparente no Bloco e Retentores', description: 'Junta de cabeçote, tampa de válvulas, cárter e retentor do volante' },

  // Transmissão
  { category: 'transmissao', name: 'Engate de Marchas e Curso da Alavanca', description: 'Precisão nos engates mecânicos ou suavidade nas trocas automáticas' },
  { category: 'transmissao', name: 'Embreagem / Conversor de Torque', description: 'Altura do pedal, trepidação na arrancada ou trancos em trocas D/R' },
  { category: 'transmissao', name: 'Semieixos, Homocinéticas e Coifas', description: 'Estado das coifas protetoras de graxa e ausência de estalos em curvas' },

  // Suspensão
  { category: 'suspensao', name: 'Amortecedores e Batentes Diant./Tras.', description: 'Vazamento de fluido hidráulico, eficiência e estado dos batentes' },
  { category: 'suspensao', name: 'Buchas de Bandeja e Braços Oscilantes', description: 'Folgas radiais, rachaduras e desgaste da borracha' },
  { category: 'suspensao', name: 'Pivôs, Bieletas e Barra Estabilizadora', description: 'Folgas mecânicas ao movimentar as rodas e ruídos ao passar em desnível' },
  { category: 'suspensao', name: 'Molas Helicoidais e Altura da Carroceria', description: 'Integridade física, sem cortes ou alteração irregular de suspensão' },

  // Freios
  { category: 'freios', name: 'Pastilhas e Discos de Freio Dianteiros', description: 'Espessura útil da pastilha e ausência de calos/ondulações nos discos' },
  { category: 'freios', name: 'Tambores e Sapatas Traseiras', description: 'Eficiência de frenagem traseira e cilindros de roda' },
  { category: 'freios', name: 'Freio de Estacionamento (Mão/Eletrônico)', description: 'Retenção firme em rampa inclinada e atuação em ambos os lados' },
  { category: 'freios', name: 'Fluido de Freio e Linhas Hidráulicas', description: 'Ponto de ebulição/umidade, nível e ausência de corrosão nas tubulações' },

  // Elétrica
  { category: 'eletrica', name: 'Bateria e Sistema de Carga (Alternador)', description: 'Tensão em repouso e com motor ligado (13.8V a 14.4V), polo sem zinabre' },
  { category: 'eletrica', name: 'Painel de Instrumentos e Luzes Espia', description: 'Check-up de injeção, airbag e ABS acendendo e apagando no pós-chave' },
  { category: 'eletrica', name: 'Faróis Principais, Alto, Baixo e DRL', description: 'Funcionamento de lâmpadas/LEDs e regulagem de altura do facho' },
  { category: 'eletrica', name: 'Lanternas Traseiras, Luz de Freio e Ré', description: 'Lentes sem quebras e lâmpadas atuantes sem falhas' },
  { category: 'eletrica', name: 'Limpadores e Esguichos de Para-brisa', description: 'Borracha das palhetas, motor do temporizador e bomba do esguicho' },

  // Interior
  { category: 'interior', name: 'Estado dos Bancos e Estofamentos', description: 'Desgaste, rasgos, queimaduras de cigarro e trilhos de ajuste' },
  { category: 'interior', name: 'Painel, Difusores e Botões de Comando', description: 'Plásticos íntegros sem rachaduras, difusores de ar e comandos elétricos' },
  { category: 'interior', name: 'Sistema de Ar-condicionado e Ventilação', description: 'Eficiência térmica, resfriamento rápido e ausência de odores' },
  { category: 'interior', name: 'Cintos de Segurança e Travamento', description: 'Recuo automático dos 5 cintos, travas e data nas etiquetas de fábrica' },
  { category: 'interior', name: 'Forro do Teto e Quebra-sóis', description: 'Sem manchas de infiltração, descolamento ou frouxidão' },

  // Vidros
  { category: 'vidros', name: 'Gravação de Chassi nos Vidros', description: 'Numeração do chassi gravada original em para-brisa, vigia e laterais' },
  { category: 'vidros', name: 'Para-brisa Dianteiro', description: 'Ausência de trincas ou lascas na área de varredura dos limpadores' },
  { category: 'vidros', name: 'Máquinas e Vidros Elétricos', description: 'Velocidade uniforme de subida e descida sem emperramentos' },

  // Pneus
  { category: 'pneus', name: 'Pneus Dianteiros (Sulco e TWI)', description: 'Profundidade mínima de 1.6mm de sulco e desgaste homogêneo' },
  { category: 'pneus', name: 'Pneus Traseiros (Sulco e TWI)', description: 'Ausência de bolhas, cortes laterais ou escareamento' },
  { category: 'pneus', name: 'Estepe, Macaco, Chave de Roda e Triângulo', description: 'Pneu reserva calibrado e ferramentas de emergência presentes' },
  { category: 'pneus', name: 'Rodas (Aço/Liga) e Alinhamento Visual', description: 'Ausência de amassados nos bordos, trincas ou soldas' },
];

export function createDefaultChecklist(): ChecklistItem[] {
  return INITIAL_CHECKLIST_ITEMS.map((item, idx) => ({
    id: `chk_${idx + 1}`,
    category: item.category,
    name: item.name,
    description: item.description,
    status: 'conforme',
    notes: '',
  }));
}
