
// Countdown to Nov 22, 2025
(function(){
  const target = new Date('2025-11-22T00:00:00').getTime();
  function update(){
    const now = Date.now(); let diff = target - now; if(diff<0) diff=0;
    const days = Math.floor(diff/(1000*60*60*24));
    const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
    const mins = Math.floor((diff%(1000*60*60))/(1000*60));
    const secs = Math.floor((diff%(1000*60))/1000);
    const d = document.getElementById('cd-days'); if(d) d.textContent=String(days).padStart(2,'0');
    const h = document.getElementById('cd-hours'); if(h) h.textContent=String(hours).padStart(2,'0');
    const m = document.getElementById('cd-mins'); if(m) m.textContent=String(mins).padStart(2,'0');
    const s = document.getElementById('cd-secs'); if(s) s.textContent=String(secs).padStart(2,'0');
    if(target - now <= 0){
      const cd = document.getElementById('countdown'); if(cd) cd.innerHTML = '<div class=\"countbox\">Osmosis 2025 — LIVE</div>';
      launchConfetti();
    }
  }
  update(); setInterval(update,1000);

  // Confetti (simple DOM pieces)
  window.launchConfetti = function(){
    for(let i=0;i<40;i++){
      const el = document.createElement('div');
      el.style.position='fixed'; el.style.zIndex=9999; el.style.width='8px'; el.style.height='12px';
      el.style.left = Math.random()*100+'%'; el.style.top = '-10%';
      el.style.background = i%2? 'rgba(0,255,119,0.95)':'rgba(183,255,217,0.95)';
      el.style.transform = 'rotate('+ (Math.random()*360) +'deg)';
      el.style.transition = 'transform 2.5s linear, top 2.5s linear, opacity 2.5s linear';
      document.body.appendChild(el);
      setTimeout(()=>{ el.style.top = (80+Math.random()*20)+'%'; el.style.opacity=0; el.style.transform+=' translateY(200px)'; }, 50+i*20);
      setTimeout(()=> el.remove(), 3000+i*50);
    }
  };
})();

// Canvas animated background
(function(){
  const canvas = document.getElementById('bgCanvas'); if(!canvas) return;
  const ctx = canvas.getContext('2d', {alpha:true});
  let w = canvas.width = innerWidth, h = canvas.height = innerHeight;
  window.addEventListener('resize', ()=>{ w = canvas.width = innerWidth; h = canvas.height = innerHeight; });
  let t=0;
  const particles = []; const PCOUNT = Math.max(60, Math.floor((w*h)/90000));
  function rand(a,b){return Math.random()*(b-a)+a;}
  for(let i=0;i<PCOUNT;i++) particles.push({x:Math.random()*w,y:Math.random()*h,vx:rand(-0.2,0.2),vy:rand(0.02,0.25),r:rand(0.6,2.8),life:rand(60,360),alpha:rand(0.12,0.6)});
  function draw(){
    t+=0.0075;
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(4,6,12,1)'); g.addColorStop(1,'rgba(2,6,10,1)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    // vignette + soft glow
    const vg = ctx.createRadialGradient(w*0.5, h*0.12, Math.max(50,w*0.05), w*0.5, h*0.5, Math.max(w,h));
    vg.addColorStop(0,'rgba(0,255,119,0.02)'); vg.addColorStop(0.2,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy; p.life--;
      if(p.x < -50) p.x = w+50; if(p.x > w+50) p.x=-50; if(p.y>h+50) p.y=-50;
      if(p.life<=0){ p.x=Math.random()*w; p.y=-10; p.vx=rand(-0.15,0.15); p.vy=rand(0.05,0.25); p.r=rand(0.6,2.8); p.life=rand(60,360); p.alpha=rand(0.12,0.6); }
      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8);
      grad.addColorStop(0, `rgba(0,255,119,${p.alpha})`); grad.addColorStop(1,'rgba(0,255,119,0)');
      ctx.beginPath(); ctx.fillStyle = grad; ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
