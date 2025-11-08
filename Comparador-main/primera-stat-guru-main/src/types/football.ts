export type GoalOrigin = 
  | 'bola_parada'
  | 'escanteio'
  | 'linha_fundo_direita'
  | 'linha_fundo_esquerda'
  | 'frontal_area'
  | 'contra_ataque'
  | 'penalti'
  | 'erro_defensivo'
  | 'outros';

export const GOAL_ORIGINS: Record<GoalOrigin, string> = {
  bola_parada: 'Bola Parada',
  escanteio: 'Escanteio',
  linha_fundo_direita: 'Linha de Fundo Direita',
  linha_fundo_esquerda: 'Linha de Fundo Esquerda',
  frontal_area: 'Frontal da Área',
  contra_ataque: 'Contra-Ataque',
  penalti: 'Pênalti',
  erro_defensivo: 'Erro Defensivo Adversário',
  outros: 'Outros'
};

export interface Goal {
  minute: number;
  origin: GoalOrigin;
  isHome: boolean;
}

export interface ClubStats {
  id: string;
  name: string;
  group: 1 | 2;
  goalsScored: {
    home: Goal[];
    away: Goal[];
  };
  goalsConceded: {
    home: Goal[];
    away: Goal[];
  };
  yellowCards: {
    home: number;
    away: number;
  };
  redCards: {
    home: number;
    away: number;
  };
}

export interface ComparisonData {
  club1: ClubStats;
  club2: ClubStats;
  insights: string[];
  bettingInsights: BettingInsight[];
}

export interface BettingInsight {
  market: string;
  analysis: string;
  probability?: string;
}
