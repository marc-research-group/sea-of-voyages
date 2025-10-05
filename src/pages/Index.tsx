import { useState, useEffect } from "react";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/game/GameHUD";
import { TradingDialog } from "@/components/game/TradingDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Anchor } from "lucide-react";
import { Port } from "@/lib/game/Port";

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [gold, setGold] = useState(100);
  const [cargo, setCargo] = useState<{ [key: string]: number }>({});
  const [nearPort, setNearPort] = useState<Port | null>(null);
  const [tradingPort, setTradingPort] = useState<Port | null>(null);
  const cargoCapacity = 50;

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
                  <span>Fire broadsides with SPACE, or use Left/Right CTRL for individual sides</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">⚔️</span>
                  <span>Defeat enemy ships to earn gold and increase your score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">🏝️</span>
                  <span>Visit ports to buy and sell goods - trade smart to maximize profit!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">📦</span>
                  <span>Manage your cargo capacity and watch out for enemy ships near trading routes</span>
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
              Position your ship to bring your cannons to bear. Trade goods between ports for profit!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const handleTrade = (goodName: string, quantity: number, isBuying: boolean) => {
    if (!tradingPort) return;

    if (isBuying) {
      const result = tradingPort.buyGood(goodName, quantity);
      if (result.success) {
        setGold(gold - result.cost);
        setCargo({ ...cargo, [goodName]: (cargo[goodName] || 0) + quantity });
      }
    } else {
      const result = tradingPort.sellGood(goodName, quantity);
      if (result.success) {
        setGold(gold + result.revenue);
        const newCargo = { ...cargo };
        newCargo[goodName] = (newCargo[goodName] || 0) - quantity;
        if (newCargo[goodName] <= 0) delete newCargo[goodName];
        setCargo(newCargo);
      }
    }
  };

  const openTrading = () => {
    if (nearPort) {
      setTradingPort(nearPort);
    }
  };

  // Handle T key for trading
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t" && nearPort && !tradingPort) {
        openTrading();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [nearPort, tradingPort]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <GameCanvas 
        onScoreChange={setScore}
        onHealthChange={setHealth}
        onGoldChange={setGold}
        onCargoChange={setCargo}
        onNearPort={setNearPort}
        goldAmount={gold}
      />
      <GameHUD 
        health={health} 
        score={score} 
        gold={gold}
        cargo={cargo}
        cargoCapacity={cargoCapacity}
        nearPort={nearPort}
        onTrade={openTrading}
      />
      <TradingDialog
        port={tradingPort}
        playerGold={gold}
        playerCargo={cargo}
        cargoCapacity={cargoCapacity}
        onTrade={handleTrade}
        onClose={() => setTradingPort(null)}
      />
    </div>
  );
};

export default Index;
