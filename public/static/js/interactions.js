/* Every story interaction lives here; browser storage contains only local progress. */
window.StoryInteractions = (() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const store = {
    get(key, fallback) { try { const value = JSON.parse(localStorage.getItem('hassan-story-' + key)); return value ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem('hassan-story-' + key, JSON.stringify(value)); } catch { /* Story still works when storage is disabled. */ } }
  };
  let toastTimer;
  function toast(message) { const box=$('#toast'); box.textContent=message; box.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.classList.remove('show'),4400); }
  function heartBurst(x, y, symbols=['♡','✦','💗']) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for(let i=0;i<9;i++){ const item=document.createElement('span'); item.className='heart-burst'; item.textContent=symbols[i%symbols.length]; item.style.left=`${x+(Math.random()-.5)*35}px`; item.style.top=`${y+(Math.random()-.5)*20}px`; item.style.setProperty('--dx',`${(Math.random()-.5)*180}px`); item.style.animationDelay=`${i*30}ms`; document.body.append(item); setTimeout(()=>item.remove(),1500); }
  }
  function initGallery() {
    const photos=$$('.polaroid'); const dialog=$('#photo-dialog'); const image=$('#modal-image'); let index=0, startX=0;
    function render(){ const item=photos[index]; const source=item.querySelector('img'); image.src=source.currentSrc||source.src; image.alt=source.alt; $('#modal-title').textContent=item.querySelector('strong').textContent; $('#modal-caption').textContent=item.querySelector('small').textContent; $('#modal-count').textContent=`${index+1} / ${photos.length}`; }
    function open(i){ index=((i%photos.length)+photos.length)%photos.length; render(); dialog.showModal(); }
    function move(step){ index=(index+step+photos.length)%photos.length; render(); }
    $$('.photo-open').forEach(button=>button.addEventListener('click',()=>open(Number(button.dataset.photo))));
    $('#photo-prev').addEventListener('click',()=>move(-1)); $('#photo-next').addEventListener('click',()=>move(1)); $('#photo-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog) dialog.close();});
    dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);} if(event.key==='ArrowRight'){event.preventDefault();move(1);}});
    dialog.addEventListener('touchstart',event=>{startX=event.changedTouches[0].screenX;},{passive:true});
    dialog.addEventListener('touchend',event=>{const distance=event.changedTouches[0].screenX-startX;if(Math.abs(distance)>45)move(distance>0?-1:1);},{passive:true});
  }
  function initCake(){
    const candles=$$('.candle'); const cake=$('#cake'); let out=store.get('candles',[]); let extraTaps=0;
    function render(){candles.forEach((c,i)=>{c.classList.toggle('out',out.includes(i));c.setAttribute('aria-label',out.includes(i)?`Candle ${i+1} is out`:`Blow out candle ${i+1}`);});$('#cake-instruction span').textContent=`${out.length} / 3`; if(out.length===3){$('#cake-instruction').firstChild.textContent='Your wish is on its way ✨ ';$('#birthday-message').hidden=false;}else{$('#cake-instruction').firstChild.textContent='Make a wish, then tap each candle to blow it out ✨ ';$('#birthday-message').hidden=true;}}
    function balloons(){const field=$('#balloon-field');field.replaceChildren();if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<9;i++){const b=document.createElement('span');b.className='balloon';b.style.left=`${7+i*10}%`;b.style.animationDelay=`${i*.17}s`;field.append(b);setTimeout(()=>b.remove(),6500);}}
    function celebrate(){window.Celebrate.burst(120);balloons();const r=cake.getBoundingClientRect();heartBurst(r.left+r.width/2,r.top,['✦','♡','🎉']);}
    candles.forEach((c,i)=>c.addEventListener('click',e=>{e.stopPropagation();if(out.includes(i))return;out.push(i);store.set('candles',out);render();const r=c.getBoundingClientRect();heartBurst(r.left+r.width/2,r.top,['✦','♡']);if(out.length===3)celebrate();}));
    cake.addEventListener('click',()=>{if(out.length!==3)return;if(++extraTaps===5){toast('Bas kar Hassan, poora cake kha jaoge! 😂');extraTaps=0;}});
    $('#cake-slice-button').addEventListener('click',()=>{const slice=$('#cake-slice');slice.hidden=false;store.set('cakeSlice',true);window.Celebrate.burst(35);});
    if(store.get('cakeSlice',false))$('#cake-slice').hidden=false;
    $('#replay-birthday').addEventListener('click',()=>{out=[];extraTaps=0;store.set('candles',out);store.set('cakeSlice',false);$('#cake-slice').hidden=true;render();document.getElementById('birthday').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
    render();
  }
  function initGame(){
    const apologies=['Sorry for missing your birthday. 🎂','Sorry for our conversations becoming less frequent. 🥺','Sorry for making you feel ignored. 💔','Sorry for not checking in properly. 💌','Sorry, Hassan. You deserved better from your bestie. ❤️'];
    let collected=store.get('apologies',[]).filter(i=>Number.isInteger(i)&&i>=0&&i<5);
    collected=[...new Set(collected)];
    function render(){const list=$('#collected-list');list.replaceChildren();collected.forEach(i=>{const li=document.createElement('li');li.textContent=apologies[i];list.append(li);});if(!collected.length){const li=document.createElement('li');li.className='placeholder';li.textContent='Your little notes will appear here.';list.append(li);}$('#game-count').textContent=`${collected.length} / 5`;$('#game-fill').style.width=`${collected.length*20}%`;$$('.sorry-token').forEach(b=>{const yes=collected.includes(Number(b.dataset.sorry));b.classList.toggle('collected',yes);b.setAttribute('aria-pressed',yes?'true':'false');b.disabled=yes;});$('#game-complete').hidden=collected.length!==5;}
    $$('.sorry-token').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.sorry);if(collected.includes(i))return;collected.push(i);store.set('apologies',collected);render();const r=b.getBoundingClientRect();heartBurst(r.left+r.width/2,r.top);toast(apologies[i]);if(collected.length===5)window.Celebrate.burst(100);}));
    $('#skip-game').addEventListener('click',()=>document.getElementById('promises').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
    render();
  }
  function initPromises(){const flipped=store.get('promises',[]);$$('.promise-card').forEach((card,i)=>{if(flipped.includes(i)){card.classList.add('flipped');card.setAttribute('aria-pressed','true');}card.addEventListener('click',()=>{card.classList.toggle('flipped');const on=card.classList.contains('flipped');card.setAttribute('aria-pressed',on?'true':'false');store.set('promises',$$('.promise-card').flatMap((p,n)=>p.classList.contains('flipped')?[n]:[]));if(on){const r=card.getBoundingClientRect();heartBurst(r.left+r.width/2,r.top,['✦','✓']);}});});}
  function initMood(){const responses={better:'Yayyy! Thori si progress ho gayi! 🥹 Thank you for hearing me out.',upset:'Fair enough, Hassan. ❤️ I understand. Take your time. I’ll respect how you feel.',talk:'That means a lot! 🥹 Thank you for giving this bestie a chance to do better.'};function select(key){if(!responses[key])return;$$('.mood-option').forEach(b=>{const active=b.dataset.mood===key;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',active?'true':'false');});$('#mood-response').hidden=false;$('#mood-response').textContent=responses[key];store.set('mood',key);}$$('.mood-option').forEach(b=>b.addEventListener('click',()=>select(b.dataset.mood)));select(store.get('mood',''));}
  function initEasterEggs(){let clicks=0;$('#hassan-heading').addEventListener('click',()=>{if(++clicks===3){toast('Breaking News: Hassan Sahab is officially too cool to stay naraz forever. 😎');clicks=0;}});const gift=$('#gift-dialog');$('#gift-button').addEventListener('click',()=>gift.showModal());$('#gift-close').addEventListener('click',()=>gift.close());$('#gift-done').addEventListener('click',()=>gift.close());gift.addEventListener('click',e=>{if(e.target===gift)gift.close();});$('#last-thing-button').addEventListener('click',()=>{const note=$('#last-thing');note.hidden=!note.hidden;$('#last-thing-button').setAttribute('aria-expanded',String(!note.hidden));});}
  function init(){initGallery();initCake();initGame();initPromises();initMood();initEasterEggs();}
  return {init,toast,heartBurst};
})();
