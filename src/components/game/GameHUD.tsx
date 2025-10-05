import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Anchor, Coins, Heart, Target } from "lucide-react";

interface GameHUDProps {
  health: number;
  score: number;
  gold: number;
}

export const GameHUD = ({ health, score, gold }: GameHUDProps) => {
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
          </div>
        </Card>
      </div>

      {/* Controls hint */}
      <Card className="mt-4 p-3 bg-card/80 backdrop-blur-sm border-accent/20 max-w-md pointer-events-auto">
        <div className="text-xs text-foreground/70 space-y-1">
          <div className="flex justify-between">
            <span>Move:</span>
            <span className="font-mono text-accent">WASD / Arrow Keys</span>
          </div>
          <div className="flex justify-between">
            <span>Fire Cannons:</span>
            <span className="font-mono text-accent">SPACE</span>
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
