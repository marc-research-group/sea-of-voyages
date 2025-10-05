interface Island {
  x: number;
  y: number;
  size: number;
}

export class World {
  width: number;
  height: number;
  islands: Island[] = [];
  waveOffset: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.generateIslands();
  }

  generateIslands() {
    const islandCount = 15;
    
    for (let i = 0; i < islandCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 40 + Math.random() * 60;
      
      // Check if too close to center (spawn area)
      const dx = x - this.width / 2;
      const dy = y - this.height / 2;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      
      if (distFromCenter > 200) {
        this.islands.push({ x, y, size });
      }
    }
  }

  checkCollision(x: number, y: number, shipSize: number): boolean {
    // Check world boundaries
    if (x < shipSize || x > this.width - shipSize || 
        y < shipSize || y > this.height - shipSize) {
      return true;
    }

    // Check island collisions
    for (const island of this.islands) {
      const dx = x - island.x;
      const dy = y - island.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < island.size + shipSize) {
        return true;
      }
    }

    return false;
  }

  render(ctx: CanvasRenderingContext2D, cameraX: number, cameraY: number, viewWidth: number, viewHeight: number) {
    this.waveOffset += 0.5;

    // Draw ocean gradient
    const gradient = ctx.createLinearGradient(0, cameraY, 0, cameraY + viewHeight);
    gradient.addColorStop(0, "hsl(200, 45%, 25%)");
    gradient.addColorStop(1, "hsl(210, 50%, 15%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(cameraX, cameraY, viewWidth, viewHeight);

    // Draw wave patterns
    ctx.strokeStyle = "rgba(100, 150, 200, 0.15)";
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const y = cameraY + (i * viewHeight / 20) + Math.sin(this.waveOffset * 0.01 + i) * 10;
      ctx.moveTo(cameraX, y);
      
      for (let x = 0; x < viewWidth; x += 20) {
        const waveY = y + Math.sin((this.waveOffset + x) * 0.02) * 3;
        ctx.lineTo(cameraX + x, waveY);
      }
      ctx.stroke();
    }

    // Draw islands
    this.islands.forEach(island => {
      // Check if island is in view
      if (island.x + island.size < cameraX || island.x - island.size > cameraX + viewWidth ||
          island.y + island.size < cameraY || island.y - island.size > cameraY + viewHeight) {
        return;
      }

      // Island shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(island.x + 5, island.y + 5, island.size, 0, Math.PI * 2);
      ctx.fill();

      // Island
      ctx.fillStyle = "hsl(40, 60%, 70%)";
      ctx.beginPath();
      ctx.arc(island.x, island.y, island.size, 0, Math.PI * 2);
      ctx.fill();

      // Island details (vegetation)
      ctx.fillStyle = "hsl(120, 40%, 40%)";
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const x = island.x + Math.cos(angle) * island.size * 0.4;
        const y = island.y + Math.sin(angle) * island.size * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, island.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Island outline
      ctx.strokeStyle = "hsl(35, 50%, 50%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(island.x, island.y, island.size, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}
