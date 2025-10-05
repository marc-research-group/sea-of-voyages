interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  layer: "background" | "foreground";
}

export class ParticleSystem {
  particles: Particle[] = [];

  createCannonFire(x: number, y: number, angle: number) {
    for (let i = 0; i < 10; i++) {
      const speed = 50 + Math.random() * 100;
      const spread = 0.5;
      const particleAngle = angle + (Math.random() - 0.5) * spread;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(particleAngle) * speed,
        vy: Math.sin(particleAngle) * speed,
        life: 0,
        maxLife: 0.3 + Math.random() * 0.3,
        size: 2 + Math.random() * 3,
        color: Math.random() > 0.5 ? "#FFA500" : "#FFD700",
        layer: "foreground",
      });
    }
  }

  createSplash(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const speed = 50 + Math.random() * 50;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.5,
        size: 3 + Math.random() * 3,
        color: "#87CEEB",
        layer: "foreground",
      });
    }
  }

  createHit(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 30 + Math.random() * 70;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.4,
        size: 2 + Math.random() * 2,
        color: "#FF4444",
        layer: "foreground",
      });
    }
  }

  createExplosion(x: number, y: number) {
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        size: 3 + Math.random() * 5,
        color: ["#FF4444", "#FFA500", "#FFD700", "#666"][Math.floor(Math.random() * 4)],
        layer: "foreground",
      });
    }
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(p => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life += deltaTime;
      p.vx *= 0.95;
      p.vy *= 0.95;
      return p.life < p.maxLife;
    });
  }

  render(ctx: CanvasRenderingContext2D, layer: "background" | "foreground") {
    this.particles
      .filter(p => p.layer === layer)
      .forEach(p => {
        const alpha = 1 - (p.life / p.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });
  }
}
