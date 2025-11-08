import { ClubStats } from '@/types/football';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Target } from 'lucide-react';
import { useState } from 'react';

interface ClubCardProps {
  club: ClubStats;
  onUpdate: (club: ClubStats) => void;
  onAddGoal: (club: ClubStats) => void;
  onSelect?: (club: ClubStats) => void;
  isSelected?: boolean;
}

export const ClubCard = ({ club, onUpdate, onAddGoal, onSelect, isSelected }: ClubCardProps) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(club.name);

  const totalGoalsScored = club.goalsScored.home.length + club.goalsScored.away.length;
  const totalGoalsConceded = club.goalsConceded.home.length + club.goalsConceded.away.length;
  const totalYellowCards = club.yellowCards.home + club.yellowCards.away;
  const totalRedCards = club.redCards.home + club.redCards.away;

  const handleNameSave = () => {
    if (editedName.trim()) {
      onUpdate({ ...club, name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const updateCards = (type: 'yellow' | 'red', location: 'home' | 'away', increment: boolean) => {
    const updated = { ...club };
    if (type === 'yellow') {
      updated.yellowCards[location] = Math.max(0, updated.yellowCards[location] + (increment ? 1 : -1));
    } else {
      updated.redCards[location] = Math.max(0, updated.redCards[location] + (increment ? 1 : -1));
    }
    onUpdate(updated);
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-elegant ${isSelected ? 'ring-2 ring-primary shadow-elegant scale-[1.02]' : ''} animate-fade-in`}>
      <CardHeader className="pb-3 bg-gradient-to-br from-card to-muted/20">
        <CardTitle className="flex items-center justify-between text-lg">
          {isEditingName ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
              className="h-8 border-2 focus:border-primary"
            />
          ) : (
            <span 
              onClick={() => setIsEditingName(true)} 
              className="cursor-pointer hover:text-primary transition-colors duration-200 font-semibold"
            >
              {club.name}
            </span>
          )}
          <span className="text-sm text-muted-foreground font-medium px-2 py-1 bg-muted rounded-md">
            Grupo {club.group}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Goals Section */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl border border-border/50">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gols Marcados</div>
            <div className="text-3xl font-bold bg-gradient-to-br from-success to-success/80 bg-clip-text text-transparent">
              {totalGoalsScored}
            </div>
            <div className="text-xs space-x-1">
              <span className="text-muted-foreground font-medium">Casa:</span> 
              <span className="font-semibold">{club.goalsScored.home.length}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground font-medium">Fora:</span> 
              <span className="font-semibold">{club.goalsScored.away.length}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gols Sofridos</div>
            <div className="text-3xl font-bold bg-gradient-to-br from-destructive to-destructive/80 bg-clip-text text-transparent">
              {totalGoalsConceded}
            </div>
            <div className="text-xs space-x-1">
              <span className="text-muted-foreground font-medium">Casa:</span> 
              <span className="font-semibold">{club.goalsConceded.home.length}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground font-medium">Fora:</span> 
              <span className="font-semibold">{club.goalsConceded.away.length}</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => onAddGoal(club)} 
          variant="outline" 
          className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 border-2 font-semibold" 
          size="sm"
        >
          <Target className="w-4 h-4 mr-2" />
          Adicionar Gol
        </Button>

        {/* Cards Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-warning/20 to-warning/10 rounded-lg border border-warning/20 hover:border-warning/40 transition-colors">
            <span className="text-sm font-semibold">Cartões Amarelos</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateCards('yellow', 'home', false)}
                className="h-8 w-8 p-0 hover:bg-warning/20 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold min-w-[2.5rem] text-center text-lg">{totalYellowCards}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateCards('yellow', 'home', true)}
                className="h-8 w-8 p-0 hover:bg-warning/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-lg border border-destructive/20 hover:border-destructive/40 transition-colors">
            <span className="text-sm font-semibold">Cartões Vermelhos</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateCards('red', 'home', false)}
                className="h-8 w-8 p-0 hover:bg-destructive/20 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold min-w-[2.5rem] text-center text-lg">{totalRedCards}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateCards('red', 'home', true)}
                className="h-8 w-8 p-0 hover:bg-destructive/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {onSelect && (
          <Button
            onClick={() => onSelect(club)}
            variant={isSelected ? 'default' : 'secondary'}
            className={`w-full font-semibold transition-all duration-300 ${
              isSelected ? 'shadow-lg shadow-primary/50' : 'hover:shadow-md'
            }`}
            size="sm"
          >
            {isSelected ? '✓ Selecionado' : 'Selecionar para Comparar'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
