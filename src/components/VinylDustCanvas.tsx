import React, { useEffect, useRef } from 'react';

interface VinylDustCanvasProps {
  isPlaying: boolean;
  speedRPM: 33 | 45;
  crackleEnabled: boolean;
}

interface DustParticle {
  angle: number;       // Angle in radians
  distance: number;    // Normalized distance from center (0 to 1)
  size: number;        // Radius in px
  opacity: number;     // Base alpha
  glowFreq: number;    // Oscillation rate for subtle shimmer
  glowOffset: number;  // Phase offset
  colorType: 'dust' | 'fuzz' | 'gold';
}

interface HairlineScratch {
  startAngle: number;
  lengthAngle: number;
  radius: number;
  length: number;
  curve: number;
  opacity: number;
  life: number;        // Transient scratch life
  maxLife: number;
}

export const VinylDustCanvas: React.FC<VinylDustCanvasProps> = ({
  isPlaying,
  speedRPM,
  crackleEnabled
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let radius = 0;

    const updateDimensions = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      centerX = width / 2;
      centerY = height / 2;
      radius = Math.min(centerX, centerY);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Generate persistent dust motes distributed across the sound grooves
    const DUST_COUNT = 45;
    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < DUST_COUNT; i++) {
      // Favor outer and middle groove area (avoid direct center label)
      const dist = 0.38 + Math.random() * 0.58;
      const typeRand = Math.random();
      dustParticles.push({
        angle: Math.random() * Math.PI * 2,
        distance: dist,
        size: 0.5 + Math.random() * 1.3,
        opacity: 0.15 + Math.random() * 0.45,
        glowFreq: 0.8 + Math.random() * 2.2,
        glowOffset: Math.random() * Math.PI * 2,
        colorType: typeRand > 0.8 ? 'gold' : typeRand > 0.4 ? 'dust' : 'fuzz'
      });
    }

    // Dynamic hairline scratches
    const scratches: HairlineScratch[] = [];
    const MAX_SCRATCHES = 8;

    // Seed initial persistent surface scratches
    for (let i = 0; i < 4; i++) {
      scratches.push({
        startAngle: Math.random() * Math.PI * 2,
        lengthAngle: (Math.random() - 0.5) * 0.35,
        radius: 0.45 + Math.random() * 0.48,
        length: 8 + Math.random() * 26,
        curve: (Math.random() - 0.5) * 12,
        opacity: 0.12 + Math.random() * 0.22,
        life: 1000,
        maxLife: 1000
      });
    }

    let globalRotation = 0;
    let lastTime = performance.now();
    let transientTimer = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update rotation speed according to RPM
      if (isPlaying) {
        // 33.3 RPM = ~3.49 rad/s, 45 RPM = ~4.71 rad/s
        const radPerSec = speedRPM === 45 ? 4.71 : 3.49;
        globalRotation = (globalRotation + radPerSec * dt) % (Math.PI * 2);
      } else {
        // Very slow ambient drift when stopped
        globalRotation = (globalRotation + 0.05 * dt) % (Math.PI * 2);
      }

      // Random transient scratch / pop spark trigger (especially if crackle is active)
      transientTimer += dt;
      if (crackleEnabled && isPlaying && transientTimer > 0.25) {
        if (Math.random() < 0.35 && scratches.length < MAX_SCRATCHES) {
          scratches.push({
            startAngle: Math.random() * Math.PI * 2,
            lengthAngle: (Math.random() - 0.5) * 0.4,
            radius: 0.42 + Math.random() * 0.52,
            length: 12 + Math.random() * 32,
            curve: (Math.random() - 0.5) * 16,
            opacity: 0.25 + Math.random() * 0.35,
            life: 0.12 + Math.random() * 0.2,
            maxLife: 0.3
          });
        }
        transientTimer = 0;
      }

      // Clear previous frame
      ctx.clearRect(0, 0, width, height);

      // Render Scratch Artifacts
      for (let i = scratches.length - 1; i >= 0; i--) {
        const scratch = scratches[i];
        
        // Age transient scratches
        if (scratch.maxLife < 100) {
          scratch.life -= dt;
          if (scratch.life <= 0) {
            scratches.splice(i, 1);
            continue;
          }
        }

        const alphaMultiplier = scratch.maxLife < 100 
          ? (scratch.life / scratch.maxLife) 
          : 1;

        const currentAngle = scratch.startAngle + (isPlaying ? globalRotation : 0);
        const r = scratch.radius * radius;
        const x1 = centerX + Math.cos(currentAngle) * r;
        const y1 = centerY + Math.sin(currentAngle) * r;

        // Tangent/radial scratch vector
        const tangentAngle = currentAngle + Math.PI / 2 + scratch.lengthAngle;
        const x2 = x1 + Math.cos(tangentAngle) * scratch.length;
        const y2 = y1 + Math.sin(tangentAngle) * scratch.length;

        // Control point for slight curvature
        const midX = (x1 + x2) / 2 + Math.cos(currentAngle) * scratch.curve;
        const midY = (y1 + y2) / 2 + Math.sin(currentAngle) * scratch.curve;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = `rgba(255, 238, 195, ${scratch.opacity * alphaMultiplier})`;
        ctx.lineWidth = 0.65;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
        ctx.shadowBlur = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Render Dust Particles & Fiber Fuzz
      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];
        const currentAngle = p.angle + globalRotation;
        const distPx = p.distance * radius;

        const x = centerX + Math.cos(currentAngle) * distPx;
        const y = centerY + Math.sin(currentAngle) * distPx;

        // Calculate periodic warm glimmer
        const shimmer = 0.5 + 0.5 * Math.sin(now * 0.003 * p.glowFreq + p.glowOffset);
        const effectiveAlpha = p.opacity * (0.6 + 0.4 * shimmer);

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        if (p.colorType === 'gold') {
          ctx.fillStyle = `rgba(254, 240, 138, ${effectiveAlpha * 1.2})`;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
          ctx.shadowBlur = 2.5;
        } else if (p.colorType === 'fuzz') {
          ctx.fillStyle = `rgba(243, 232, 215, ${effectiveAlpha * 0.9})`;
          ctx.shadowColor = 'rgba(217, 119, 6, 0.3)';
          ctx.shadowBlur = 1;
        } else {
          ctx.fillStyle = `rgba(225, 205, 175, ${effectiveAlpha})`;
        }

        ctx.fill();

        // Tiny fiber halo for slightly larger dust specks
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.moveTo(x - p.size * 1.4, y - p.size * 0.4);
          ctx.lineTo(x + p.size * 1.4, y + p.size * 0.4);
          ctx.strokeStyle = `rgba(255, 245, 225, ${effectiveAlpha * 0.45})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, speedRPM, crackleEnabled]);

  return (
    <canvas
      ref={canvasRef}
      id="vinyl-dust-overlay"
      className="absolute inset-0 w-full h-full rounded-full pointer-events-none mix-blend-screen z-10"
      style={{
        opacity: 0.92
      }}
    />
  );
};
