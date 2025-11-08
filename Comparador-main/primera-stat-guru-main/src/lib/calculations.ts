import { ClubStats, Goal, GoalOrigin, GOAL_ORIGINS, BettingInsight } from '@/types/football';

export interface GoalOriginStats {
  origin: GoalOrigin;
  count: number;
  percentage: number;
}

export const calculateGoalsByOrigin = (goals: Goal[]): GoalOriginStats[] => {
  const total = goals.length;
  if (total === 0) return [];

  const originCounts: Record<GoalOrigin, number> = {
    bola_parada: 0,
    escanteio: 0,
    linha_fundo_direita: 0,
    linha_fundo_esquerda: 0,
    frontal_area: 0,
    contra_ataque: 0,
    penalti: 0,
    erro_defensivo: 0,
    outros: 0
  };

  goals.forEach(goal => {
    originCounts[goal.origin]++;
  });

  return Object.entries(originCounts)
    .filter(([_, count]) => count > 0)
    .map(([origin, count]) => ({
      origin: origin as GoalOrigin,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count);
};

export const calculateGroupAverage = (clubs: ClubStats[], group: 1 | 2) => {
  const groupClubs = clubs.filter(c => c.group === group);
  const totalClubs = groupClubs.length;

  if (totalClubs === 0) return { yellowCards: 0, redCards: 0, totalCards: 0 };

  const totals = groupClubs.reduce((acc, club) => ({
    yellowCards: acc.yellowCards + club.yellowCards.home + club.yellowCards.away,
    redCards: acc.redCards + club.redCards.home + club.redCards.away,
  }), { yellowCards: 0, redCards: 0 });

  return {
    yellowCards: totals.yellowCards / totalClubs,
    redCards: totals.redCards / totalClubs,
    totalCards: (totals.yellowCards + totals.redCards) / totalClubs
  };
};

export const generateComparisonInsights = (club1: ClubStats, club2: ClubStats, allClubs: ClubStats[]): string[] => {
  const insights: string[] = [];

  // Goals scored analysis
  const club1GoalsHome = club1.goalsScored.home.length;
  const club1GoalsAway = club1.goalsScored.away.length;
  const club2GoalsHome = club2.goalsScored.home.length;
  const club2GoalsAway = club2.goalsScored.away.length;

  // Goals conceded analysis
  const club1ConcededHome = club1.goalsConceded.home.length;
  const club1ConcededAway = club1.goalsConceded.away.length;
  const club2ConcededHome = club2.goalsConceded.home.length;
  const club2ConcededAway = club2.goalsConceded.away.length;

  // Cards analysis
  const club1TotalCards = club1.yellowCards.home + club1.yellowCards.away + club1.redCards.home + club1.redCards.away;
  const club2TotalCards = club2.yellowCards.home + club2.yellowCards.away + club2.redCards.home + club2.redCards.away;

  const group1Avg = calculateGroupAverage(allClubs, club1.group);
  const group2Avg = calculateGroupAverage(allClubs, club2.group);

  // Home performance insights
  if (club1GoalsHome > club1GoalsAway * 1.3) {
    insights.push(`${club1.name} tem desempenho significativamente melhor em casa, marcando ${Math.round((club1GoalsHome / (club1GoalsHome + club1GoalsAway)) * 100)}% dos seus gols como mandante.`);
  }

  if (club2ConcededAway > club2ConcededHome * 1.3) {
    insights.push(`${club2.name} sofre consideravelmente mais gols fora de casa (${club2ConcededAway} fora vs ${club2ConcededHome} em casa), indicando fragilidade como visitante.`);
  }

  // Goal origins comparison
  const club1ScoredOrigins = calculateGoalsByOrigin([...club1.goalsScored.home, ...club1.goalsScored.away]);
  const club2ConcededOrigins = calculateGoalsByOrigin([...club2.goalsConceded.home, ...club2.goalsConceded.away]);

  if (club1ScoredOrigins.length > 0 && club2ConcededOrigins.length > 0) {
    const club1TopOrigin = club1ScoredOrigins[0];
    const club2TopWeakness = club2ConcededOrigins[0];

    if (club1TopOrigin.origin === club2TopWeakness.origin && club1TopOrigin.percentage > 15 && club2TopWeakness.percentage > 15) {
      insights.push(`Oportunidade tática: ${club1.name} marca ${club1TopOrigin.percentage.toFixed(1)}% dos gols via ${GOAL_ORIGINS[club1TopOrigin.origin]}, exatamente a principal vulnerabilidade de ${club2.name} (${club2TopWeakness.percentage.toFixed(1)}% dos gols sofridos).`);
    }
  }

  // Cards discipline comparison
  if (club1TotalCards > group1Avg.totalCards * 1.15) {
    const percentAbove = (((club1TotalCards - group1Avg.totalCards) / group1Avg.totalCards) * 100).toFixed(0);
    insights.push(`${club1.name} possui ${club1TotalCards} cartões no total (${percentAbove}% acima da média do Grupo ${club1.group}), indicando tendência disciplinar mais agressiva.`);
  }

  if (club2TotalCards > group2Avg.totalCards * 1.15) {
    const percentAbove = (((club2TotalCards - group2Avg.totalCards) / group2Avg.totalCards) * 100).toFixed(0);
    insights.push(`${club2.name} apresenta ${club2TotalCards} cartões (${percentAbove}% acima da média do Grupo ${club2.group}), sugerindo jogo mais físico.`);
  }

  // Time-based goal analysis
  const club1LateGoalsConceded = club1.goalsConceded.home.filter(g => g.minute > 75).length + 
                                   club1.goalsConceded.away.filter(g => g.minute > 75).length;
  const club1TotalConceded = club1ConcededHome + club1ConcededAway;

  if (club1TotalConceded > 0 && (club1LateGoalsConceded / club1TotalConceded) > 0.35) {
    insights.push(`${club1.name} sofre ${((club1LateGoalsConceded / club1TotalConceded) * 100).toFixed(0)}% dos gols após os 75 minutos, indicando possível desgaste físico no final das partidas.`);
  }

  return insights;
};

export const generateBettingInsights = (club1: ClubStats, club2: ClubStats): BettingInsight[] => {
  const insights: BettingInsight[] = [];

  // Club1 is HOME, Club2 is AWAY
  const club1GoalsHome = club1.goalsScored.home.length;
  const club1ConcededHome = club1.goalsConceded.home.length;
  const club2GoalsAway = club2.goalsScored.away.length;
  const club2ConcededAway = club2.goalsConceded.away.length;

  const totalGoals = club1GoalsHome + club2GoalsAway;
  const avgGoalsPerMatch = (club1GoalsHome + club1ConcededHome + club2GoalsAway + club2ConcededAway) / 
                           Math.max((club1.goalsScored.home.length + club1.goalsConceded.home.length + 
                                     club2.goalsScored.away.length + club2.goalsConceded.away.length) / 2, 1);

  // BTTS (Both Teams To Score)
  const club1ScoresHome = club1GoalsHome > 0;
  const club2ScoresAway = club2GoalsAway > 0;
  
  if (club1ScoresHome && club2ScoresAway) {
    const bttsPercentage = Math.min(95, 60 + (avgGoalsPerMatch * 10));
    insights.push({
      market: 'Ambas Marcam (BTTS)',
      analysis: `Probabilidade ALTA. ${club1.name} marca em ${Math.round((club1GoalsHome / Math.max(club1.goalsScored.home.length + club1.goalsConceded.home.length, 1)) * 100)}% das partidas em casa, e ${club2.name} marca em ${Math.round((club2GoalsAway / Math.max(club2.goalsScored.away.length + club2.goalsConceded.away.length, 1)) * 100)}% como visitante.`,
      probability: `${bttsPercentage.toFixed(0)}%`
    });
  } else {
    insights.push({
      market: 'Ambas Marcam (BTTS)',
      analysis: `Probabilidade MODERADA/BAIXA. Uma ou ambas equipes têm dificuldade de marcar nas condições de mando correspondentes.`,
      probability: '35-50%'
    });
  }

  // Over/Under Goals
  if (avgGoalsPerMatch > 2.5) {
    insights.push({
      market: 'Total de Gols',
      analysis: `Tendência para OVER 2.5 gols. Média combinada de ${avgGoalsPerMatch.toFixed(1)} gols por jogo. ${club1.name} (casa) tem média de ${(club1GoalsHome + club1ConcededHome).toFixed(1)} gols/jogo em casa, ${club2.name} (fora) tem ${(club2GoalsAway + club2ConcededAway).toFixed(1)} gols/jogo fora.`,
      probability: avgGoalsPerMatch > 3 ? '65-75%' : '55-65%'
    });
  } else {
    insights.push({
      market: 'Total de Gols',
      analysis: `Tendência para UNDER 2.5 gols. Média combinada de ${avgGoalsPerMatch.toFixed(1)} gols. Ambas equipes demonstram padrão de jogos com poucos gols.`,
      probability: '60-70%'
    });
  }

  // Match Result
  let resultAnalysis = '';
  let resultProb = '';

  if (club1GoalsHome > club2GoalsAway * 1.4 && club1ConcededHome < club2GoalsAway) {
    resultAnalysis = `Vantagem clara para ${club1.name}. Como mandante, marca ${club1GoalsHome} e sofre ${club1ConcededHome}, enquanto ${club2.name} fora marca ${club2GoalsAway} e sofre ${club2ConcededAway}.`;
    resultProb = 'Vitória Casa: 55-65%';
  } else if (club2GoalsAway > club1GoalsHome * 1.4 && club2ConcededAway < club1GoalsHome) {
    resultAnalysis = `${club2.name} apresenta bom desempenho fora. Vitória visitante é possível, mas mando de campo favorece ${club1.name}.`;
    resultProb = 'Vitória Fora: 30-40% | Empate: 30-35%';
  } else {
    resultAnalysis = `Jogo equilibrado. Estatísticas similares em casa (${club1.name}) e fora (${club2.name}). Mando de campo pode ser decisivo.`;
    resultProb = 'Vitória Casa: 40-45% | Empate: 25-30% | Vitória Fora: 25-30%';
  }

  insights.push({
    market: 'Resultado Final',
    analysis: resultAnalysis,
    probability: resultProb
  });

  // First Half / Second Half Goals
  const club1FirstHalfGoals = [...club1.goalsScored.home, ...club1.goalsScored.away].filter(g => g.minute <= 45).length;
  const club1SecondHalfGoals = [...club1.goalsScored.home, ...club1.goalsScored.away].filter(g => g.minute > 45).length;
  const club2FirstHalfGoals = [...club2.goalsScored.home, ...club2.goalsScored.away].filter(g => g.minute <= 45).length;
  const club2SecondHalfGoals = [...club2.goalsScored.home, ...club2.goalsScored.away].filter(g => g.minute > 45).length;

  const totalFirstHalf = club1FirstHalfGoals + club2FirstHalfGoals;
  const totalSecondHalf = club1SecondHalfGoals + club2SecondHalfGoals;
  const totalAllGoals = totalFirstHalf + totalSecondHalf;

  if (totalAllGoals > 0) {
    const firstHalfPercentage = (totalFirstHalf / totalAllGoals) * 100;
    const secondHalfPercentage = (totalSecondHalf / totalAllGoals) * 100;

    if (secondHalfPercentage > 60) {
      insights.push({
        market: 'Gols por Tempo',
        analysis: `Forte tendência de gols no SEGUNDO TEMPO (${secondHalfPercentage.toFixed(0)}% dos gols). Ambas equipes são mais produtivas após o intervalo.`,
        probability: `Mais gols 2T: ${Math.min(70, secondHalfPercentage).toFixed(0)}%`
      });
    } else if (firstHalfPercentage > 55) {
      insights.push({
        market: 'Gols por Tempo',
        analysis: `Equipes começam fortes. ${firstHalfPercentage.toFixed(0)}% dos gols ocorrem no PRIMEIRO TEMPO.`,
        probability: `Gol 1T: ${Math.min(65, firstHalfPercentage).toFixed(0)}%`
      });
    }
  }

  // Cards Market
  const club1TotalCards = club1.yellowCards.home + club1.yellowCards.away + (club1.redCards.home + club1.redCards.away) * 2;
  const club2TotalCards = club2.yellowCards.home + club2.yellowCards.away + (club2.redCards.home + club2.redCards.away) * 2;
  const avgCards = (club1TotalCards + club2TotalCards) / 2;

  if (avgCards > 4) {
    insights.push({
      market: 'Cartões',
      analysis: `Jogo com tendência de MUITOS CARTÕES. Média combinada de ${avgCards.toFixed(1)} cartões. ${club1.name}: ${club1TotalCards} cartões totais, ${club2.name}: ${club2TotalCards} cartões totais.`,
      probability: 'Over 4.5 Cartões: 60-70%'
    });
  }

  return insights;
};
