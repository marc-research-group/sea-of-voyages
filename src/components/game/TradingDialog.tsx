import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Port, TradeGood } from "@/lib/game/Port";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, TrendingUp, Package } from "lucide-react";
import { toast } from "sonner";

interface TradingDialogProps {
  port: Port | null;
  playerGold: number;
  playerCargo: { [key: string]: number };
  cargoCapacity: number;
  onTrade: (goodName: string, quantity: number, isBuying: boolean) => void;
  onClose: () => void;
}

export const TradingDialog = ({
  port,
  playerGold,
  playerCargo,
  cargoCapacity,
  onTrade,
  onClose,
}: TradingDialogProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  if (!port) return null;

  const totalCargo = Object.values(playerCargo).reduce((sum, qty) => sum + qty, 0);
  const cargoSpace = cargoCapacity - totalCargo;

  const handleBuy = (good: TradeGood) => {
    const quantity = quantities[good.name] || 1;
    const cost = good.buyPrice * quantity;

    if (cost > playerGold) {
      toast.error("Not enough gold!");
      return;
    }

    if (quantity > good.stock) {
      toast.error("Port doesn't have enough stock!");
      return;
    }

    if (quantity > cargoSpace) {
      toast.error("Not enough cargo space!");
      return;
    }

    onTrade(good.name, quantity, true);
    setQuantities({ ...quantities, [good.name]: 1 });
    toast.success(`Bought ${quantity} ${good.name} for ${cost} gold`);
  };

  const handleSell = (good: TradeGood) => {
    const quantity = quantities[good.name] || 1;
    const playerHas = playerCargo[good.name] || 0;

    if (quantity > playerHas) {
      toast.error(`You only have ${playerHas} ${good.name}!`);
      return;
    }

    onTrade(good.name, quantity, false);
    setQuantities({ ...quantities, [good.name]: 1 });
    toast.success(`Sold ${quantity} ${good.name} for ${good.sellPrice * quantity} gold`);
  };

  return (
    <Dialog open={!!port} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-accent/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-accent flex items-center gap-2">
            <Package className="w-6 h-6" />
            {port.name} - Trading Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Player stats */}
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-accent" />
              <span className="text-sm">Cargo: {totalCargo}/{cargoCapacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-bold">Gold: {playerGold}</span>
            </div>
          </div>

          <Separator />

          {/* Goods list */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {port.goods.map((good) => {
                const playerHas = playerCargo[good.name] || 0;
                const quantity = quantities[good.name] || 1;

                return (
                  <div
                    key={good.name}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-serif text-lg text-foreground">{good.name}</h4>
                        <p className="text-xs text-muted-foreground">Stock: {good.stock}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground/80">
                          Buy: <span className="text-accent font-bold">{good.buyPrice}g</span>
                        </div>
                        <div className="text-sm text-foreground/80">
                          Sell: <span className="text-secondary font-bold">{good.sellPrice}g</span>
                        </div>
                      </div>
                    </div>

                    {playerHas > 0 && (
                      <div className="text-xs text-accent mb-2">You have: {playerHas}</div>
                    )}

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [good.name]: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                        className="w-20 h-8 text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleBuy(good)}
                        disabled={good.stock < quantity || good.buyPrice * quantity > playerGold}
                        className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Buy ({good.buyPrice * quantity}g)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSell(good)}
                        disabled={playerHas < quantity}
                        className="flex-1"
                      >
                        Sell (+{good.sellPrice * quantity}g)
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
