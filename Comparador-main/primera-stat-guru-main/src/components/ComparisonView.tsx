import { ClubStats, GOAL_ORIGINS } from '@/types/football';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import { 
  calculateGoalsByOrigin, 
  generateComparisonInsights, 
  generateBettingInsights 
} from '@/lib/calculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ComparisonViewProps {
  club1: ClubStats;
  club2: ClubStats;
  allClubs: ClubStats[];
  onBack: () => void;
}

export const ComparisonView = ({ club1, club2, allClubs, onBack }: ComparisonViewProps) => {
  const insights = generateComparisonInsights(club1, club2, allClubs);
  const bettingInsights = generateBettingInsights(club1, club2);

  // Club 1 stats (HOME)
  const club1GoalsHome = club1.goalsScored.home.length;
  const club1GoalsAway = club1.goalsScored.away.length;
  const club1ConcededHome = club1.goalsConceded.home.length;
  const club1ConcededAway = club1.goalsConceded.away.length;
  const club1YellowCards = club1.yellowCards.home + club1.yellowCards.away;
  const club1RedCards = club1.redCards.home + club1.redCards.away;

  // Club 2 stats (AWAY)
  const club2GoalsHome = club2.goalsScored.home.length;
  const club2GoalsAway = club2.goalsScored.away.length;
  const club2ConcededHome = club2.goalsConceded.home.length;
  const club2ConcededAway = club2.goalsConceded.away.length;
  const club2YellowCards = club2.yellowCards.home + club2.yellowCards.away;
  const club2RedCards = club2.redCards.home + club2.redCards.away;

  // Calculate origin stats
  const club1ScoredOrigins = calculateGoalsByOrigin([...club1.goalsScored.home, ...club1.goalsScored.away]);
  const club2ScoredOrigins = calculateGoalsByOrigin([...club2.goalsScored.home, ...club2.goalsScored.away]);
  const club1ConcededOrigins = calculateGoalsByOrigin([...club1.goalsConceded.home, ...club1.goalsConceded.away]);
  const club2ConcededOrigins = calculateGoalsByOrigin([...club2.goalsConceded.home, ...club2.goalsConceded.away]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="font-semibold border-2 hover:border-primary hover:text-primary transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card className="shadow-elegant border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
          <CardTitle className="text-center text-3xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {club1.name}
            </span>
            <span className="text-muted-foreground mx-4 font-normal">vs</span>
            <span className="bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
              {club2.name}
            </span>
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground font-semibold mt-2 flex items-center justify-center gap-2">
            <span className="px-3 py-1 bg-success/10 text-success rounded-full">{club1.name} como MANDANTE</span>
            <span>|</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">{club2.name} como VISITANTE</span>
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estatística</TableHead>
                <TableHead className="text-center">{club1.name} (Casa)</TableHead>
                <TableHead className="text-center">{club2.name} (Fora)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Gols Marcados (Total)</TableCell>
                <TableCell className="text-center">
                  {club1GoalsHome + club1GoalsAway} ({club1GoalsHome} casa / {club1GoalsAway} fora)
                </TableCell>
                <TableCell className="text-center">
                  {club2GoalsHome + club2GoalsAway} ({club2GoalsHome} casa / {club2GoalsAway} fora)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gols no Cenário da Partida</TableCell>
                <TableCell className="text-center font-bold text-success">{club1GoalsHome}</TableCell>
                <TableCell className="text-center font-bold text-success">{club2GoalsAway}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gols Sofridos (Total)</TableCell>
                <TableCell className="text-center">
                  {club1ConcededHome + club1ConcededAway} ({club1ConcededHome} casa / {club1ConcededAway} fora)
                </TableCell>
                <TableCell className="text-center">
                  {club2ConcededHome + club2ConcededAway} ({club2ConcededHome} casa / {club2ConcededAway} fora)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gols Sofridos no Cenário</TableCell>
                <TableCell className="text-center font-bold text-destructive">{club1ConcededHome}</TableCell>
                <TableCell className="text-center font-bold text-destructive">{club2ConcededAway}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cartões Amarelos</TableCell>
                <TableCell className="text-center">{club1YellowCards}</TableCell>
                <TableCell className="text-center">{club2YellowCards}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cartões Vermelhos</TableCell>
                <TableCell className="text-center">{club1RedCards}</TableCell>
                <TableCell className="text-center">{club2RedCards}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total de Cartões</TableCell>
                <TableCell className="text-center">{club1YellowCards + club1RedCards}</TableCell>
                <TableCell className="text-center">{club2YellowCards + club2RedCards}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Goal Origins Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Origens dos Gols Marcados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm">{club1.name}</h4>
              {club1ScoredOrigins.length > 0 ? (
                <div className="space-y-1">
                  {club1ScoredOrigins.map((stat) => (
                    <div key={stat.origin} className="flex justify-between text-sm">
                      <span>{GOAL_ORIGINS[stat.origin]}</span>
                      <span className="font-medium">
                        {stat.count} ({stat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">{club2.name}</h4>
              {club2ScoredOrigins.length > 0 ? (
                <div className="space-y-1">
                  {club2ScoredOrigins.map((stat) => (
                    <div key={stat.origin} className="flex justify-between text-sm">
                      <span>{GOAL_ORIGINS[stat.origin]}</span>
                      <span className="font-medium">
                        {stat.count} ({stat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Origens dos Gols Sofridos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm">{club1.name}</h4>
              {club1ConcededOrigins.length > 0 ? (
                <div className="space-y-1">
                  {club1ConcededOrigins.map((stat) => (
                    <div key={stat.origin} className="flex justify-between text-sm">
                      <span>{GOAL_ORIGINS[stat.origin]}</span>
                      <span className="font-medium">
                        {stat.count} ({stat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">{club2.name}</h4>
              {club2ConcededOrigins.length > 0 ? (
                <div className="space-y-1">
                  {club2ConcededOrigins.map((stat) => (
                    <div key={stat.origin} className="flex justify-between text-sm">
                      <span>{GOAL_ORIGINS[stat.origin]}</span>
                      <span className="font-medium">
                        {stat.count} ({stat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Betting Insights */}
      {bettingInsights.length > 0 && (
        <Card className="border-2 border-primary/30 shadow-elegant bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold">Análise para Mercados de Apostas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {bettingInsights.map((insight, idx) => (
              <div key={idx} className="p-5 bg-gradient-to-br from-card to-muted/30 rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg text-primary">{insight.market}</h4>
                  {insight.probability && (
                    <Badge variant="secondary" className="font-semibold text-sm px-3 py-1">
                      {insight.probability}
                    </Badge>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{insight.analysis}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* General Insights */}
      {insights.length > 0 && (
        <Card className="shadow-elegant border-2">
          <CardHeader className="border-b bg-gradient-to-r from-muted/50 to-transparent">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-warning/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <span className="font-bold">Observações Táticas e Estatísticas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                  <span className="text-primary font-bold text-lg">•</span>
                  <span className="text-sm leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
