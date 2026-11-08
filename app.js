(function(){
"use strict";
const D=window.SITE_DATA||{projects:[],certs:[]},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const enc=p=>p.split("/").map(encodeURIComponent).join("/");
const root=document.documentElement;
/* theme */
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t}catch(e){}
const ti=()=>$("#theme").textContent=root.dataset.theme==="dark"?"☀":"☾";ti();$("#theme").onclick=()=>{const t=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=t;ti();try{localStorage.setItem("theme",t)}catch(e){}};
$("#burger").onclick=e=>{const o=$("#menu").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",o)};
$$("#menu a").forEach(a=>a.onclick=()=>{$("#menu").classList.remove("open");$("#burger").setAttribute("aria-expanded","false")});
$("#yr").textContent=new Date().getFullYear();
/* greeting by visitor's local time */
function greeting(d){const h=d.getHours();return h<5?"Working late? Welcome.":h<12?"Good morning, welcome.":h<17?"Good afternoon, welcome.":h<22?"Good evening, welcome.":"Good evening, still up? Welcome."}
$("#greet").textContent=greeting(new Date());
/* typed roles */
const roles=["Mechanical Engineering Student","CAD and CAE Designer","Automation and Robotics Enthusiast","Aspiring Researcher and Innovator"],ty=$("#typed");
if(matchMedia("(prefers-reduced-motion:reduce)").matches){ty.textContent=roles[0]}else{let r=0,c=0,del=false;(function tick(){const w=roles[r];c+=del?-1:1;ty.textContent=w.slice(0,c);let t=del?35:70;if(!del&&c===w.length){del=true;t=1600}else if(del&&c===0){del=false;r=(r+1)%roles.length;t=350}setTimeout(tick,t)})()}
/* stats */
const P=D.projects,nCad=P.reduce((a,p)=>a+p.cad.parts.length+p.cad.assembly.length+p.cad.simulation.length,0),nVid=P.reduce((a,p)=>a+p.videos.length,0);
const N={projects:P.length,cad:nCad,certs:D.certs.length,videos:nVid};
$$("[data-n]").forEach(el=>{const to=N[el.dataset.n];let s=null;const run=ts=>{s=s||ts;const k=Math.min((ts-s)/1200,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(run)};requestAnimationFrame(run)});
/* skills */
const SK=[["SolidWorks",90],["AutoCAD",80],["CATIA",65],["ANSYS Workbench",75],["Structural Analysis",70],["CFD Analysis",60],["Arduino / C++",80],["MATLAB",70],["Python",60]];
$("#bars").innerHTML=SK.map(([n,v])=>`<div class="bar"><div><span>${esc(n)}</span><span>${v}%</span></div><u><i data-w="${v}"></i></u></div>`).join("");
/* reveal, progress, nav */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");e.target.querySelectorAll("[data-w]").forEach(b=>b.style.width=b.dataset.w+"%");io.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));
const secs=$$("section[id]"),links=$$("#menu a");
addEventListener("scroll",()=>{const h=root.scrollHeight-innerHeight;$("#prog").style.width=(h>0?scrollY/h*100:0)+"%";$("#top").classList.toggle("on",scrollY>600);let cur="";secs.forEach(s=>{if(scrollY>=s.offsetTop-120)cur=s.id});links.forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+cur))},{passive:true});
$("#top").onclick=()=>scrollTo({top:0});
/* dialogs */
$$("dialog").forEach(d=>{d.addEventListener("click",e=>{if(e.target===d||e.target.closest("[data-close]"))d.close()})});
document.addEventListener("contextmenu",e=>{if(e.target.closest("img,video,canvas,dialog"))e.preventDefault()});
$("#pm").addEventListener("close",()=>{$("#pmb").querySelectorAll("video").forEach(v=>v.pause());if(location.hash.startsWith("#p-"))history.replaceState(null,"",location.pathname+location.search)});
/* projects */
let cat="All",qs="";const cats=["All",...[...new Set(P.map(p=>p.category))].sort()];
$("#cats").innerHTML=cats.map(c=>`<button class="fb${c==="All"?" on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
$("#cats").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;cat=b.dataset.c;$$("#cats .fb").forEach(x=>x.classList.toggle("on",x===b));drawP()};
$("#q").oninput=e=>{qs=e.target.value.toLowerCase().trim();drawP()};
const hay=p=>[p.title,p.category,p.desc||"",p.tags.join(" "),...["parts","assembly","simulation"].flatMap(k=>p.cad[k].map(f=>f.name))].join(" ").toLowerCase();
function drawP(){const g=$("#pgrid");const list=P.filter(p=>(cat==="All"||p.category===cat)&&hay(p).includes(qs));
g.innerHTML=list.map(p=>{const pv=[...p.cad.assembly,...p.cad.parts].find(f=>f.preview);const img=p.images[0]||p.analysis[0]||(pv&&pv.preview);const n=p.cad.parts.length+p.cad.assembly.length+p.cad.simulation.length;
return `<button class="card pc" data-s="${p.slug}"><div class="im">${img?`<img loading="lazy" src="${enc(img)}" alt="${esc(p.title)}">`:"SolidWorks files"}</div><div class="bd"><div class="mono">${esc(p.category)}</div><h3 style="margin-top:4px">${esc(p.title)}</h3><p>${esc(p.desc||"Case-study write-up to be added.")}</p><div class="meta">${n?`<span class="chip">${n} CAD files</span>`:""}${p.videos.length?`<span class="chip">${p.videos.length} video${p.videos.length>1?"s":""}</span>`:""}${p.analysis.length?'<span class="chip">Analysis</span>':""}</div></div></button>`}).join("");
$("#pnone").hidden=list.length>0}
$("#pgrid").onclick=e=>{const b=e.target.closest("[data-s]");if(b)openP(b.dataset.s)};
const stem=n=>n.replace(/\.[^.]+$/,"").toLowerCase();const MAIL="justicejohnnyazika@gmail.com";const req=(t,f)=>`mailto:${MAIL}?subject=${encodeURIComponent("Access request: "+t+(f?" / "+f:""))}&body=${encodeURIComponent("Hello Justice,\n\nI would like permission to access: "+t+(f?" ("+f+")":"")+".\n\nMy name and purpose:\n")}`;
function fileList(t,arr,p){return arr.length?`<div class="fl"><h4>${t} (${arr.length})</h4>${arr.map(f=>{const m=p.models.find(x=>stem(x.name)===stem(f.name));return `<div class="row-f">${f.preview?`<img class="th" loading="lazy" src="${enc(f.preview)}" alt="" width="64" height="48">`:""}<span>${esc(f.name)}</span>${m?`<button class="mini" data-m="${esc(m.file)}" data-n="${esc(p.title+" / "+f.name)}">View in 3D</button>`:""}<a class="mini" href="${req(p.title,f.name)}">Request access</a></div>`}).join("")}</div>`:""}
function openP(slug,tab){const p=P.find(x=>x.slug===slug);if(!p)return;history.replaceState(null,"","#p-"+slug);$("#pmc").textContent=p.category;$("#pmt").textContent=p.title;
const nCad=p.cad.parts.length+p.cad.assembly.length+p.cad.simulation.length;
const T=[["ov","Overview",1],["gal","Gallery",p.images.length],["an","Analysis",p.analysis.length],["vid","Videos",p.videos.length],["cad","CAD files",nCad]].filter(t=>t[2]);
const body={ov:()=>`<p>${esc(p.desc||"Case-study write-up to be added: problem statement, design method, results and outcome.")}</p><div class="chips" style="margin:14px 0">${p.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>${nCad?`<p style="color:var(--mute)">${p.cad.parts.length} part file(s), ${p.cad.assembly.length} assembly file(s)${p.cad.simulation.length?`, ${p.cad.simulation.length} simulation file(s)`:""}.</p>`:""}`,
gal:()=>`<div class="gal">${p.images.map((s,i)=>`<button data-lb="gal" data-i="${i}"><img loading="lazy" src="${enc(s)}" alt="${esc(p.title)} image ${i+1}"></button>`).join("")}</div>`,
an:()=>`<div class="gal">${p.analysis.map((s,i)=>`<button data-lb="an" data-i="${i}"><img loading="lazy" src="${enc(s)}" alt="${esc(p.title)} analysis ${i+1}"></button>`).join("")}</div>`,
vid:()=>p.videos.map(v=>`<div class="vt">${esc(v.title)}</div><video controls controlsList="nodownload noplaybackrate" disablePictureInPicture preload="metadata" src="${enc(v.file)}"></video>`).join(""),
cad:()=>`<p class="note">SolidWorks parts and assemblies, view-only. The 3D view appears here once a model is published. For the source file or permission to use it, send a request.</p>${fileList("Parts",p.cad.parts,p)}${fileList("Assemblies",p.cad.assembly,p)}${fileList("Simulation",p.cad.simulation,p)}`};
const render=t=>{$("#pmb").querySelectorAll("video").forEach(v=>v.pause());$("#pmb").innerHTML=`<div class="tabs" role="tablist">${T.map(x=>`<button class="fb${x[0]===t?" on":""}" role="tab" aria-selected="${x[0]===t}" data-t="${x[0]}">${x[1]}${x[0]==="ov"?"":" ("+x[2]+")"}</button>`).join("")}</div><div id="tp">${body[t]()}</div>`};
render(tab||"ov");$("#pmb").onclick=e=>{const t=e.target.closest("[data-t]");if(t)return render(t.dataset.t);const mv=e.target.closest("[data-m]");if(mv){$("#pm").close();window.__view(mv.dataset.m,mv.dataset.n);return}const l=e.target.closest("[data-lb]");if(l)openLB(l.dataset.lb==="an"?p.analysis:p.images,+l.dataset.i,p.title)};
$("#pm").showModal();$("#pmb").scrollTop=0}
/* lightbox */
let LB=[],li=0,lt="";function openLB(a,i,t){LB=a;li=i;lt=t;showLB();$("#lb").showModal()}
function showLB(){$("#lbi").src=enc(LB[li]);$("#lbi").alt=lt+" image "+(li+1);$("#lbc").textContent=lt+" · "+(li+1)+" / "+LB.length}
const step=d=>{if(LB.length){li=(li+d+LB.length)%LB.length;showLB()}};$("#lbp").onclick=()=>step(-1);$("#lbn").onclick=()=>step(1);
addEventListener("keydown",e=>{if(!$("#lb").open)return;if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});
/* certificates */
let cc="All",cqs="";const ccs=["All",...[...new Set(D.certs.map(c=>c.category))].sort()];
$("#ccats").innerHTML=ccs.map(c=>`<button class="fb${c==="All"?" on":""}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
$("#ccats").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;cc=b.dataset.c;$$("#ccats .fb").forEach(x=>x.classList.toggle("on",x===b));drawC()};
$("#cq").oninput=e=>{cqs=e.target.value.toLowerCase().trim();drawC()};
let lc=[];function drawC(){const l=lc=D.certs.filter(c=>(cc==="All"||c.category===cc)&&(c.title+c.category).toLowerCase().includes(cqs));
$("#cgrid").innerHTML=l.length?l.map(c=>`<button class="card" data-i="${lc.indexOf(c)}" style="text-align:left;cursor:pointer"><div class="mono">${esc(c.category)}</div><h3 style="margin-top:6px">${esc(c.title)}</h3><p>View certificate</p></button>`).join(""):'<p class="empty">No certificates match.</p>'}
$("#cgrid").onclick=e=>{const b=e.target.closest("[data-i]");if(!b)return;const c=lc[+b.dataset.i];openLB(c.pages,0,c.title)};
/* contact */
$("#cf").onsubmit=e=>{e.preventDefault();const n=$("#n").value.trim(),m=$("#m").value.trim(),em=$("#e").value.trim(),ok=/^\S+@\S+\.\S+$/.test(em);
$("#en").textContent=n?"":"Enter your name.";$("#ee").textContent=ok?"":"Enter a valid email address.";$("#em").textContent=m.length>=10?"":"Write at least 10 characters.";
if(!(n&&ok&&m.length>=10))return;const body=m+"\n\nFrom: "+n+" <"+em+">";
location.href="mailto:justicejohnnyazika@gmail.com?subject="+encodeURIComponent($("#s").value.trim()||"Portfolio enquiry")+"&body="+encodeURIComponent(body)};
drawP();drawC();
if(location.hash.startsWith("#p-"))openP(location.hash.slice(3));
addEventListener("hashchange",()=>{if(location.hash.startsWith("#p-")&&!$("#pm").open)openP(location.hash.slice(3))});
/* 3D: hero gear and local model viewer */
if(window.THREE){
try{const el=$("#stage"),W=el.clientWidth,H=el.clientHeight||W,sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,W/H,.1,100);cam.position.set(0,0,9);
const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setSize(W,H);r.setPixelRatio(Math.min(devicePixelRatio,2));el.appendChild(r.domElement);
const s=new THREE.Shape(),N=16;for(let i=0;i<N*4;i++){const a=i/(N*4)*Math.PI*2,rad=i%4<2?2.6:2.1,x=Math.cos(a)*rad,y=Math.sin(a)*rad;i?s.lineTo(x,y):s.moveTo(x,y)}
const h=new THREE.Path();h.absarc(0,0,.9,0,Math.PI*2,true);s.holes.push(h);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,p=new THREE.Path();p.absarc(Math.cos(a)*1.5,Math.sin(a)*1.5,.28,0,Math.PI*2,true);s.holes.push(p)}
const g=new THREE.ExtrudeGeometry(s,{depth:.8,bevelEnabled:true,bevelSize:.05,bevelThickness:.05,bevelSegments:2});g.center();
const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x9aa7b8,metalness:.85,roughness:.35}));m.rotation.set(.5,.4,0);sc.add(m,new THREE.AmbientLight(0xffffff,.5));const l=new THREE.DirectionalLight(0xffffff,1.1);l.position.set(4,5,6);sc.add(l);
let dr=false,px=0,py=0,vis=true;new IntersectionObserver(x=>vis=x[0].isIntersecting).observe(el);
r.domElement.onpointerdown=e=>{dr=true;px=e.clientX;py=e.clientY};addEventListener("pointerup",()=>dr=false);
addEventListener("pointermove",e=>{if(!dr)return;m.rotation.y+=(e.clientX-px)*.01;m.rotation.x+=(e.clientY-py)*.01;px=e.clientX;py=e.clientY});
const calm=matchMedia("(prefers-reduced-motion:reduce)").matches;(function loop(){requestAnimationFrame(loop);if(!vis)return;if(!dr&&!calm)m.rotation.z+=.004;r.render(sc,cam)})();
addEventListener("resize",()=>{const w=el.clientWidth,hh=el.clientHeight;r.setSize(w,hh);cam.aspect=w/hh;cam.updateProjectionMatrix()})}catch(e){$("#stage").insertAdjacentHTML("beforeend","<p style='padding:16px;color:#c3cddb'>3D preview needs WebGL.</p>")}
}
(function(){const box=$("#v3d"),msg=$("#vmsg");
if(!window.THREE||!THREE.OrbitControls||!THREE.GLTFLoader||!THREE.STLLoader){msg.textContent="Viewer libraries could not load. Check your internet connection.";return}
const tree=$("#vtree"),info=$("#vinfo"),ex=$("#vx"),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(45,1,.01,1e5);
let r;try{r=new THREE.WebGLRenderer({antialias:true})}catch(e){msg.textContent="This browser does not support WebGL.";return}
r.setPixelRatio(Math.min(devicePixelRatio,2));box.appendChild(r.domElement);sc.background=new THREE.Color(0x13253f);
sc.add(new THREE.HemisphereLight(0xffffff,0x334455,.9));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(5,8,6);sc.add(dl);
const ctl=new THREE.OrbitControls(cam,r.domElement);ctl.enableDamping=true;
let root3=null,meshes=[],sel=null,ctr=new THREE.Vector3(),home={},vis=true;
const fit=()=>{const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;r.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};
addEventListener("resize",fit);document.addEventListener("fullscreenchange",fit);fit();new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(box);
(function loop(){requestAnimationFrame(loop);if(!vis)return;ctl.update();r.render(sc,cam)})();
const fail=t=>msg.textContent=t;
function clear(){if(root3){sc.remove(root3);root3.traverse(o=>{if(o.geometry)o.geometry.dispose()})}root3=null;meshes=[];sel=null;tree.innerHTML="";ex.value=0}
function show(obj,name){clear();root3=obj;sc.add(root3);root3.updateMatrixWorld(true);
root3.traverse(o=>{if(o.isMesh){o.material=Array.isArray(o.material)?o.material.map(m=>m.clone()):o.material.clone();const b=new THREE.Box3().setFromObject(o);o.userData.c=b.getCenter(new THREE.Vector3());o.userData.wp=o.getWorldPosition(new THREE.Vector3());meshes.push(o)}});
const b=new THREE.Box3().setFromObject(root3);if(b.isEmpty()){fail("The file contains no visible geometry.");return}
b.getCenter(ctr);const size=b.getSize(new THREE.Vector3()).length()||1;cam.position.copy(ctr).add(new THREE.Vector3(1,.7,1).normalize().multiplyScalar(size*1.3));cam.near=size/1000;cam.far=size*100;cam.updateProjectionMatrix();ctl.target.copy(ctr);
home={p:cam.position.clone(),t:ctr.clone()};fail(name+" · "+meshes.length+" mesh(es)");mk(root3,tree);pick(null)}
function mk(o,ul){const li=document.createElement("li"),c=document.createElement("input");c.type="checkbox";c.checked=true;c.style.cssText="width:auto;padding:0";c.setAttribute("aria-label","Show");c.onchange=()=>{o.visible=c.checked};
const b=document.createElement("button");b.textContent=o.name||(o.isMesh?"Unnamed part":"Unnamed group");b.onclick=()=>pick(o);o.userData.btn=b;li.append(c,b);
const k=o.children.filter(x=>x.isMesh||x.children.length);if(k.length){const u=document.createElement("ul");k.forEach(x=>mk(x,u));li.append(u)}ul.append(li)}
const glow=(o,v)=>o.traverse(m=>{if(m.isMesh)[].concat(m.material).forEach(t=>t.emissive&&t.emissive.setHex(v))});
function pick(o){if(sel){glow(sel,0);sel.userData.btn&&sel.userData.btn.classList.remove("on")}sel=o;
if(!o){info.textContent="Select a part to see its bounding size. Units are those stored in the file.";return}
glow(o,0x2a5a8a);o.userData.btn&&o.userData.btn.classList.add("on");const s=new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3());info.textContent=(o.name||"Unnamed")+": "+s.x.toFixed(2)+" × "+s.y.toFixed(2)+" × "+s.z.toFixed(2)}
let d0=null;r.domElement.addEventListener("pointerdown",e=>d0=[e.clientX,e.clientY]);
r.domElement.addEventListener("pointerup",e=>{if(!d0||!root3||Math.hypot(e.clientX-d0[0],e.clientY-d0[1])>4)return;const R=r.domElement.getBoundingClientRect(),v=new THREE.Vector2((e.clientX-R.left)/R.width*2-1,-(e.clientY-R.top)/R.height*2+1),rc=new THREE.Raycaster();rc.setFromCamera(v,cam);const h=rc.intersectObjects(meshes.filter(m=>m.visible),false)[0];pick(h?h.object:null)});
ex.oninput=()=>{const k=+ex.value*.8;meshes.forEach(m=>{m.position.copy(m.parent.worldToLocal(m.userData.wp.clone().add(m.userData.c.clone().sub(ctr).multiplyScalar(k))))})};
$("#vreset").onclick=()=>{if(!root3)return;ex.value=0;ex.oninput();root3.traverse(o=>{o.visible=true});tree.querySelectorAll("input").forEach(c=>c.checked=true);pick(null);cam.position.copy(home.p);ctl.target.copy(home.t)};
$("#vfs").onclick=()=>{if(box.requestFullscreen)box.requestFullscreen();else fail("Full screen is not supported in this browser.")};
function loadURL(u,name){const x=u.split(".").pop().toLowerCase();fail("Loading "+name+"…");const bad=er=>fail("Could not load the model: "+(er&&er.message||"file missing or unsupported"));
try{if(x==="stl")new THREE.STLLoader().load(u,g=>{const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:0x9aa7b8,metalness:.6,roughness:.45}));m.name=name;const gr=new THREE.Group();gr.name="Model";gr.add(m);show(gr,name)},undefined,bad);
else if(x==="glb"||x==="gltf")new THREE.GLTFLoader().load(u,g=>show(g.scene,name),undefined,bad);else fail("Unsupported model format.")}catch(er){bad(er)}}
window.__view=(u,n)=>{$("#viewer").scrollIntoView();loadURL(u,n)};
const msel=$("#vsel");const all=P.flatMap(p=>p.models.map(m=>({...m,t:p.title+" / "+m.name})));
if(all.length){msel.innerHTML='<option value="">Choose a model</option>'+all.map((m,i)=>`<option value="${i}">${esc(m.t)}</option>`).join("");msel.onchange=()=>{const m=all[+msel.value];if(m)loadURL(m.file,m.t)}}
box.addEventListener("contextmenu",e=>e.preventDefault());
$("#vdemo").onclick=()=>{const M=c=>new THREE.MeshStandardMaterial({color:c,metalness:.7,roughness:.4}),g=new THREE.Group();g.name="Sample assembly (generated, not one of my designs)";
const a=new THREE.Mesh(new THREE.BoxGeometry(4,1,3),M(0x6c7a8c));a.name="Housing";const b=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,5,32),M(0xb0b8c4));b.rotation.z=Math.PI/2;b.position.y=1.2;b.name="Shaft";
const c=new THREE.Mesh(new THREE.TorusGeometry(.7,.2,16,40),M(0x4d8fd6));c.rotation.y=Math.PI/2;c.position.set(1.3,1.2,0);c.name="Bearing";g.add(a,b,c);show(g,"Sample geometry")};
})();
window.__portfolio={greeting,openP,drawP,drawC};
})();
