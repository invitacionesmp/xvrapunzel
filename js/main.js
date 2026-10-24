(function(){
  'use strict';
  const C = window.CONFIG || {};
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];

  /* ---------- Nombre y textos desde config ---------- */
  $$('.nombre').forEach(n=>n.textContent=C.nombre);
  $$('.xv').forEach(n=>n.textContent=C.subtitulo);
  document.title = C.subtitulo + ' · ' + C.nombre;
  $('#btnMapa').href = C.mapaUrl;

  /* ---------- Lámparas flotantes (img/linterna.png) ---------- */
  function crearLampara(caja,{min,max,op,lejos}){
    const l=document.createElement('div'); l.className='lantern'+(lejos?' lejos':'');
    const s=min+Math.random()*(max-min);
    l.style.cssText=`--s:${s}px;--t:${14+Math.random()*14}s;--d:${-Math.random()*26}s;--g:${-Math.random()*2}s;--x:${(Math.random()*90-45)}px;--o:${op};left:${Math.random()*92}%`;
    l.innerHTML='<i class="halo"></i><img src="img/linterna.png" alt="">';
    caja.appendChild(l);
  }
  const total=C.lanternas||14;
  for(let i=0;i<total;i++) crearLampara($('#lanternas'),{min:22,max:70,op:.95,lejos:i%3===0});
  for(let i=0;i<Math.max(5,Math.round(total/3));i++) crearLampara($('#lanternas-frente'),{min:20,max:44,op:.9});

  /* ---------- Destellos (canvas) ---------- */
  const cv=$('#destellos'), cx=cv.getContext('2d'); let W,H,parts=[];
  function medir(){ const r=devicePixelRatio||1; W=cv.width=innerWidth*r; H=cv.height=innerHeight*r; }
  addEventListener('resize',medir); medir();
  function nuevo(x,y,burst){
    const r=devicePixelRatio||1;
    return {x:x??Math.random()*W, y:y??Math.random()*H, r:(Math.random()*1.8+.6)*r,
      a:Math.random(), da:(Math.random()*.02+.006)*(Math.random()<.5?-1:1),
      vx:burst?(Math.random()-.5)*6*r:(Math.random()-.5)*.25*r, vy:burst?(Math.random()-.5)*6*r:-(Math.random()*.35+.05)*r, vida:burst?70:Infinity};
  }
  for(let i=0;i<90;i++) parts.push(nuevo());
  (function loop(){
    cx.clearRect(0,0,W,H);
    parts=parts.filter(p=>p.vida>0);
    for(const p of parts){
      p.x+=p.vx; p.y+=p.vy; p.a+=p.da; if(p.a>1||p.a<.1) p.da*=-1; p.vida--;
      if(p.vida===Infinity){ if(p.y<-5) p.y=H+5; if(p.x<-5) p.x=W+5; if(p.x>W+5) p.x=-5; }
      else { p.vx*=.97; p.vy*=.97; }
      cx.globalAlpha=Math.max(0,Math.min(1,p.a)); cx.fillStyle='#ffe9a8';
      cx.shadowColor='#ffd36b'; cx.shadowBlur=8; cx.beginPath(); cx.arc(p.x,p.y,p.r,0,6.283); cx.fill();
    }
    requestAnimationFrame(loop);
  })();
  const explosion=(x,y,n=60)=>{ for(let i=0;i<n;i++) parts.push(nuevo(x*(devicePixelRatio||1),y*(devicePixelRatio||1),true)); };

  /* ---------- Ripple en botones ---------- */
  document.addEventListener('click',e=>{
    const b=e.target.closest('.btn'); if(!b) return;
    const r=b.getBoundingClientRect(), d=Math.max(r.width,r.height), s=document.createElement('span');
    s.className='ripple'; s.style.cssText=`width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
    b.appendChild(s); setTimeout(()=>s.remove(),700);
  });

  /* ---------- Música ---------- */
  const audio=$('#audio'), btnM=$('#btnMusica');
  audio.src=C.musica; audio.volume=C.volumen??.6;
  btnM.addEventListener('click',()=>{
    if(audio.paused){ audio.play(); btnM.classList.remove('pausa'); }
    else { audio.pause(); btnM.classList.add('pausa'); }
  });

  /* ---------- Abrir el libro ---------- */
  const libro=$('#libro'), intro=$('#intro');
  $('#btnAbrir').addEventListener('click',e=>{
    e.currentTarget.style.pointerEvents='none';
    audio.play().catch(()=>{}); btnM.hidden=false;
    libro.classList.add('abierto');
    const r=libro.getBoundingClientRect(); explosion(r.left+r.width/2,r.top+r.height/2,90);
    setTimeout(()=>{ intro.classList.add('fuera'); document.body.classList.remove('bloqueado'); document.body.classList.add('abierto'); mariposaVuelo(); },1700);
    setTimeout(()=>intro.remove(),3300);
  });
  function mariposaVuelo(){
    const m=document.createElement('div'); m.className='mariposa vuelo'; document.body.appendChild(m);
    m.style.left='-60px'; m.style.top='70vh';
    m.animate([
      {transform:'translate(0,0) scale(1.4) rotate(15deg)',opacity:1},
      {transform:`translate(${innerWidth*.35}px,-22vh) scale(1.5) rotate(-10deg)`,opacity:1,offset:.4},
      {transform:`translate(${innerWidth*.7}px,-6vh) scale(1.3) rotate(12deg)`,opacity:1,offset:.7},
      {transform:`translate(${innerWidth+80}px,-55vh) scale(1) rotate(-6deg)`,opacity:0}
    ],{duration:6500,easing:'ease-in-out'}).onfinish=()=>m.remove();
  }

  /* ---------- Revelar al scroll ---------- */
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); io.unobserve(e.target);} }),{threshold:.2});
  $$('.rev').forEach(el=>io.observe(el));

  /* ---------- Cuenta regresiva ---------- */
  const meta=new Date(C.fecha);
  const dias=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  $('#diaSemana').textContent=dias[meta.getDay()]; $('#diaNum').textContent=meta.getDate();
  $('#mesAnio').textContent=meses[meta.getMonth()]+' '+meta.getFullYear();
  const ids=['cd-d','cd-h','cd-m','cd-s'], previo=[];
  function tic(){
    let t=Math.max(0,meta-new Date())/1000;
    const v=[Math.floor(t/86400),Math.floor(t%86400/3600),Math.floor(t%3600/60),Math.floor(t%60)];
    v.forEach((n,i)=>{ const el=$('#'+ids[i]), s=String(n).padStart(2,'0');
      if(previo[i]!==s){ el.textContent=s; el.classList.remove('tic'); void el.offsetWidth; el.classList.add('tic'); previo[i]=s; } });
  }
  tic(); setInterval(tic,1000);

  /* ---------- Carrusel ---------- */
  const pista=$('#pista'), puntos=$('#puntos'), n=pista.children.length; let idx=0, auto;
  for(let i=0;i<n;i++){ puntos.appendChild(document.createElement('i')); }
  const marcar=()=>{ idx=Math.round(pista.scrollLeft/pista.clientWidth); [...puntos.children].forEach((p,i)=>p.classList.toggle('on',i===idx)); };
  pista.addEventListener('scroll',marcar,{passive:true}); marcar();
  const ir=i=>pista.scrollTo({left:i*pista.clientWidth,behavior:'smooth'});
  const iniciar=()=>{ clearInterval(auto); auto=setInterval(()=>ir((idx+1)%n),3800); };
  ['touchstart','mousedown'].forEach(ev=>pista.addEventListener(ev,()=>clearInterval(auto),{passive:true}));
  ['touchend','mouseup'].forEach(ev=>pista.addEventListener(ev,iniciar,{passive:true}));
  iniciar();

  /* ---------- Parallax suave ---------- */
  const par=$('.par-img'), sec=$('.foto-par');
  addEventListener('scroll',()=>{
    const r=sec.getBoundingClientRect();
    if(r.bottom<0||r.top>innerHeight) return;
    par.style.transform=`translateY(${(r.top-innerHeight/2)*-.18}px)`;
  },{passive:true});

  /* ---------- Confirmación por WhatsApp ---------- */
  $('#btnConfirmar').addEventListener('click',()=>{
    const nom=$('#cfNombre').value.trim(), per=$('#cfPersonas').value;
    let msg=C.mensajeWhatsapp+per+(per==='1'?' persona':' personas');
    if(nom) msg+=' · Nombre: '+nom;
    window.open('https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent(msg),'_blank');
  });
})();
