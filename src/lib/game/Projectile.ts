export class Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number = 300;
  size: number = 4;
  lifetime: number = 3;
  age: number = 0;
  fromPlayer: boolean;

  constructor(x: number, y: number, angle: number, fromPlayer: boolean = false) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.fromPlayer = fromPlayer;
  }

  update(deltaTime: number) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.age += deltaTime;
  }

  isExpired(): boolean {
    return this.age >= this.lifetime;
  }

  checkCollision(targetX: number, targetY: number, targetSize: number): boolean {
    const dx = this.x - targetX;
    const dy = this.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < targetSize;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fromPlayer ? "#FFD700" : "#FF4444";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.fromPlayer ? "#FFD700" : "#FF4444";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
