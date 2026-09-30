var events=[
{cat:"Café",img:"images/cafe.jpg",emoji:"☕",host:"Lu",name:"Lucía M.",when:"Sáb 4 oct · 16:00",title:"Café de especialidad y charla",place:"Palermo, Buenos Aires",going:8,bg:"linear-gradient(135deg,#b4622d,#e3a35f)",av:"#b4622d"},
{cat:"Escapadas",img:"images/escapadas.jpg",emoji:"🏞️",host:"Ma",name:"Martín R.",when:"Dom 12 oct · 08:00",title:"Atardecer en Playa Pura Vida",place:"Playa Pura Vida",going:12,bg:"linear-gradient(135deg,#1f8a70,#7fd1a8)",av:"#1f8a70"},
{cat:"Música",img:"images/musica.jpg",emoji:"🎶",host:"So",name:"Sofía P.",when:"Vie 17 oct · 21:00",title:"Noche de música en vivo",place:"San Telmo, Buenos Aires",going:24,bg:"linear-gradient(135deg,#2048ed,#9b5cf0)",av:"#2048ed"}
];
var state={filter:"all",joined:{},saved:{}};
var feed=document.getElementById("feed"),count=document.getElementById("count");
function render(){
  var list=events.filter(function(e){return state.filter==="all"||e.cat===state.filter});
  count.textContent=list.length+" evento"+(list.length===1?"":"s");
  feed.innerHTML=list.map(function(e){
    var i=events.indexOf(e),j=state.joined[i],s=state.saved[i];
    return '<article class="card"><div class="host"><div class="av" style="background:'+e.av+'">'+e.host+'</div><div><b>'+e.name+'</b><small>propone un plan</small></div></div>'+
    '<div class="cover" style="background:linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0) 45%),url('+e.img+') center/cover,'+e.bg+'"><span class="tag">'+e.cat+'</span></div>'+
    '<div class="body"><h2>'+e.title+'</h2><p class="meta">📅 '+e.when+'<br>📍 '+e.place+'</p>'+
    '<div class="row"><span class="going">'+(e.going+(j?1:0))+' van</span><div class="actions">'+
    '<button class="ic" data-s="'+i+'" aria-pressed="'+!!s+'" aria-label="Guardar">'+(s?"♥":"♡")+'</button>'+
    '<button class="join'+(j?" on":"")+'" data-j="'+i+'">'+(j?"Anotado ✓":"Sumarme")+'</button></div></div></div></article>';
  }).join("");
}
document.getElementById("chips").addEventListener("click",function(ev){
  var b=ev.target.closest(".chip");if(!b)return;
  state.filter=b.dataset.f;
  document.querySelectorAll(".chip").forEach(function(c){c.setAttribute("aria-pressed",c===b)});
  render();
});
feed.addEventListener("click",function(ev){
  var j=ev.target.closest("[data-j]"),s=ev.target.closest("[data-s]");
  if(j){state.joined[j.dataset.j]=!state.joined[j.dataset.j];render()}
  if(s){state.saved[s.dataset.s]=!state.saved[s.dataset.s];render()}
});
render();
