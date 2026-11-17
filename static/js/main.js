document.addEventListener('DOMContentLoaded',()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollTo=(id)=>document.getElementById(id)?.scrollIntoView({behavior:reduced?'instant':'smooth'});
  const envelope=document.getElementById('envelope-stage');
  document.getElementById('open-envelope').addEventListener('click',()=>{
    envelope.classList.add('is-open'); document.getElementById('open-envelope').hidden=true;
    const delay=reduced?0:660; setTimeout(()=>{document.getElementById('envelope-note').hidden=false;const r=envelope.getBoundingClientRect();window.StoryInteractions.heartBurst(r.left+r.width/2,r.top+90,['♡','✦','💗']);},delay);
  });
  function enterStory(target='vip'){
    document.body.classList.remove('story-locked');document.getElementById('welcome').hidden=true;
    const destination=document.getElementById(target)||document.getElementById('vip');
    destination.scrollIntoView({behavior:'instant'});
    const heading=destination.querySelector('h2');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
    document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in-view');});
  }
  document.getElementById('enter-story').addEventListener('click',()=>enterStory());
  document.querySelector('.skip-link').addEventListener('click',event=>{event.preventDefault();enterStory();});
  const linkedChapter=location.hash.slice(1);
  if(linkedChapter&&document.getElementById(linkedChapter)&&linkedChapter!=='welcome')enterStory(linkedChapter==='story'?'vip':linkedChapter);
  document.querySelectorAll('[data-go]').forEach(button=>button.addEventListener('click',()=>scrollTo(button.dataset.go)));
  document.getElementById('verdict-button').addEventListener('click',()=>{const box=document.getElementById('verdict');box.hidden=!box.hidden;document.getElementById('verdict-button').setAttribute('aria-expanded',String(!box.hidden));if(!box.hidden)box.scrollIntoView({behavior:reduced?'instant':'smooth',block:'nearest'});});
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}}),{rootMargin:'0px 0px -30px 0px',threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  const navLinks=[...document.querySelectorAll('.chapter-nav a')];
  const chapterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}}),{rootMargin:'-30% 0px -55% 0px'});
  document.querySelectorAll('main > section').forEach(section=>chapterObserver.observe(section));
  let scrollScheduled=false;window.addEventListener('scroll',()=>{if(scrollScheduled)return;scrollScheduled=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;document.getElementById('scroll-progress').style.width=`${max>0?scrollY/max*100:0}%`;scrollScheduled=false;});},{passive:true});
  if(matchMedia('(pointer:fine)').matches&&!reduced){const glow=document.querySelector('.cursor-glow');let scheduled=false,x=0,y=0;window.addEventListener('pointermove',event=>{x=event.clientX;y=event.clientY;if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{glow.style.left=x+'px';glow.style.top=y+'px';glow.style.opacity='1';scheduled=false;});},{passive:true});}
  const photoFallback='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760" viewBox="0 0 600 760"><rect width="600" height="760" fill="#272535"/><circle cx="300" cy="315" r="115" fill="#51465e"/><path d="M105 700c20-150 110-230 195-230s175 80 195 230" fill="#51465e"/><text x="300" y="115" fill="#f3c969" font-family="Georgia" text-anchor="middle" font-size="30">Photo unavailable</text></svg>');
  function fallbackImage(img){img.onerror=null;img.classList.add('image-missing');img.alt=`${img.alt} (photo unavailable)`;img.src=photoFallback;}
  document.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>fallbackImage(img));if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))fallbackImage(img);});
  window.StoryInteractions.init();
});
