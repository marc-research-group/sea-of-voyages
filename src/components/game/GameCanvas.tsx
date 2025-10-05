import { useEffect, useRef, useState } from "react";
import { Ship } from "@/lib/game/Ship";
import { Enemy } from "@/lib/game/Enemy";
import { World } from "@/lib/game/World";
import { Projectile } from "@/lib/game/Projectile";
import { ParticleSystem } from "@/lib/game/ParticleSystem";

import { Port } from "@/lib/game/Port";

interface GameCanvasProps {
  onScoreChange: (score: number) => void;
  onHealthChange: (health: number) => void;
  onGoldChange: (gold: number) => void;
  onCargoChange: (cargo: { [key: string]: number }) => void;
  onNearPort: (port: Port | null) => void;
  goldAmount: number;
}

export const GameCanvas = ({ 
  onScoreChange, 
  onHealthChange, 
  onGoldChange, 
  onCargoChange,
  onNearPort,
  goldAmount
}: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Game state
    const world = new World(canvas.width * 4, canvas.height * 4);
    const player = new Ship(canvas.width * 2, canvas.height * 2, true);
    const enemies: Enemy[] = [];
    const projectiles: Projectile[] = [];
    const particles = new ParticleSystem();
    
    let score = 0;
    let cargo: { [key: string]: number } = {};
    let lastEnemySpawn = 0;
    const enemySpawnInterval = 5000;
    const tradingRange = 120;

    // Camera
    let cameraX = player.x - canvas.width / 2;
    let cameraY = player.y - canvas.height / 2;

    // Input handling
    const keys: { [key: string]: boolean } = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;
      
      if (e.key === " ") {
        e.preventDefault();
        player.fireCannons(projectiles, particles);
      }
      
      if (e.key === "Control") {
        e.preventDefault();
        if (e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
          player.fireLeftCannons(projectiles, particles);
        } else if (e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
          player.fireRightCannons(projectiles, particles);
        }
      }
      
      if (e.key.toLowerCase() === "p") {
        setIsPaused(prev => !prev);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Spawn initial enemies away from ports
    for (let i = 0; i < 3; i++) {
      let attempts = 0;
      let spawned = false;
      
      while (!spawned && attempts < 10) {
        const angle = (Math.PI * 2 * i) / 3 + (Math.random() - 0.5) * 0.5;
        const distance = 500 + Math.random() * 200;
        const x = player.x + Math.cos(angle) * distance;
        const y = player.y + Math.sin(angle) * distance;
        
        // Check if far from ports
        if (!world.isNearPort(x, y, 300)) {
          enemies.push(new Enemy(x, y));
          spawned = true;
        }
        attempts++;
      }
    }

    // Game loop
    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isPaused) {
        // Update player input
        if (keys["w"] || keys["arrowup"]) player.accelerate();
        if (keys["s"] || keys["arrowdown"]) player.decelerate();
        if (keys["a"] || keys["arrowleft"]) player.turnLeft();
        if (keys["d"] || keys["arrowright"]) player.turnRight();

        // Update game objects
        player.update(deltaTime, world);
        particles.update(deltaTime);

        enemies.forEach((enemy, index) => {
          enemy.updateAI(deltaTime, player, projectiles, particles, world);
          
          if (enemy.health <= 0) {
            enemies.splice(index, 1);
            score += 100;
            const newGold = goldAmount + 50;
            onScoreChange(score);
            onGoldChange(newGold);
            particles.createExplosion(enemy.x, enemy.y);
          }
        });

        projectiles.forEach((proj, index) => {
          proj.update(deltaTime);
          
          if (proj.isExpired()) {
            projectiles.splice(index, 1);
            return;
          }

          // Check collision with player
          if (!proj.fromPlayer && proj.checkCollision(player.x, player.y, player.size)) {
            player.takeDamage(10);
            onHealthChange(player.health);
            projectiles.splice(index, 1);
            particles.createSplash(proj.x, proj.y);
          }

          // Check collision with enemies
          if (proj.fromPlayer) {
            enemies.forEach((enemy) => {
              if (proj.checkCollision(enemy.x, enemy.y, enemy.size)) {
                enemy.takeDamage(25);
                projectiles.splice(index, 1);
                particles.createHit(proj.x, proj.y);
              }
            });
          }
        });

        // Spawn new enemies away from ports
        if (currentTime - lastEnemySpawn > enemySpawnInterval && enemies.length < 8) {
          let attempts = 0;
          let spawned = false;
          
          while (!spawned && attempts < 20) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 600 + Math.random() * 200;
            const x = player.x + Math.cos(angle) * distance;
            const y = player.y + Math.sin(angle) * distance;
            
            // Check if far from ports
            if (!world.isNearPort(x, y, 300)) {
              enemies.push(new Enemy(x, y));
              spawned = true;
              lastEnemySpawn = currentTime;
            }
            attempts++;
          }
          
          if (!spawned) {
            lastEnemySpawn = currentTime; // Try again next interval
          }
        }

        // Check for nearby port
        const nearPort = world.findNearestPort(player.x, player.y, tradingRange);
        onNearPort(nearPort);

        // Update cargo callback
        onCargoChange(cargo);

        // Update camera (smooth follow)
        cameraX += (player.x - canvas.width / 2 - cameraX) * 0.1;
        cameraY += (player.y - canvas.height / 2 - cameraY) * 0.1;
      }

      // Render
      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // Draw ocean
      world.render(ctx, cameraX, cameraY, canvas.width, canvas.height);

      // Draw particles (background layer)
      particles.render(ctx, "background");

      // Draw projectiles
      projectiles.forEach(proj => proj.render(ctx));

      // Draw ships
      enemies.forEach(enemy => enemy.render(ctx));
      player.render(ctx);

      // Draw particles (foreground layer)
      particles.render(ctx, "foreground");

      ctx.restore();

      // Draw UI overlay (not affected by camera)
      if (isPaused) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#F4E4C1";
        ctx.font = "48px serif";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
        ctx.font = "24px serif";
        ctx.fillText("Press P to resume", canvas.width / 2, canvas.height / 2 + 50);
      }

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPaused, onScoreChange, onHealthChange, onGoldChange, onCargoChange, onNearPort, goldAmount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "hsl(var(--ocean-deep))" }}
    />
  );
};
