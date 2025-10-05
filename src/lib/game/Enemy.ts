import { Ship } from "./Ship";
import { Projectile } from "./Projectile";
import { ParticleSystem } from "./ParticleSystem";
import { World } from "./World";

export class Enemy extends Ship {
  attackRange: number = 300;
  attackCooldown: number = 0;
  attackInterval: number = 3;
  
  constructor(x: number, y: number) {
    super(x, y, false);
    this.maxSpeed = 120;
    this.health = 75;
    this.maxHealth = 75;
  }

  updateAI(
    deltaTime: number,
    player: Ship,
    projectiles: Projectile[],
    particles: ParticleSystem,
    world: World
  ) {
    // Calculate distance and angle to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const targetAngle = Math.atan2(dy, dx);

    // AI behavior
    if (distance < this.attackRange) {
      // Turn to face broadside to player
      const broadsideAngle1 = targetAngle + Math.PI / 2;
      const broadsideAngle2 = targetAngle - Math.PI / 2;
      
      // Choose closest broadside angle
      const angleDiff1 = this.normalizeAngle(broadsideAngle1 - this.angle);
      const angleDiff2 = this.normalizeAngle(broadsideAngle2 - this.angle);
      const targetBroadside = Math.abs(angleDiff1) < Math.abs(angleDiff2) ? broadsideAngle1 : broadsideAngle2;
      
      const angleDiff = this.normalizeAngle(targetBroadside - this.angle);
      
      if (Math.abs(angleDiff) > 0.1) {
        if (angleDiff > 0) {
          this.turnRight();
        } else {
          this.turnLeft();
        }
      }

      // Maintain distance
      if (distance < this.attackRange * 0.7) {
        this.decelerate();
      } else if (distance > this.attackRange * 0.9) {
        this.accelerate();
      }

      // Fire cannons
      this.attackCooldown -= deltaTime;
      if (this.attackCooldown <= 0 && Math.abs(angleDiff) < 0.5) {
        this.fireCannons(projectiles, particles);
        this.attackCooldown = this.attackInterval;
      }
    } else {
      // Chase player
      const angleDiff = this.normalizeAngle(targetAngle - this.angle);
      
      if (Math.abs(angleDiff) > 0.1) {
        if (angleDiff > 0) {
          this.turnRight();
        } else {
          this.turnLeft();
        }
      }
      
      if (Math.abs(angleDiff) < 1) {
        this.accelerate();
      }
    }

    super.update(deltaTime, world);
  }

  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }
}
