/* Tiny canvas confetti. No dependencies, no persistent animation loop. */
window.Celebrate = (() => {
  let canvas, ctx, pieces = [], frame = 0, running = false;
  const colors = ['#f3c969', '#f4a9bb', '#d2c3ef', '#fff5dd', '#e5989e'];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .055; p.rotation += p.spin; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*.65); ctx.restore(); });
    pieces = pieces.filter(p => p.y < innerHeight + 20);
    if (pieces.length && ++frame < 230) requestAnimationFrame(tick); else { running = false; canvas.remove(); window.removeEventListener('resize', resize); }
  }
  function burst(amount = 95) {
    if (reduced()) return;
    if (running) { pieces = []; canvas.remove(); window.removeEventListener('resize', resize); }
    canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden','true'); Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'205'}); document.body.append(canvas); ctx = canvas.getContext('2d'); resize(); window.addEventListener('resize',resize); frame=0; running=true;
    pieces = Array.from({length:amount}, (_,i) => ({x:innerWidth*(.2+Math.random()*.6),y:-Math.random()*innerHeight*.45,vx:(Math.random()-.5)*3.7,vy:1.6+Math.random()*3.7,size:4+Math.random()*7,color:colors[i%colors.length],rotation:Math.random()*6,spin:(Math.random()-.5)*.15})); requestAnimationFrame(tick);
  }
  return { burst };
})();
