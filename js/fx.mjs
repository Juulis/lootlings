export function burst(state, x, y, color) {
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    state.particles.push({
      x, y, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, life: 0.35, color,
    });
  }
}

export function tickParticles(state, dt) {
  state.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  });
  state.particles = state.particles.filter((p) => p.life > 0);
}

export function drawParticles(ctx, particles) {
  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life * 3);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, 4, 4);
    ctx.globalAlpha = 1;
  });
}
