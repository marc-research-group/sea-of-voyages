import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Anchor, Coins, Heart, Target, Store } from "lucide-react";
import { Port } from "@/lib/game/Port";

interface GameHUDProps {
  health: number;
  score: number;
  gold: number;
  cargo: { [key: string]: number };
  cargoCapacity: number;
  nearPort: Port | null;
  onTrade: () => void;
}

export const GameHUD = ({ health, score, gold, cargo, cargoCapacity, nearPort, onTrade }: GameHUDProps) => {
  const totalCargo = Object.values(cargo).reduce((sum, qty) => sum + qty, 0);
  return (
    <div className="absolute top-4 left-4 right-4 pointer-events-none z-10">
      <div className="flex justify-between items-start gap-4">
        {/* Left side - Ship status */}
        <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30 pointer-events-auto">
          <div className="flex items-center gap-3 mb-3">
            <Anchor className="w-5 h-5 text-accent" />
            <h3 className="font-serif text-lg text-accent">Your Ship</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-destructive" />
              <span className="text-sm text-foreground/80 min-w-[60px]">Hull:</span>
              <div className="flex-1">
                <Progress value={health} className="h-2" />
              </div>
              <span className="text-sm font-bold text-foreground min-w-[45px] text-right">
                {health}%
              </span>
            </div>
          </div>
        </Card>

        {/* Right side - Resources */}
        <Card className="p-4 bg-card/90 backdrop-blur-sm border-accent/30 pointer-events-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent" />
              <span className="text-sm text-foreground/80">Score:</span>
              <span className="text-lg font-bold text-accent font-serif">
                {score}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-accent" />
              <span className="text-sm text-foreground/80">Gold:</span>
              <span className="text-lg font-bold text-accent font-serif">
                {gold}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-accent" />
              <span className="text-sm text-foreground/80">Cargo:</span>
              <span className="text-lg font-bold text-accent font-serif">
                {totalCargo}/{cargoCapacity}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Port proximity indicator */}
      {nearPort && (
        <Card className="mt-4 p-4 bg-card/90 backdrop-blur-sm border-accent/50 pointer-events-auto animate-float">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Store className="w-6 h-6 text-accent" />
              <div>
                <h3 className="font-serif text-lg text-accent">{nearPort.name}</h3>
                <p className="text-xs text-foreground/70">Press T to trade</p>
              </div>
            </div>
            <Button 
              onClick={onTrade}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Trade
            </Button>
          </div>
        </Card>
      )}

      {/* Controls hint */}
      <Card className="mt-4 p-3 bg-card/80 backdrop-blur-sm border-accent/20 max-w-md pointer-events-auto">
        <div className="text-xs text-foreground/70 space-y-1">
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="font-mono text-accent">WASD / Arrow Keys</span>
          </div>
          <div className="flex justify-between">
            <span>Fire Both Sides:</span>
            <span className="font-mono text-accent">SPACE</span>
          </div>
          <div className="flex justify-between">
            <span>Fire Left/Right:</span>
            <span className="font-mono text-accent">Left/Right CTRL</span>
          </div>
          <div className="flex justify-between">
            <span>Trade:</span>
            <span className="font-mono text-accent">T (at port)</span>
          </div>
          <div className="flex justify-between">
            <span>Pause:</span>
            <span className="font-mono text-accent">P</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
