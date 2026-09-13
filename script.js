const routeData={
  adult:{
    title:"Из детства → во взрослость",
    note:"Не отвергать прошлое, а перестать жить только его правилами.",
    heroPath:"M55 500 C165 412 242 244 350 255 C470 266 510 125 655 125 C735 126 758 84 792 70",
    preview:"M60 285 C210 210 180 90 360 115 C510 135 565 45 720 72 C835 92 875 55 950 60"
  },
  silence:{
    title:"Из шума → в тишину",
    note:"Не выключить весь мир, а различить в нём собственный голос.",
    heroPath:"M70 110 C160 75 238 190 325 210 C438 235 488 368 640 352 C720 344 742 430 796 555",
    preview:"M55 80 C195 60 255 210 380 190 C520 170 530 310 700 280 C820 260 875 170 950 180"
  }
};

const routeCards=[...document.querySelectorAll('.route-card')];
const routePath=document.getElementById('routePath');
const previewPath=document.getElementById('previewPath');
const routeTitle=document.getElementById('routeTitle');
const routeNote=document.getElementById('routeNote');

function setRoute(key){
  const data=routeData[key];
  if(!data)return;
  routeCards.forEach(card=>card.classList.toggle('active',card.dataset.route===key));
  routePath?.setAttribute('d',data.heroPath);
  previewPath?.setAttribute('d',data.preview);
  if(routeTitle) routeTitle.textContent=data.title;
  if(routeNote) routeNote.textContent=data.note;
}
routeCards.forEach(card=>{
  card.addEventListener('click',()=>setRoute(card.dataset.route));
  card.querySelector('.route-select')?.addEventListener('click',event=>{
    event.stopPropagation();
    setRoute(card.dataset.route);
    document.querySelector('.route-viewport')?.scrollIntoView({behavior:'smooth',block:'center'});
  });
});

const focusPhrases=[
  'то, что сейчас<br>важнее всего',
  'то, что обычно<br>остаётся за кадром',
  'место, где<br>появляется выбор'
];
let focusIndex=0;
const camera=document.getElementById('camera');
const focusSubject=document.getElementById('focusSubject');
function changeFocus(){
  focusIndex=(focusIndex+1)%focusPhrases.length;
  camera?.classList.toggle('focus-2',focusIndex%2===1);
  if(!focusSubject) return;
  focusSubject.style.opacity='0';
  setTimeout(()=>{
    focusSubject.innerHTML=focusPhrases[focusIndex];
    focusSubject.style.opacity='1';
  },180);
}
document.querySelector('[data-focus]')?.addEventListener('click',changeFocus);

const supportInput=document.getElementById('supportInput');
const supportBtn=document.getElementById('supportBtn');
const supportResult=document.getElementById('supportResult');
const suggestions=document.getElementById('suggestions');
function showSupportResult(){
  if(!supportInput?.value.trim()){
    supportInput?.focus();
    supportInput?.animate([
      {transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}
    ],{duration:240});
    return;
  }
  if(supportResult){
    supportResult.hidden=false;
    supportResult.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}
supportBtn?.addEventListener('click',showSupportResult);
supportInput?.addEventListener('keydown',event=>{
  if(event.key==='Enter') showSupportResult();
});
suggestions?.querySelectorAll('button').forEach(button=>{
  button.addEventListener('click',()=>{
    if(supportInput){
      supportInput.value=button.textContent.trim();
      supportInput.focus();
    }
  });
});

const year=document.getElementById('year');
if(year) year.textContent=String(new Date().getFullYear());