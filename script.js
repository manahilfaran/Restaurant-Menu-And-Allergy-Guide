//  Structured data 
// Dish: {id,name,price,cat,allergens[],traces[],ingredients[],note,updated(ISO)}
const ALLERGENS=["nuts","dairy","gluten","egg","shellfish","sesame","fish"];
const KEY="mtDishes3",STALE=30;
const ago=n=>new Date(Date.now()-n*864e5).toISOString();
const SEED=[
{id:1,name:"Chicken Karahi",price:1450,cat:"Mains",allergens:["dairy"],traces:["nuts"],ingredients:["chicken","tomato","ginger","yogurt"],note:"Wok is shared with the almond korma.",updated:ago(3)},
{id:2,name:"Palak Paneer",price:950,cat:"Mains",allergens:["dairy"],traces:[],ingredients:["spinach","paneer","cream","garlic"],note:"",updated:ago(10)},
{id:3,name:"Chana Masala",price:700,cat:"Mains",allergens:[],traces:[],ingredients:["chickpeas","onion","tomato","coriander"],note:"",updated:ago(5)},
{id:4,name:"Prawn Biryani",price:1750,cat:"Rice",allergens:["shellfish"],traces:["fish"],ingredients:["rice","prawns","onion","saffron"],note:"Fried onions share a fryer with fish.",updated:ago(45)},
{id:5,name:"Almond Kheer",price:550,cat:"Desserts",allergens:["nuts","dairy"],traces:[],ingredients:["rice","milk","almond","cardamom"],note:"",updated:ago(2)},
{id:6,name:"Garlic Naan",price:250,cat:"Breads",allergens:["gluten","dairy","egg"],traces:["sesame"],ingredients:["flour","butter","egg","garlic"],note:"Tandoor is also used for sesame bread.",updated:ago(8)},
{id:7,name:"Sesame Tikka Wrap",price:900,cat:"Wraps",allergens:["gluten","sesame"],traces:[],ingredients:["chicken","flatbread","sesame","mint"],note:"",updated:ago(60)},
{id:8,name:"Grilled Fish & Rice",price:1600,cat:"Rice",allergens:["fish"],traces:["shellfish"],ingredients:["fish","lemon","rice","herbs"],note:"Grill is shared with prawns.",updated:ago(1)}];

//  Data layer: stand-in for a REST API 
const api={
 async list(){try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}
  localStorage.setItem(KEY,JSON.stringify(SEED));return JSON.parse(JSON.stringify(SEED))},
 async save(d){const all=await this.list();d.updated=new Date().toISOString();
  if(d.id)all[all.findIndex(x=>x.id===d.id)]=d;else{d.id=Math.max(0,...all.map(x=>x.id))+1;all.push(d)}
  localStorage.setItem(KEY,JSON.stringify(all))},
 async remove(id){localStorage.setItem(KEY,JSON.stringify((await this.list()).filter(d=>d.id!==id)))}
};

let dishes=[];
const $=id=>document.getElementById(id);
const rs=n=>"Rs "+Math.round(n).toLocaleString("en-PK");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const split=s=>s.split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);
const days=iso=>Math.floor((Date.now()-new Date(iso))/864e5);
const when=n=>n<=0?"today":n===1?"yesterday":n+" days ago";
const old=d=>days(d.updated)>STALE;
const chips=(el,name,sel=[])=>el.innerHTML=ALLERGENS.map(a=>`<label class="chip"><input type="checkbox" name="${name}" value="${a}"${sel.includes(a)?" checked":""}> ${a}</label>`).join("");
const picked=name=>[...document.querySelectorAll(`input[name=${name}]:checked`)].map(c=>c.value);
const tags=a=>a.length?a.map(x=>`<span class="tag">${x}</span>`).join(""):'<span class="meta">none</span>';

