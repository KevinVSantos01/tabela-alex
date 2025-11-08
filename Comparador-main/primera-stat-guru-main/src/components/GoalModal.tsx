import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GoalOrigin, GOAL_ORIGINS, Goal } from '@/types/football';

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Goal, isScored: boolean) => void;
  clubName: string;
}

export const GoalModal = ({ open, onClose, onSave, clubName }: GoalModalProps) => {
  const [minute, setMinute] = useState(45);
  const [origin, setOrigin] = useState<GoalOrigin>('outros');
  const [isHome, setIsHome] = useState(true);
  const [type, setType] = useState<'scored' | 'conceded'>('scored');

  const handleSave = () => {
    const goal: Goal = { minute, origin, isHome };
    onSave(goal, type === 'scored');
    onClose();
    // Reset
    setMinute(45);
    setOrigin('outros');
    setIsHome(true);
    setType('scored');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Gol - {clubName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Tipo de Gol</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as 'scored' | 'conceded')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scored" id="scored" />
                <Label htmlFor="scored" className="font-normal cursor-pointer">Gol Marcado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="conceded" id="conceded" />
                <Label htmlFor="conceded" className="font-normal cursor-pointer">Gol Sofrido</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Local da Partida</Label>
            <RadioGroup value={isHome ? 'home' : 'away'} onValueChange={(v) => setIsHome(v === 'home')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home" className="font-normal cursor-pointer">Em Casa (Mandante)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="away" id="away" />
                <Label htmlFor="away" className="font-normal cursor-pointer">Fora de Casa (Visitante)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Minuto do Gol: {minute}'</Label>
            <Slider
              value={[minute]}
              onValueChange={(v) => setMinute(v[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Origem do Gol</Label>
            <Select value={origin} onValueChange={(v) => setOrigin(v as GoalOrigin)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GOAL_ORIGINS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
