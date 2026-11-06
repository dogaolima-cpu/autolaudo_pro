/**
 * AutoLaudo Pro - Tipos e Interfaces do Sistema Pericial Automotivo
 * Focado na consultoria pericial para o proprietário vendedor do veículo
 */

export type UserRole = 'admin' | 'avaliador' | 'consultor';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  role: UserRole;
  registroProfissional?: string;
  telefone: string;
}

export type StatusLaudo = 'em_andamento' | 'concluido' | 'cancelado';
export type RecomendacaoStatus = 'aprovado' | 'aprovado_apontamentos' | 'reprovado';
export type CondicaoMecanica = 'excelente' | 'boa' | 'regular' | 'critica';
export type DanosSeveridade = 'leve' | 'moderada' | 'grave';

export type TipoDano = 
  | 'risco_superficial'
  | 'risco_profundo'
  | 'amassado'
  | 'repintura'
  | 'massa_plastica'
  | 'trinca_vidro'
  | 'corrosao'
  | 'dano_estrutural'
  | 'peca_quebrada'
  | 'desalinhamento';

export type CarView = 'top' | 'front' | 'rear' | 'left' | 'right';

export interface CarDamagePoint {
  id: string;
  view: CarView;
  x: number; // Porcentagem 0-100
  y: number; // Porcentagem 0-100
  type: TipoDano;
  partName: string;
  severity: DanosSeveridade;
  estimatedCost: number;
  notes?: string;
}

export type ChecklistStatus = 'conforme' | 'atencao' | 'irregular' | 'nao_se_aplica';

export interface ChecklistItem {
  id: string;
  category: 'motor' | 'transmissao' | 'suspensao' | 'freios' | 'eletrica' | 'interior' | 'vidros' | 'pneus';
  name: string;
  description: string;
  status: ChecklistStatus;
  notes?: string;
  estimatedRepairCost?: number;
}

export interface TestDriveData {
  ruidosMotorTransmissao: string;
  comportamentoSuspensao: string;
  anomaliasPedais: string;
  vibracoesTrepidacoes: string;
  alinhamentoDirecao: string;
  observacoesPercurso: string;
  statusGeralRodagem: 'excelente' | 'bom' | 'regular' | 'critico';
  percursoKm: number;
}

export interface MaintenanceRecord {
  id: string;
  data: string;
  km: number;
  tipo: 'preventiva' | 'corretiva' | 'revisao_concessionaria';
  descricao: string;
  pecasTrocadas: string;
  comprovadaComNota: boolean;
}

export interface VehiclePhoto {
  id: string;
  category: 'frente' | 'traseira' | 'lateral_esq' | 'lateral_dir' | 'interior' | 'motor' | 'pneus' | 'painel_km' | 'avaria_detalhe';
  title: string;
  dataUrl: string;
  timestamp: string;
  observacao?: string;
}

export interface PricingData {
  valorFipe: number;
  codigoFipe: string;
  mesReferenciaFipe: string;
  ajusteMercadoRegional: number; // Ágio ou deságio regional (+/- R$)
  ajusteConservacaoOpcionais: number; // Valorização por estado impecável ou opcionais (+ R$)
  custoEstimadoAvarias: number; // Relatado para transparência sem abater compulsoriamente
  margemNegociacaoPercentual: number; // Margem para conceder desconto em contraproposta (ex: 5% a 8%)
  precoVendaSugerido: number; // Preço Sugerido de Anúncio (Vitrine/Particular)
  precoMinimoNegociacao: number; // Preço Mínimo Aceitável para Fechar Negócio
  observacoesPrecificacao: string;
}

export interface InspectionConclusion {
  recomendacao: RecomendacaoStatus;
  condicaoMecanica: CondicaoMecanica;
  danosEstruturaisEvidentes: boolean;
  danosEsteticosEvidentes: boolean;
  restricoesUso?: string;
  parecerTecnico: string;
  responsavelNome: string;
  responsavelCargo: string;
  responsavelRegistro?: string;
  assinaturaTecnicoUrl?: string;
  assinaturaClienteUrl?: string;
  dataAssinatura?: string;
}

export interface VehicleData {
  placa: string;
  chassi?: string;
  renavam?: string;
  marca: string;
  modelo: string;
  versao: string;
  anoFabricacao: number;
  anoModelo: number;
  cor: string;
  kmAtual: number;
  combustivel: 'Flex' | 'Gasolina' | 'Etanol' | 'Diesel' | 'Híbrido' | 'Elétrico';
  cambio: 'Manual' | 'Automático' | 'CVT' | 'Automatizado';
  codigoFipe?: string;
  mesReferenciaFipe?: string;
  valorFipe?: number;
}

export interface ClientData {
  nome: string;
  telefone: string;
  email: string;
  cpfCnpj?: string;
  cidadeUf?: string;
}

export interface Laudo {
  id: string;
  numeroLaudo: string; // Ex: "LAU-2026-0042"
  dataCriacao: string;
  dataAtualizacao: string;
  status: StatusLaudo;
  criadoPor: string;
  cliente: ClientData;
  veiculo: VehicleData;
  danosCarroceria: CarDamagePoint[];
  checklist: ChecklistItem[];
  equipamentos: Record<string, boolean>;
  testeRodagem: TestDriveData;
  historicoManutencao: MaintenanceRecord[];
  fotos: VehiclePhoto[];
  precificacao: PricingData;
  conclusao: InspectionConclusion;
}