//  Overview stats 
function renderStats(){
 const s=[["Dishes on menu",dishes.length,""],["Need review (over "+STALE+" days)",dishes.filter(old).length,dishes.some(old)?"warn":""],
  ["With cross-contact notes",dishes.filter(d=>d.note).length,""],["Allergen-free dishes",dishes.filter(d=>!d.allergens.length).length,""]];
 $("stats").innerHTML=s.map(x=>`<article class="stat ${x[2]}"><p class="num">${x[1]}</p><p>${x[0]}</p></article>`).join("");
}

//  Guest lookup 
function lookup(){
 const avoid=picked("la"),other=split($("lkOther").value);
 if(!avoid.length&&!other.length){$("lkOut").innerHTML='<p class="empty">Tick what the guest avoids to see which dishes to offer.</p>';return}
 const hit=d=>d.allergens.some(a=>avoid.includes(a))||other.some(o=>d.ingredients.some(i=>i.includes(o)));
 const no=dishes.filter(hit),ask=dishes.filter(d=>!hit(d)&&d.traces.some(a=>avoid.includes(a))),ok=dishes.filter(d=>!hit(d)&&!ask.includes(d));
 const list=(t,cls,a,note)=>`<div class="res ${cls}"><h3>${t} (${a.length})</h3>${a.length?`<ul>${a.map(d=>`<li>${esc(d.name)}${note?` <span class="meta">${esc(note(d))}</span>`:""}</li>`).join("")}</ul>`:'<p class="meta">None.</p>'}</div>`;
 $("lkOut").innerHTML=list("Can offer","ok",ok)+list("Ask the chef first (traces)","ask",ask,d=>"traces: "+d.traces.filter(a=>avoid.includes(a)).join(", "))+list("Do not offer","no",no);
}

// Menu table: search, filter, sort 
function renderMenu(){
 const q=$("search").value.trim().toLowerCase(),cat=$("cat").value,has=$("has").value,free=$("free").value,st=$("state").value,s=$("sort").value;
 const list=dishes.filter(d=>(!q||d.name.toLowerCase().includes(q)||d.ingredients.some(i=>i.includes(q)))&&(!cat||d.cat===cat)
  &&(!has||d.allergens.includes(has))&&(!free||!d.allergens.includes(free))&&(st===""||(st==="old"?old(d):!!d.note)));
 list.sort((a,b)=>s==="low"?a.price-b.price:s==="high"?b.price-a.price:s==="old"?new Date(a.updated)-new Date(b.updated):a.name.localeCompare(b.name));
 $("rows").innerHTML=list.map(d=>`<tr class="${old(d)?"stale":""}">
  <th scope="row" data-label="Dish">${esc(d.name)}<br><span class="meta">${esc(d.cat)} · ${esc(d.ingredients.join(", "))}</span>${d.note?`<br><span class="cross">${esc(d.note)}</span>`:""}</th>
  <td data-label="Price">${rs(d.price)}</td><td data-label="Contains">${tags(d.allergens)}</td><td data-label="Traces">${tags(d.traces)}</td>
  <td data-label="Updated">${when(days(d.updated))}<br>${old(d)?'<span class="flag">Needs review</span>':'<span class="meta">Up to date</span>'}</td>
  <td data-label="Actions" class="actions"><button type="button" class="ghost" data-act="edit" data-id="${d.id}" aria-label="Edit ${esc(d.name)}">Edit</button>
  <button type="button" class="ghost" data-act="ok" data-id="${d.id}" aria-label="Mark ${esc(d.name)} as reviewed">Mark reviewed</button>
  <button type="button" class="ghost" data-act="del" data-id="${d.id}" aria-label="Delete ${esc(d.name)}">Delete</button></td></tr>`).join("");
 $("status").textContent=list.length?`Showing ${list.length} of ${dishes.length} dishes.`:(dishes.length?"No dishes match these filters. Clear a filter or the search box.":"The menu is empty. Click Add dish to start.");
 const cur=[["cat",[...new Set(dishes.map(d=>d.cat))],"All"],["has",ALLERGENS,"Any allergen"],["free",ALLERGENS,"No filter"]];
 cur.forEach(([id,opts,first])=>{const el=$(id),v=el.value;el.innerHTML=`<option value="">${first}</option>`+opts.map(o=>`<option${o===v?" selected":""}>${o}</option>`).join("")});
}
function renderRecent(){
 const r=[...dishes].sort((a,b)=>new Date(b.updated)-new Date(a.updated)).slice(0,5);
 $("recentList").innerHTML=r.length?r.map(d=>`<li><strong>${esc(d.name)}</strong> <span class="meta">${new Date(d.updated).toLocaleString()}</span></li>`).join(""):'<li class="empty">No changes yet.</li>';
}
const renderAll=()=>{renderStats();lookup();renderMenu();renderRecent()};

