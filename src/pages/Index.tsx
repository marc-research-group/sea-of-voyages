import { useState } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/game/GameHUD";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Anchor } from "lucide-react";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gold, setGold] = useState(0);

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-2xl w-full p-8 bg-card/95 backdrop-blur border-accent/30">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Anchor className="w-20 h-20 text-accent animate-float" />
            </div>
            
            <h1 className="text-5xl font-serif font-bold text-accent">
              Sea of Horizons
            </h1>
            
            <p className="text-xl text-foreground/80 max-w-lg mx-auto">
              Command your ship through treacherous waters. Engage enemy vessels in tactical broadside combat, 
              explore the procedural seas, and become a legendary captain.
            </p>

            <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left max-w-md mx-auto">
              <h3 className="font-serif text-lg text-accent mb-3 text-center">Your Mission</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">⚓</span>
                  <span>Navigate your ship using WASD or arrow keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">💣</span>
                  <span>Fire broadsides with SPACE - cannons only fire from your sides!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">⚔️</span>
                  <span>Defeat enemy ships to earn gold and increase your score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">🏝️</span>
                  <span>Avoid islands and stay within the map boundaries</span>
                </li>
              </ul>
            </div>

            <Button 
              size="lg" 
              onClick={() => setGameStarted(true)}
              className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-serif"
            >
              Set Sail
            </Button>

            <p className="text-xs text-foreground/50">
              Position your ship to bring your cannons to bear. Master the art of the broadside!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GameCanvas 
        onScoreChange={setScore}
        onHealthChange={setHealth}
        onGoldChange={setGold}
      />
      <GameHUD health={health} score={score} gold={gold} />
    </div>
  );
};

export default Index;
