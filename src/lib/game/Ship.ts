import { Projectile } from "./Projectile";
import { ParticleSystem } from "./ParticleSystem";
import { World } from "./World";

export class Ship {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  angle: number = 0;
  speed: number = 0;
  maxSpeed: number = 200;
  acceleration: number = 100;
  turnSpeed: number = 3;
  size: number = 30;
  health: number = 100;
  maxHealth: number = 100;
  isPlayer: boolean;
  cannonCooldown: number = 0;
  cannonCooldownTime: number = 1.5;
  
  constructor(x: number, y: number, isPlayer: boolean = false) {
    this.x = x;
    this.y = y;
    this.isPlayer = isPlayer;
  }

  accelerate() {
    this.speed = Math.min(this.speed + this.acceleration * 0.016, this.maxSpeed);
  }

  decelerate() {
    this.speed = Math.max(this.speed - this.acceleration * 0.016, -this.maxSpeed * 0.5);
  }

  turnLeft() {
    this.angle -= this.turnSpeed * 0.016;
  }

  turnRight() {
    this.angle += this.turnSpeed * 0.016;
  }

  update(deltaTime: number, world: World) {
    // Apply speed to velocity
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;

    // Update position
    const newX = this.x + this.vx * deltaTime;
    const newY = this.y + this.vy * deltaTime;

    // Check world boundaries and island collisions
    if (!world.checkCollision(newX, newY, this.size)) {
      this.x = newX;
      this.y = newY;
    } else {
      // Bounce back
      this.speed *= -0.5;
    }

    // Apply friction
    this.speed *= 0.98;

    // Update cooldown
    if (this.cannonCooldown > 0) {
      this.cannonCooldown -= deltaTime;
    }
  }

  fireCannons(projectiles: Projectile[], particles: ParticleSystem) {
    if (this.cannonCooldown > 0) return;

    // Fire from both sides
    this.fireLeftCannons(projectiles, particles);
    this.fireRightCannons(projectiles, particles);

    this.cannonCooldown = this.cannonCooldownTime;
  }

  fireLeftCannons(projectiles: Projectile[], particles: ParticleSystem) {
    if (this.cannonCooldown > 0) return;

    const leftAngle = this.angle - Math.PI / 2;
    const offset = 20;

    const leftX = this.x + Math.cos(leftAngle) * offset;
    const leftY = this.y + Math.sin(leftAngle) * offset;
    projectiles.push(new Projectile(leftX, leftY, leftAngle, this.isPlayer));
    particles.createCannonFire(leftX, leftY, leftAngle);

    this.cannonCooldown = this.cannonCooldownTime;
  }

  fireRightCannons(projectiles: Projectile[], particles: ParticleSystem) {
    if (this.cannonCooldown > 0) return;

    const rightAngle = this.angle + Math.PI / 2;
    const offset = 20;

    const rightX = this.x + Math.cos(rightAngle) * offset;
    const rightY = this.y + Math.sin(rightAngle) * offset;
    projectiles.push(new Projectile(rightX, rightY, rightAngle, this.isPlayer));
    particles.createCannonFire(rightX, rightY, rightAngle);

    this.cannonCooldown = this.cannonCooldownTime;
  }

  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Ship hull
    ctx.fillStyle = this.isPlayer ? "#8B4513" : "#4A4A4A";
    ctx.beginPath();
    ctx.moveTo(this.size, 0);
    ctx.lineTo(-this.size * 0.7, this.size * 0.5);
    ctx.lineTo(-this.size * 0.5, 0);
    ctx.lineTo(-this.size * 0.7, -this.size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = this.isPlayer ? "#654321" : "#2A2A2A";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cannons on sides
    ctx.fillStyle = "#1A1A1A";
    ctx.fillRect(-this.size * 0.3, this.size * 0.4, this.size * 0.4, 6);
    ctx.fillRect(-this.size * 0.3, -this.size * 0.4 - 6, this.size * 0.4, 6);

    // Sails (if player)
    if (this.isPlayer) {
      ctx.fillStyle = "#F4E4C1";
      ctx.fillRect(-this.size * 0.2, -this.size * 0.6, this.size * 0.6, this.size * 0.4);
    }

    ctx.restore();

    // Health bar
    if (!this.isPlayer || this.health < this.maxHealth) {
      const barWidth = this.size * 2;
      const barHeight = 6;
      const barX = this.x - barWidth / 2;
      const barY = this.y - this.size - 15;

      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      ctx.fillStyle = this.health > 50 ? "#4CAF50" : this.health > 25 ? "#FFC107" : "#F44336";
      ctx.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
      
      ctx.strokeStyle = "#F4E4C1";
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
  }
}
