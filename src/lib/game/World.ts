import { Port } from "./Port";

export class World {
  width: number;
  height: number;
  ports: Port[] = [];
  waveOffset: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.generatePorts();
  }

  generatePorts() {
    const portCount = 12;
    
    for (let i = 0; i < portCount; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 50 + Math.random() * 40;
      
      // Check if too close to center (spawn area)
      const dx = x - this.width / 2;
      const dy = y - this.height / 2;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      
      // Also check if too close to other ports
      const tooClose = this.ports.some(port => {
        const pdx = port.x - x;
        const pdy = port.y - y;
        return Math.sqrt(pdx * pdx + pdy * pdy) < 400;
      });
      
      if (distFromCenter > 300 && !tooClose) {
        this.ports.push(new Port(x, y, size, i));
      }
    }
  }

  checkCollision(x: number, y: number, shipSize: number): boolean {
    // Check world boundaries
    if (x < shipSize || x > this.width - shipSize || 
        y < shipSize || y > this.height - shipSize) {
      return true;
    }

    // Check port/island collisions
    for (const port of this.ports) {
      const dx = x - port.x;
      const dy = y - port.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < port.size + shipSize) {
        return true;
      }
    }

    return false;
  }

  findNearestPort(x: number, y: number, maxDistance: number): Port | null {
    let nearest: Port | null = null;
    let minDist = maxDistance;

    for (const port of this.ports) {
      const dist = port.distanceTo(x, y);
      if (dist < minDist) {
        nearest = port;
        minDist = dist;
      }
    }

    return nearest;
  }

  isNearPort(x: number, y: number, distance: number): boolean {
    return this.ports.some(port => port.distanceTo(x, y) < distance);
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

    // Draw ports/islands
    this.ports.forEach(port => {
      // Check if port is in view
      if (port.x + port.size < cameraX || port.x - port.size > cameraX + viewWidth ||
          port.y + port.size < cameraY || port.y - port.size > cameraY + viewHeight) {
        return;
      }

      // Island shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.arc(port.x + 5, port.y + 5, port.size, 0, Math.PI * 2);
      ctx.fill();

      // Island
      ctx.fillStyle = "hsl(40, 60%, 70%)";
      ctx.beginPath();
      ctx.arc(port.x, port.y, port.size, 0, Math.PI * 2);
      ctx.fill();

      // Island details (vegetation)
      ctx.fillStyle = "hsl(120, 40%, 40%)";
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5;
        const x = port.x + Math.cos(angle) * port.size * 0.4;
        const y = port.y + Math.sin(angle) * port.size * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, port.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Port buildings (dock)
      ctx.fillStyle = "hsl(30, 30%, 25%)";
      ctx.fillRect(port.x - 15, port.y - 10, 30, 20);
      ctx.strokeStyle = "hsl(30, 30%, 15%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(port.x - 15, port.y - 10, 30, 20);

      // Island outline
      ctx.strokeStyle = "hsl(35, 50%, 50%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(port.x, port.y, port.size, 0, Math.PI * 2);
      ctx.stroke();

      // Port name
      ctx.fillStyle = "hsl(45, 85%, 92%)";
      ctx.font = "14px serif";
      ctx.textAlign = "center";
      ctx.fillText(port.name, port.x, port.y - port.size - 10);
    });
  }
}