//  Events 
$("toolbar").addEventListener("input",renderMenu);
$("lookup").addEventListener("input",lookup);
$("rows").addEventListener("click",async e=>{
 const b=e.target.closest("button[data-act]");if(!b)return;
 const d=dishes.find(x=>x.id===+b.dataset.id);
 if(b.dataset.act==="edit")openEditor(d);
 if(b.dataset.act==="ok"){await api.save(d);dishes=await api.list();renderAll();$("status").textContent=d.name+" marked as reviewed. Timestamp updated."}
 if(b.dataset.act==="del"&&confirm(`Delete ${d.name} from the menu?`)){await api.remove(d.id);dishes=await api.list();renderAll();$("status").textContent=d.name+" deleted."}
});
$("csv").addEventListener("click",()=>{
 if(!dishes.length){$("status").textContent="Nothing to export. The menu is empty.";return}
 const q=s=>`"${String(s).replace(/"/g,'""')}"`;
 const rows=[["Name","Category","Price","Contains","Traces","Ingredients","Note","Updated"],...dishes.map(d=>[d.name,d.cat,d.price,d.allergens.join("; "),d.traces.join("; "),d.ingredients.join("; "),d.note,d.updated])];
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(",")).join("\n")],{type:"text/csv"}));
 a.download="menu.csv";a.click();URL.revokeObjectURL(a.href);
});

//  Add / edit dish 
function openEditor(d){
 $("editForm").reset();$("eMsg").textContent="";$("eTitle").textContent=d?"Edit "+d.name:"Add dish";$("eId").value=d?d.id:"";
 if(d){$("eName").value=d.name;$("ePrice").value=d.price;$("eCat").value=d.cat;$("eIng").value=d.ingredients.join(", ");$("eNote").value=d.note}
 chips($("eAll"),"ea",d?d.allergens:[]);chips($("eTr"),"et",d?d.traces:[]);$("editor").showModal();$("eName").focus();
}
$("addDish").addEventListener("click",()=>openEditor());
$("eCancel").addEventListener("click",()=>$("editor").close());
$("editForm").addEventListener("submit",async e=>{e.preventDefault();
 const id=+$("eId").value||null,name=$("eName").value.trim(),ings=split($("eIng").value),all=picked("ea");
 $("eName").setCustomValidity(dishes.some(d=>d.name.toLowerCase()===name.toLowerCase()&&d.id!==id)?"A dish with this name already exists.":"");
 $("eIng").setCustomValidity(ings.length?"":"Add at least one ingredient.");
 if(!e.target.checkValidity()){const bad=e.target.querySelector(":invalid");$("eMsg").textContent=bad.validationMessage;bad.focus();return}
 const tr=picked("et").filter(a=>!all.includes(a));
 await api.save({id,name,price:+$("ePrice").value,cat:$("eCat").value,allergens:all,traces:tr,ingredients:ings,note:$("eNote").value.trim()});
 dishes=await api.list();$("editor").close();renderAll();$("status").textContent=name+" saved. Timestamp updated.";
});

(async()=>{dishes=await api.list();chips($("lkChips"),"la");renderAll();countUp()})();
// Counting the overview numbers up from 0 once on page load 
function countUp(){
 if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 document.querySelectorAll(".num").forEach(el=>{const to=+el.textContent,t0=performance.now();
  (function f(t){const p=Math.min((t-t0)/700,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)});
}