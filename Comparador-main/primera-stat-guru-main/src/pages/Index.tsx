import { useState, useEffect } from 'react';
import { ClubStats, Goal } from '@/types/football';
import { loadClubs, saveClubs, resetAllData, exportToJSON, exportToCSV } from '@/lib/storage';
import { ClubCard } from '@/components/ClubCard';
import { GoalModal } from '@/components/GoalModal';
import { ComparisonView } from '@/components/ComparisonView';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, RotateCcw, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [clubs, setClubs] = useState<ClubStats[]>([]);
  const [selectedClub, setSelectedClub] = useState<ClubStats | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [compareClubs, setCompareClubs] = useState<[ClubStats | null, ClubStats | null]>([null, null]);
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setClubs(loadClubs());
  }, []);

  useEffect(() => {
    if (clubs.length > 0) {
      saveClubs(clubs);
    }
  }, [clubs]);

  const handleUpdateClub = (updatedClub: ClubStats) => {
    setClubs(clubs.map(c => c.id === updatedClub.id ? updatedClub : c));
  };

  const handleAddGoal = (club: ClubStats) => {
    setSelectedClub(club);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goal: Goal, isScored: boolean) => {
    if (!selectedClub) return;

    const updated = { ...selectedClub };
    const location = goal.isHome ? 'home' : 'away';
    
    if (isScored) {
      updated.goalsScored[location].push(goal);
    } else {
      updated.goalsConceded[location].push(goal);
    }

    handleUpdateClub(updated);
    toast({
      title: 'Gol adicionado',
      description: `Gol ${isScored ? 'marcado' : 'sofrido'} registrado com sucesso!`,
    });
  };

  const handleSelectForComparison = (club: ClubStats) => {
    if (!compareClubs[0]) {
      setCompareClubs([club, null]);
    } else if (compareClubs[0].id === club.id) {
      setCompareClubs([null, null]);
    } else if (!compareClubs[1]) {
      setCompareClubs([compareClubs[0], club]);
      // Auto show comparison when both selected
      setTimeout(() => setShowComparison(true), 300);
    } else if (compareClubs[1].id === club.id) {
      setCompareClubs([compareClubs[0], null]);
    } else {
      setCompareClubs([club, null]);
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      setClubs(resetAllData());
      setCompareClubs([null, null]);
      setShowComparison(false);
      toast({
        title: 'Dados resetados',
        description: 'Todos os dados foram resetados com sucesso.',
      });
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (format === 'json') {
      exportToJSON(clubs);
    } else {
      exportToCSV(clubs);
    }
    toast({
      title: 'Dados exportados',
      description: `Dados exportados em formato ${format.toUpperCase()}.`,
    });
  };

  const group1Clubs = clubs.filter(c => c.group === 1);
  const group2Clubs = clubs.filter(c => c.group === 2);

  if (showComparison && compareClubs[0] && compareClubs[1]) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <ComparisonView
            club1={compareClubs[0]}
            club2={compareClubs[1]}
            allClubs={clubs}
            onBack={() => setShowComparison(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Comparador Estatístico
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                Primera Federación · Espanha 2025/2026
              </p>
            </div>
            <div className="flex flex-wrap gap-2 animate-slide-up">
              {compareClubs[0] && compareClubs[1] && (
                <Button 
                  onClick={() => setShowComparison(true)} 
                  size="lg"
                  className="gradient-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 font-semibold"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Comparação
                </Button>
              )}
              <Button 
                onClick={() => handleExport('json')} 
                variant="outline"
                className="font-semibold border-2 hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
              <Button 
                onClick={() => handleExport('csv')} 
                variant="outline"
                className="font-semibold border-2 hover:border-primary hover:text-primary transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button 
                onClick={handleReset} 
                variant="destructive"
                className="font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Resetar
              </Button>
            </div>
          </div>
          
          {(compareClubs[0] || compareClubs[1]) && (
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl border-l-4 border-primary shadow-md animate-slide-up">
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="text-primary">●</span>
                Selecionados para comparação: 
                {compareClubs[0] && <span className="ml-2 text-primary font-bold">{compareClubs[0].name}</span>}
                {compareClubs[0] && compareClubs[1] && <span className="mx-2 font-bold">vs</span>}
                {compareClubs[1] && <span className="text-primary font-bold">{compareClubs[1].name}</span>}
                {compareClubs[0] && !compareClubs[1] && (
                  <span className="ml-2 text-muted-foreground italic">(selecione outro clube)</span>
                )}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs defaultValue="group1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 p-1 bg-muted/50 backdrop-blur-sm shadow-md">
            <TabsTrigger 
              value="group1" 
              className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Grupo 1
            </TabsTrigger>
            <TabsTrigger 
              value="group2"
              className="font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
            >
              Grupo 2
            </TabsTrigger>
          </TabsList>

          <TabsContent value="group1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group1Clubs.map(club => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onUpdate={handleUpdateClub}
                  onAddGoal={handleAddGoal}
                  onSelect={handleSelectForComparison}
                  isSelected={compareClubs[0]?.id === club.id || compareClubs[1]?.id === club.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="group2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group2Clubs.map(club => (
                <ClubCard
                  key={club.id}
                  club={club}
                  onUpdate={handleUpdateClub}
                  onAddGoal={handleAddGoal}
                  onSelect={handleSelectForComparison}
                  isSelected={compareClubs[0]?.id === club.id || compareClubs[1]?.id === club.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <GoalModal
        open={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setSelectedClub(null);
        }}
        onSave={handleSaveGoal}
        clubName={selectedClub?.name || ''}
      />
    </div>
  );
};

export default Index;
