export interface TradeGood {
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
}

export class Port {
  x: number;
  y: number;
  size: number;
  name: string;
  goods: TradeGood[];
  
  constructor(x: number, y: number, size: number, index: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.name = this.generateName(index);
    this.goods = this.generateGoods();
  }

  private generateName(index: number): string {
    const names = [
      "Port Royal", "Nassau", "Tortuga", "Havana", "Kingston",
      "Bridgetown", "Charleston", "New Providence", "Port-au-Prince",
      "Cartagena", "Vera Cruz", "Panama", "Portobelo", "Maracaibo",
      "Saint Kitts", "Antigua", "Martinique", "Barbados", "Trinidad"
    ];
    return names[index % names.length];
  }

  private generateGoods(): TradeGood[] {
    const allGoods = [
      { name: "Rum", basePrice: 20 },
      { name: "Sugar", basePrice: 15 },
      { name: "Tobacco", basePrice: 25 },
      { name: "Cotton", basePrice: 18 },
      { name: "Spices", basePrice: 40 },
      { name: "Coffee", basePrice: 22 },
      { name: "Cocoa", basePrice: 30 },
      { name: "Silk", basePrice: 50 },
    ];

    // Each port has 3-5 random goods with varying prices
    const numGoods = 3 + Math.floor(Math.random() * 3);
    const shuffled = [...allGoods].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, numGoods).map(good => {
      const priceVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of base
      const buyPrice = Math.round(good.basePrice * priceVariation);
      const sellPrice = Math.round(buyPrice * 0.7); // You sell for 70% of buy price
      
      return {
        name: good.name,
        buyPrice,
        sellPrice,
        stock: 10 + Math.floor(Math.random() * 20),
      };
    });
  }

  distanceTo(x: number, y: number): number {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isInRange(x: number, y: number, range: number): boolean {
    return this.distanceTo(x, y) < this.size + range;
  }

  buyGood(goodName: string, quantity: number): { cost: number; success: boolean } {
    const good = this.goods.find(g => g.name === goodName);
    if (!good || good.stock < quantity) {
      return { cost: 0, success: false };
    }

    const cost = good.buyPrice * quantity;
    good.stock -= quantity;
    return { cost, success: true };
  }

  sellGood(goodName: string, quantity: number): { revenue: number; success: boolean } {
    const good = this.goods.find(g => g.name === goodName);
    if (!good) {
      return { revenue: 0, success: false };
    }

    const revenue = good.sellPrice * quantity;
    good.stock += quantity;
    return { revenue, success: true };
  }
}
