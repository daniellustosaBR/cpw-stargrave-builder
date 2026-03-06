const STORAGE_KEY = "cpw_stargrave_builder_v9";

const BASE_CREDITS = 400;
const MAX_SOLDIERS = 8;

const captainBase = { Move: 6, Fight: 3, Shoot: 2, Armour: 9, Will: 3, Health: 16 };
const firstMateBase = { Move: 6, Fight: 2, Shoot: 2, Armour: 9, Will: 2, Health: 14 };

const backgrounds = [
  { name: "Biomorph", statMods: { Health: 1, choose2: ["Move","Fight","Shoot"] }, core: ["Adrenaline Surge","Armour Plates","Camouflage","Fling","Regenerate","Restructure Body","Toxic Claws","Toxic Secretion"] },
  { name: "Cyborg", statMods: { Health: 1, choose2: ["Move","Fight","Shoot"] }, core: ["Camouflage","Control Robot","Data Knock","Energy Shield","Power Spike","Quick Step","Target Lock","Temporary Upgrade"] },
  { name: "Mystic", statMods: { Will: 2, Health: 1, choose1: ["Move","Fight","Shoot"] }, core: ["Control Animal","Dark Energy","Heal","Life Leach","Mystic Trance","Puppet Master","Suggestion","Void Blade"] },
  { name: "Robotics Expert", statMods: { Will: 1, choose2: ["Move","Fight","Shoot","Health"] }, core: ["Control Robot","Create Robot","Drone","Electromagnetic Pulse","Remote Firing","Remote Guidance","Repair Robot","Re-wire Robot"] },
  { name: "Rogue", statMods: { Will: 1, Health: 1, choose2: ["Move","Fight","Shoot"] }, core: ["Bait and Switch","Bribe","Cancel Power","Concealed Firearm","Data Jump","Fortune","Haggle","Quick-Step"] },
  { name: "Psionicist", statMods: { Will: 2, Health: 1, choose1: ["Move","Fight","Shoot"] }, core: ["Break Lock","Destroy Weapon","Lift","Psionic Fire","Psychic Shield","Pull","Suggestion","Wall of Force"] },
  { name: "Tekker", statMods: { Will: 2, choose2: ["Move","Fight","Shoot","Health"] }, core: ["Anti-gravity Projection","Data Jump","Data Knock","Data Skip","Drone","Electromagnetic Pulse","Holographic Wall","Transport"] },
  { name: "Veteran", statMods: { Fight: 1, Health: 1, choose1: ["Move","Fight","Shoot"] }, core: ["Armoury","Command","Coordinated Fire","Energy Shield","Fortune","Power Spike","Remote Firing","Target Designation"] }
];

const powers = [
  { name:"Adrenaline Surge", activation:12, strain:2, category:"Self Only" },
  { name:"Anti-gravity Projection", activation:10, strain:0, category:"Line of Sight" },
  { name:"Armour Plates", activation:10, strain:2, category:"Self Only or Out of Game (B)" },
  { name:"Armoury", activation:10, strain:0, category:"Out of Game (B)" },
  { name:"Bait and Switch", activation:12, strain:2, category:"Line of Sight" },
  { name:"Bribe", activation:14, strain:0, category:"Out of Game (B)" },
  { name:"Break Lock", activation:12, strain:1, category:"Line of Sight" },
  { name:"Camouflage", activation:10, strain:2, category:"Self Only" },
  { name:"Cancel Power", activation:8, strain:0, category:"Line of Sight" },
  { name:"Command", activation:8, strain:0, category:"Line of Sight" },
  { name:"Concealed Firearm", activation:10, strain:0, category:"Self Only" },
  { name:"Control Animal", activation:10, strain:2, category:"Line of Sight" },
  { name:"Control Robot", activation:10, strain:1, category:"Line of Sight" },
  { name:"Coordinated Fire", activation:10, strain:0, category:"Line of Sight" },
  { name:"Create Robot", activation:14, strain:0, category:"Out of Game (A)" },
  { name:"Dark Energy", activation:10, strain:1, category:"Line of Sight" },
  { name:"Data Jump", activation:12, strain:2, category:"Self Only" },
  { name:"Data Knock", activation:10, strain:1, category:"Line of Sight" },
  { name:"Data Skip", activation:10, strain:1, category:"Self Only" },
  { name:"Destroy Weapon", activation:10, strain:1, category:"Line of Sight" },
  { name:"Drone", activation:10, strain:0, category:"Out of Game (A)" },
  { name:"Electromagnetic Pulse", activation:12, strain:2, category:"Area Effect" },
  { name:"Energy Shield", activation:10, strain:2, category:"Self Only" },
  { name:"Fling", activation:12, strain:2, category:"Line of Sight" },
  { name:"Fortune", activation:10, strain:0, category:"Out of Game (B)" },
  { name:"Haggle", activation:12, strain:0, category:"Out of Game (B)" },
  { name:"Heal", activation:8, strain:1, category:"Line of Sight" },
  { name:"Holographic Wall", activation:10, strain:2, category:"Area Effect" },
  { name:"Lift", activation:10, strain:2, category:"Line of Sight" },
  { name:"Life Leach", activation:10, strain:2, category:"Line of Sight" },
  { name:"Mystic Trance", activation:8, strain:0, category:"Self Only" },
  { name:"Power Spike", activation:10, strain:2, category:"Line of Sight" },
  { name:"Psionic Fire", activation:10, strain:1, category:"Line of Sight" },
  { name:"Psychic Shield", activation:8, strain:0, category:"Self Only" },
  { name:"Pull", activation:10, strain:2, category:"Line of Sight" },
  { name:"Puppet Master", activation:14, strain:3, category:"Line of Sight" },
  { name:"Quick Step", activation:10, strain:2, category:"Self Only" },
  { name:"Quick-Step", activation:10, strain:2, category:"Self Only" },
  { name:"Regenerate", activation:10, strain:2, category:"Self Only" },
  { name:"Remote Firing", activation:10, strain:1, category:"Line of Sight" },
  { name:"Remote Guidance", activation:10, strain:1, category:"Line of Sight" },
  { name:"Repair Robot", activation:8, strain:1, category:"Line of Sight" },
  { name:"Restructure Body", activation:12, strain:2, category:"Self Only" },
  { name:"Re-wire Robot", activation:10, strain:2, category:"Line of Sight" },
  { name:"Suggestion", activation:12, strain:2, category:"Line of Sight" },
  { name:"Target Designation", activation:10, strain:1, category:"Line of Sight" },
  { name:"Target Lock", activation:10, strain:1, category:"Line of Sight" },
  { name:"Temporary Upgrade", activation:12, strain:0, category:"Out of Game (B)" },
  { name:"Toxic Claws", activation:10, strain:2, category:"Self Only" },
  { name:"Toxic Secretion", activation:10, strain:2, category:"Self Only" },
  { name:"Transport", activation:12, strain:2, category:"Line of Sight" },
  { name:"Void Blade", activation:10, strain:2, category:"Self Only" },
  { name:"Wall of Force", activation:12, strain:1, category:"Area Effect" }
];

const soldierCatalog = [
  { name: "Codebreaker", cost: 75 },
  { name: "Casecracker", cost: 75 },
  { name: "Commando", cost: 75 },
  { name: "Pathfinder", cost: 100 },
  { name: "Sniper", cost: 100 },
  { name: "Grenadier", cost: 100 },
  { name: "Burner", cost: 100 },
  { name: "Gunner", cost: 100 },
  { name: "Armoured Trooper", cost: 150 }
];

const equipmentData = window.equipmentList || {
  equipment: [],
  weapons: [],
  armour: []
};

let state = {
  credits: BASE_CREDITS,
  soldiers: [],
  captain: null,
  firstMate: null,
  captainEquipment: [],
  firstMateEquipment: []
};

let captainChosen = { choose1: null, choose2: [] };
let firstMateChosen = { choose1: null, choose2: [] };
let captainSelectedPowers = [];
let firstMateSelectedPowers = [];

function $(id){ return document.getElementById(id); }
function deepCopy(obj){ return JSON.parse(JSON.stringify(obj)); }
function normalizeName(s){ return String(s || "").trim().toLowerCase(); }

function getBackground(name){
  return backgrounds.find(bg => bg.name === name) || null;
}

function isCorePower(bgName, powerName){
  const bg = getBackground(bgName);
  if(!bg) return false;
  return bg.core.some(x => normalizeName(x) === normalizeName(powerName));
}

function powerBaseInfo(powerName){
  return powers.find(p => normalizeName(p.name) === normalizeName(powerName)) || null;
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    state,
    captainChosen,
    firstMateChosen,
    captainSelectedPowers,
    firstMateSelectedPowers
  }));
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;

  try{
    const data = JSON.parse(raw);
    if(data.state) state = data.state;
    if(data.captainChosen) captainChosen = data.captainChosen;
    if(data.firstMateChosen) firstMateChosen = data.firstMateChosen;
    if(Array.isArray(data.captainSelectedPowers)) captainSelectedPowers = data.captainSelectedPowers;
    if(Array.isArray(data.firstMateSelectedPowers)) firstMateSelectedPowers = data.firstMateSelectedPowers;
  }catch(e){
    console.warn("Falha ao carregar storage:", e);
  }
}

function setCredits(n){
  state.credits = n;
  $("credits").textContent = String(state.credits);
  save();
}

function renderSoldierCount(){
  $("soldierCount").textContent = String(state.soldiers.length);
}

function statsToGrid(container, stats){
  container.innerHTML = "";
  ["Move","Fight","Shoot","Armour","Will","Health"].forEach(k=>{
    const div = document.createElement("div");
    div.className = "stat";

    const left = document.createElement("b");
    left.textContent = k;

    const right = document.createElement("span");
    const v = stats[k];
    right.textContent = (k === "Fight" || k === "Shoot" || k === "Will")
      ? (v >= 0 ? "+" + v : String(v))
      : String(v);

    div.appendChild(left);
    div.appendChild(right);
    container.appendChild(div);
  });
}

function computeFinalStats(baseStats, bgName, chosen){
  const bg = getBackground(bgName);
  const out = deepCopy(baseStats);
  if(!bg) return out;

  const sm = bg.statMods || {};

  if(sm.Move) out.Move += sm.Move;
  if(sm.Fight) out.Fight += sm.Fight;
  if(sm.Shoot) out.Shoot += sm.Shoot;
  if(sm.Armour) out.Armour += sm.Armour;
  if(sm.Will) out.Will += sm.Will;
  if(sm.Health) out.Health += sm.Health;

  if(sm.choose1 && chosen.choose1) out[chosen.choose1] += 1;
  if(sm.choose2 && Array.isArray(chosen.choose2)) chosen.choose2.forEach(k => { out[k] += 1; });

  return out;
}

function activationCaptain(bgName, powerName){
  const p = powerBaseInfo(powerName);
  if(!p) return "—";
  return isCorePower(bgName, powerName) ? p.activation : (p.activation + 2);
}

function activationFirstMate(bgName, powerName){
  const p = powerBaseInfo(powerName);
  if(!p) return "—";
  return isCorePower(bgName, powerName) ? (p.activation + 2) : (p.activation + 4);
}

function powerDescription(name){
  const dict = window.powerDescriptions || {};
  return dict[name] || "Descrição não cadastrada ainda.";
}

function equipmentDescription(name){
  const dict = window.equipmentDescriptions || {};
  return dict[name] || "Descrição não cadastrada ainda.";
}

function tooltipEl(){ return $("globalTooltip"); }

function showTooltip(html, x, y){
  const tip = tooltipEl();
  tip.innerHTML = html;
  tip.classList.add("show");
  tip.setAttribute("aria-hidden", "false");

  tip.style.transform = "translate(0px, 0px)";
  const rect = tip.getBoundingClientRect();

  const padding = 14;
  let left = x + 14;
  let top = y + 14;

  const maxLeft = window.innerWidth - rect.width - padding;
  const maxTop = window.innerHeight - rect.height - padding;

  if(left > maxLeft) left = Math.max(padding, x - rect.width - 14);
  if(top > maxTop) top = Math.max(padding, y - rect.height - 14);

  tip.style.transform = "translate(" + left + "px, " + top + "px)";
}

function hideTooltip(){
  const tip = tooltipEl();
  tip.classList.remove("show");
  tip.setAttribute("aria-hidden", "true");
  tip.style.transform = "translate(-9999px, -9999px)";
  tip.innerHTML = "";
}

function makeHelpIcon(title, description, footerText){
  const help = document.createElement("span");
  help.className = "help";
  help.textContent = "?";

  let html =
    '<div style="font-weight:900; margin-bottom:6px;">' + title + '</div>' +
    '<div style="opacity:.88; margin-bottom:8px; white-space:pre-wrap;">' + description + '</div>';

  if(footerText){
    html += '<div style="opacity:.7; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace;">' +
      footerText +
      '</div>';
  }

  help.addEventListener("mouseenter", (e)=> showTooltip(html, e.clientX, e.clientY));
  help.addEventListener("mousemove", (e)=> showTooltip(html, e.clientX, e.clientY));
  help.addEventListener("mouseleave", ()=> hideTooltip());

  return help;
}

function makePowerHelpIcon(powerName){
  const base = powerBaseInfo(powerName);
  const footer = 'Base: ' + (base ? base.activation : "—") + ' • Strain: ' + (base ? base.strain : "—") + ' • ' + (base ? base.category : "—");
  return makeHelpIcon(powerName, powerDescription(powerName), footer);
}

function makeEquipmentHelpIcon(itemName){
  return makeHelpIcon(itemName, equipmentDescription(itemName), "");
}

function renderBackgroundOptions(selectEl){
  selectEl.innerHTML = "";
  backgrounds.forEach(bg=>{
    const opt = document.createElement("option");
    opt.value = bg.name;
    opt.textContent = bg.name;
    selectEl.appendChild(opt);
  });
}

function renderStatChoices(targetId, bgName, chosen, onChange){
  const bg = getBackground(bgName);
  const container = $(targetId);
  container.innerHTML = "";

  if(!bg){
    container.innerHTML = '<div class="muted small">Selecione um background.</div>';
    return;
  }

  const sm = bg.statMods || {};
  const fixedKeys = ["Move","Fight","Shoot","Armour","Will","Health"].filter(k => !!sm[k]);

  if(fixedKeys.length){
    const fixed = document.createElement("div");
    fixed.className = "choice-group";
    fixed.innerHTML = '<div class="choice-title">Fixos</div>';

    const row = document.createElement("div");
    row.className = "choice-row";

    fixedKeys.forEach(k=>{
      const pill = document.createElement("div");
      pill.className = "pill-option";
      pill.innerHTML = '<span>' + k + ' ' + (sm[k] >= 0 ? '+' + sm[k] : sm[k]) + '</span>';
      row.appendChild(pill);
    });

    fixed.appendChild(row);
    container.appendChild(fixed);
  }

  if(sm.choose1){
    const g = document.createElement("div");
    g.className = "choice-group";
    g.innerHTML = '<div class="choice-title">Escolha 1 (+1)</div>';

    const row = document.createElement("div");
    row.className = "choice-row";

    sm.choose1.forEach(opt=>{
      const label = document.createElement("label");
      label.className = "pill-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = targetId + "_choose1";
      input.checked = chosen.choose1 === opt;

      input.addEventListener("change", ()=>{
        chosen.choose1 = opt;
        onChange();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt + " +1"));
      row.appendChild(label);
    });

    g.appendChild(row);
    container.appendChild(g);
  }

  if(sm.choose2){
    const g = document.createElement("div");
    g.className = "choice-group";
    g.innerHTML = '<div class="choice-title">Escolha 2 (+1 cada)</div>';

    const row = document.createElement("div");
    row.className = "choice-row";

    sm.choose2.forEach(opt=>{
      const label = document.createElement("label");
      label.className = "pill-option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = chosen.choose2.indexOf(opt) >= 0;

      input.addEventListener("change", ()=>{
        if(input.checked){
          if(chosen.choose2.length >= 2){
            input.checked = false;
            alert("Você deve escolher exatamente 2 opções aqui.");
            return;
          }
          chosen.choose2.push(opt);
        }else{
          chosen.choose2 = chosen.choose2.filter(x => x !== opt);
        }
        onChange();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt + " +1"));
      row.appendChild(label);
    });

    g.appendChild(row);
    container.appendChild(g);
  }

  if(!fixedKeys.length && !sm.choose1 && !sm.choose2){
    container.innerHTML = '<div class="muted small">Sem modificações especiais.</div>';
  }
}

function sortedPowersForBackground(bgName, search, selectedArray){
  const q = normalizeName(search);
  const selectedSet = {};
  selectedArray.forEach(p => { selectedSet[normalizeName(p)] = true; });

  const filtered = [];
  powers.forEach(p=>{
    const pn = normalizeName(p.name);
    if(selectedSet[pn]) return;
    if(q && pn.indexOf(q) === -1) return;

    filtered.push({
      name: p.name,
      activation: p.activation,
      strain: p.strain,
      category: p.category,
      core: isCorePower(bgName, p.name)
    });
  });

  filtered.sort((a,b)=>{
    if(a.core !== b.core) return a.core ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return filtered;
}

/* EQUIPMENT */
function equipmentCategory(name){
  if((equipmentData.armour || []).some(x => x.name === name)) return "armour";
  if((equipmentData.weapons || []).some(x => x.name === name)) return "weapon";
  return "equipment";
}

function equipmentBadgeClass(type){
  if(type === "armour") return "badge-armour";
  if(type === "weapon") return "badge-weapon";
  return "badge-equipment";
}

function equipmentBadgeText(type){
  if(type === "armour") return "ARMOUR";
  if(type === "weapon") return "WEAPON";
  return "EQUIPMENT";
}

function allEquipmentMerged(){
  return [
    ...(equipmentData.equipment || []).map(x => ({ name: x.name, type: "equipment" })),
    ...(equipmentData.weapons || []).map(x => ({ name: x.name, type: "weapon" })),
    ...(equipmentData.armour || []).map(x => ({ name: x.name, type: "armour" }))
  ].sort((a,b)=> a.name.localeCompare(b.name));
}

function hasArmour(equipmentArray){
  return equipmentArray.some(x => x && equipmentCategory(x.name) === "armour");
}

function renderEquipmentList(targetId, owner){
  const el = $(targetId);
  el.innerHTML = "";

  const selected = owner === "captain" ? state.captainEquipment : state.firstMateEquipment;
  const selectedNames = selected.map(x => x.name);

  allEquipmentMerged().forEach(item=>{
    if(selectedNames.includes(item.name)) return;

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeEquipmentHelpIcon(item.name));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = item.name;

    const badge = document.createElement("span");
    badge.className = "badge-item " + equipmentBadgeClass(item.type);
    badge.textContent = equipmentBadgeText(item.type);
    name.appendChild(badge);

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn power-add";
    btn.textContent = "ADICIONAR";
    btn.addEventListener("click", ()=> addEquipmentToOwner(owner, item));

    row.appendChild(left);
    row.appendChild(btn);
    el.appendChild(row);
  });
}

function addEquipmentToOwner(owner, item){
  if(owner === "captain"){
    if(state.captainEquipment.length >= 6){
      alert("Captain só pode ter 6 equipamentos.");
      return;
    }
    if(item.type === "armour" && hasArmour(state.captainEquipment)){
      alert("Captain já possui um armour.");
      return;
    }
    state.captainEquipment.push({ name: item.name });
  }

  if(owner === "firstMate"){
    if(state.firstMateEquipment.length >= 5){
      alert("First Mate só pode ter 5 equipamentos.");
      return;
    }
    if(item.type === "armour" && hasArmour(state.firstMateEquipment)){
      alert("First Mate já possui um armour.");
      return;
    }
    state.firstMateEquipment.push({ name: item.name });
  }

  save();
  renderEquipmentAll();
  renderAll();
}

function removeEquipmentFromOwner(owner, itemName){
  if(owner === "captain"){
    state.captainEquipment = state.captainEquipment.filter(x => x.name !== itemName);
  }
  if(owner === "firstMate"){
    state.firstMateEquipment = state.firstMateEquipment.filter(x => x.name !== itemName);
  }

  save();
  renderEquipmentAll();
  renderAll();
}

function renderSelectedEquipment(owner, targetId){
  const out = $(targetId);
  out.innerHTML = "";

  const selected = owner === "captain" ? state.captainEquipment : state.firstMateEquipment;

  selected.forEach(item=>{
    const type = equipmentCategory(item.name);

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeEquipmentHelpIcon(item.name));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = item.name;

    const badge = document.createElement("span");
    badge.className = "badge-item " + equipmentBadgeClass(type);
    badge.textContent = equipmentBadgeText(type);
    name.appendChild(badge);

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn danger";
    btn.textContent = "REMOVER";
    btn.addEventListener("click", ()=> removeEquipmentFromOwner(owner, item.name));

    row.appendChild(left);
    row.appendChild(btn);
    out.appendChild(row);
  });
}

function renderEquipmentAll(){
  renderEquipmentList("captainEquipmentListAll", "captain");
  renderSelectedEquipment("captain", "captainSelectedEquipment");

  renderEquipmentList("firstMateEquipmentListAll", "firstMate");
  renderSelectedEquipment("firstMate", "firstMateSelectedEquipment");
}

/* VALIDATION */
function backgroundRequiresChoose1(bgName){
  const bg = getBackground(bgName);
  return !!(bg && bg.statMods && bg.statMods.choose1);
}

function backgroundRequiresChoose2(bgName){
  const bg = getBackground(bgName);
  return !!(bg && bg.statMods && bg.statMods.choose2);
}

function isStatSelectionComplete(bgName, chosen){
  if(backgroundRequiresChoose1(bgName) && !chosen.choose1) return false;
  if(backgroundRequiresChoose2(bgName) && (!Array.isArray(chosen.choose2) || chosen.choose2.length !== 2)) return false;
  return true;
}

function isCaptainReady(){
  const nameOk = normalizeName($("captainName").value).length > 0;
  const bgName = $("captainBackground").value;
  const statsOk = isStatSelectionComplete(bgName, captainChosen);

  const powersOk = captainSelectedPowers.length === 5;
  const coreNeed = parseInt($("captainCoreCount").value, 10);
  let coreCount = 0;
  captainSelectedPowers.forEach(p => { if(isCorePower(bgName, p)) coreCount++; });

  return nameOk && !!bgName && statsOk && powersOk && (coreCount === coreNeed);
}

function isFirstMateReady(){
  const nameOk = normalizeName($("firstMateName").value).length > 0;
  const bgName = $("firstMateBackground").value;
  const statsOk = isStatSelectionComplete(bgName, firstMateChosen);

  const powersOk = firstMateSelectedPowers.length === 4;
  const coreNeed = parseInt($("firstMateCoreCount").value, 10);
  let coreCount = 0;
  firstMateSelectedPowers.forEach(p => { if(isCorePower(bgName, p)) coreCount++; });

  return nameOk && !!bgName && statsOk && powersOk && (coreCount === coreNeed);
}

function updateAddButtons(){
  $("addCaptainBtn").disabled = (!isCaptainReady() || !!state.captain);
  $("addFirstMateBtn").disabled = (!isFirstMateReady() || !!state.firstMate);
}

/* CAPTAIN */
function renderCaptainAll(){
  const bgName = $("captainBackground").value;

  renderStatChoices("captainStatChoices", bgName, captainChosen, ()=>{
    save();
    renderCaptainAll();
  });

  statsToGrid($("captainBaseStats"), captainBase);
  statsToGrid($("captainFinalStats"), computeFinalStats(captainBase, bgName, captainChosen));

  renderCaptainPowerList();
  renderCaptainSelectedList();
  updateAddButtons();
}

function renderCaptainPowerList(){
  const bgName = $("captainBackground").value;
  const search = $("captainPowerSearch").value;
  const listEl = $("captainPowerList");
  listEl.innerHTML = "";

  const list = sortedPowersForBackground(bgName, search, captainSelectedPowers);

  list.forEach(p=>{
    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makePowerHelpIcon(p.name));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = p.name;

    if(p.core){
      const badge = document.createElement("span");
      badge.className = "badge-core";
      badge.textContent = "CORE";
      name.appendChild(badge);
    }

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn power-add";
    btn.textContent = "ADICIONAR";
    btn.addEventListener("click", ()=>{
      if(captainSelectedPowers.length >= 5){
        alert("Captain só pode ter 5 powers.");
        return;
      }
      captainSelectedPowers.push(p.name);
      save();
      renderCaptainAll();
    });

    row.appendChild(left);
    row.appendChild(btn);
    listEl.appendChild(row);
  });
}

function renderCaptainSelectedList(){
  const bgName = $("captainBackground").value;
  const out = $("captainSelectedPowers");
  out.innerHTML = "";

  captainSelectedPowers.forEach(pn=>{
    const core = isCorePower(bgName, pn);

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makePowerHelpIcon(pn));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = pn;

    if(core){
      const badge = document.createElement("span");
      badge.className = "badge-core";
      badge.textContent = "CORE";
      name.appendChild(badge);
    }

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn danger";
    btn.textContent = "REMOVER";
    btn.addEventListener("click", ()=>{
      captainSelectedPowers = captainSelectedPowers.filter(x => x !== pn);
      save();
      renderCaptainAll();
    });

    row.appendChild(left);
    row.appendChild(btn);
    out.appendChild(row);
  });
}

/* FIRST MATE */
function renderFirstMateAll(){
  const bgName = $("firstMateBackground").value;

  renderStatChoices("firstMateStatChoices", bgName, firstMateChosen, ()=>{
    save();
    renderFirstMateAll();
  });

  statsToGrid($("firstMateBaseStats"), firstMateBase);
  statsToGrid($("firstMateFinalStats"), computeFinalStats(firstMateBase, bgName, firstMateChosen));

  renderFirstMatePowerList();
  renderFirstMateSelectedList();
  updateAddButtons();
}

function renderFirstMatePowerList(){
  const bgName = $("firstMateBackground").value;
  const search = $("firstMatePowerSearch").value;
  const listEl = $("firstMatePowerList");
  listEl.innerHTML = "";

  const list = sortedPowersForBackground(bgName, search, firstMateSelectedPowers);

  list.forEach(p=>{
    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makePowerHelpIcon(p.name));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = p.name;

    if(p.core){
      const badge = document.createElement("span");
      badge.className = "badge-core";
      badge.textContent = "CORE";
      name.appendChild(badge);
    }

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn power-add";
    btn.textContent = "ADICIONAR";
    btn.addEventListener("click", ()=>{
      if(firstMateSelectedPowers.length >= 4){
        alert("First Mate só pode ter 4 powers.");
        return;
      }
      firstMateSelectedPowers.push(p.name);
      save();
      renderFirstMateAll();
    });

    row.appendChild(left);
    row.appendChild(btn);
    listEl.appendChild(row);
  });
}

function renderFirstMateSelectedList(){
  const bgName = $("firstMateBackground").value;
  const out = $("firstMateSelectedPowers");
  out.innerHTML = "";

  firstMateSelectedPowers.forEach(pn=>{
    const core = isCorePower(bgName, pn);

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makePowerHelpIcon(pn));

    const name = document.createElement("div");
    name.className = "power-name";
    name.textContent = pn;

    if(core){
      const badge = document.createElement("span");
      badge.className = "badge-core";
      badge.textContent = "CORE";
      name.appendChild(badge);
    }

    left.appendChild(name);

    const btn = document.createElement("button");
    btn.className = "btn danger";
    btn.textContent = "REMOVER";
    btn.addEventListener("click", ()=>{
      firstMateSelectedPowers = firstMateSelectedPowers.filter(x => x !== pn);
      save();
      renderFirstMateAll();
    });

    row.appendChild(left);
    row.appendChild(btn);
    out.appendChild(row);
  });
}

function addCaptainToSquad(){
  if(!isCaptainReady()){
    alert("Preencha todos os requisitos do Captain antes de adicionar.");
    return;
  }
  if(state.captain) return;

  const name = $("captainName").value.trim();
  const bgName = $("captainBackground").value;
  const finalStats = computeFinalStats(captainBase, bgName, captainChosen);

  const powersList = captainSelectedPowers.map(pn => ({
    name: pn,
    activation: activationCaptain(bgName, pn),
    strain: powerBaseInfo(pn) ? powerBaseInfo(pn).strain : "—",
    core: isCorePower(bgName, pn)
  }));

  state.captain = {
    name,
    background: bgName,
    statsFinal: finalStats,
    powers: powersList
  };

  save();
  renderAll();
  $("captainSection").style.display = "none";
}

function addFirstMateToSquad(){
  if(!isFirstMateReady()){
    alert("Preencha todos os requisitos do First Mate antes de adicionar.");
    return;
  }
  if(state.firstMate) return;

  const name = $("firstMateName").value.trim();
  const bgName = $("firstMateBackground").value;
  const finalStats = computeFinalStats(firstMateBase, bgName, firstMateChosen);

  const powersList = firstMateSelectedPowers.map(pn => ({
    name: pn,
    activation: activationFirstMate(bgName, pn),
    strain: powerBaseInfo(pn) ? powerBaseInfo(pn).strain : "—",
    core: isCorePower(bgName, pn)
  }));

  state.firstMate = {
    name,
    background: bgName,
    statsFinal: finalStats,
    powers: powersList
  };

  save();
  renderAll();
  $("firstMateSection").style.display = "none";
}

/* SOLDIERS */
function renderSoldierCatalog(){
  const wrap = $("soldierCatalog");
  wrap.innerHTML = "";

  soldierCatalog.forEach(u=>{
    const row = document.createElement("div");
    row.className = "unit-row";

    const left = document.createElement("div");

    const name = document.createElement("div");
    name.className = "unit-name";
    name.textContent = u.name;

    const cost = document.createElement("div");
    cost.className = "unit-cost";
    cost.textContent = "(" + u.cost + "cr)";

    left.appendChild(name);
    left.appendChild(cost);

    const btn = document.createElement("button");
    btn.className = "btn primary";
    btn.textContent = "ADICIONAR";
    btn.addEventListener("click", ()=>{
      if(state.soldiers.length >= MAX_SOLDIERS){
        alert("Limite de 8 soldados atingido.");
        return;
      }
      if(state.credits < u.cost){
        alert("Créditos insuficientes.");
        return;
      }
      state.soldiers.push({ name: u.name, cost: u.cost });
      setCredits(state.credits - u.cost);
      save();
      renderAll();
    });

    row.appendChild(left);
    row.appendChild(btn);
    wrap.appendChild(row);
  });
}

/* SQUAD */
function gearSummaryForOwner(owner){
  const arr = owner === "captain" ? state.captainEquipment : state.firstMateEquipment;
  return arr.length ? arr.map(x => x.name).join(", ") : "<span class='muted'>[vazio]</span>";
}

function renderCaptainSlot(){
  const body = $("captainSlotBody");
  body.innerHTML = "";

  if(!state.captain) return;

  const card = document.createElement("div");
  card.className = "squad-card-item";

  const head = document.createElement("div");
  head.className = "item-head";

  const left = document.createElement("div");

  const title = document.createElement("div");
  title.className = "item-title";
  title.textContent = state.captain.name + " • " + state.captain.background;

  const sub = document.createElement("div");
  sub.className = "item-sub";
  const s = state.captain.statsFinal;
  sub.textContent =
    "Move " + s.Move +
    " | Fight +" + s.Fight +
    " | Shoot +" + s.Shoot +
    " | Armour " + s.Armour +
    " | Will +" + s.Will +
    " | Health " + s.Health;

  left.appendChild(title);
  left.appendChild(sub);

  const btn = document.createElement("button");
  btn.className = "btn danger";
  btn.textContent = "REMOVER";
  btn.addEventListener("click", ()=>{
    state.captain = null;
    save();
    $("captainSection").style.display = "";
    renderAll();
  });

  head.appendChild(left);
  head.appendChild(btn);

  const pows = document.createElement("div");
  pows.className = "item-powers";
  pows.innerHTML = "<b>Powers:</b> " + state.captain.powers.map(p=> p.name + " (" + p.activation + ")").join(", ");

  const gear = document.createElement("div");
  gear.className = "item-gear";
  gear.innerHTML = "<b>Equip:</b> " + gearSummaryForOwner("captain");

  card.appendChild(head);
  card.appendChild(pows);
  card.appendChild(gear);
  body.appendChild(card);
}

function renderFirstMateSlot(){
  const body = $("firstMateSlotBody");
  body.innerHTML = "";

  if(!state.firstMate) return;

  const card = document.createElement("div");
  card.className = "squad-card-item";

  const head = document.createElement("div");
  head.className = "item-head";

  const left = document.createElement("div");

  const title = document.createElement("div");
  title.className = "item-title";
  title.textContent = state.firstMate.name + " • " + state.firstMate.background;

  const sub = document.createElement("div");
  sub.className = "item-sub";
  const s = state.firstMate.statsFinal;
  sub.textContent =
    "Move " + s.Move +
    " | Fight +" + s.Fight +
    " | Shoot +" + s.Shoot +
    " | Armour " + s.Armour +
    " | Will +" + s.Will +
    " | Health " + s.Health;

  left.appendChild(title);
  left.appendChild(sub);

  const btn = document.createElement("button");
  btn.className = "btn danger";
  btn.textContent = "REMOVER";
  btn.addEventListener("click", ()=>{
    state.firstMate = null;
    save();
    $("firstMateSection").style.display = "";
    renderAll();
  });

  head.appendChild(left);
  head.appendChild(btn);

  const pows = document.createElement("div");
  pows.className = "item-powers";
  pows.innerHTML = "<b>Powers:</b> " + state.firstMate.powers.map(p=> p.name + " (" + p.activation + ")").join(", ");

  const gear = document.createElement("div");
  gear.className = "item-gear";
  gear.innerHTML = "<b>Equip:</b> " + gearSummaryForOwner("firstMate");

  card.appendChild(head);
  card.appendChild(pows);
  card.appendChild(gear);
  body.appendChild(card);
}

function renderSoldierSlots(){
  for(let i=1;i<=8;i++){
    const slot = $("slot" + i);
    const body = slot.querySelector(".slot-body");
    body.innerHTML = "";

    const soldier = state.soldiers[i-1];
    if(!soldier) continue;

    const card = document.createElement("div");
    card.className = "squad-card-item";

    const head = document.createElement("div");
    head.className = "item-head";

    const left = document.createElement("div");

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = soldier.name;

    const sub = document.createElement("div");
    sub.className = "item-sub";
    sub.textContent = "Custo: " + soldier.cost + "cr";

    left.appendChild(title);
    left.appendChild(sub);

    const btn = document.createElement("button");
    btn.className = "btn danger";
    btn.textContent = "REMOVER";
    btn.addEventListener("click", ()=>{
      state.soldiers.splice(i-1, 1);
      setCredits(state.credits + soldier.cost);
      save();
      renderAll();
    });

    head.appendChild(left);
    head.appendChild(btn);

    card.appendChild(head);
    body.appendChild(card);
  }
}

function renderAll(){
  $("credits").textContent = String(state.credits);
  renderSoldierCount();

  $("captainSection").style.display = state.captain ? "none" : "";
  $("firstMateSection").style.display = state.firstMate ? "none" : "";

  renderCaptainSlot();
  renderFirstMateSlot();
  renderSoldierSlots();

  updateAddButtons();
}

function resetAll(){
  const ok = confirm("Resetar tudo? Isso limpa Captain, First Mate, Equipment, Soldiers e créditos.");
  if(!ok) return;

  state = {
    credits: BASE_CREDITS,
    soldiers: [],
    captain: null,
    firstMate: null,
    captainEquipment: [],
    firstMateEquipment: []
  };

  captainChosen = { choose1: null, choose2: [] };
  firstMateChosen = { choose1: null, choose2: [] };
  captainSelectedPowers = [];
  firstMateSelectedPowers = [];

  localStorage.removeItem(STORAGE_KEY);

  $("captainName").value = "";
  $("captainPowerSearch").value = "";
  $("firstMateName").value = "";
  $("firstMatePowerSearch").value = "";

  $("captainSection").style.display = "";
  $("firstMateSection").style.display = "";

  hideTooltip();
  renderCaptainAll();
  renderFirstMateAll();
  renderEquipmentAll();
  renderAll();
}

function init(){
  load();

  renderBackgroundOptions($("captainBackground"));
  renderBackgroundOptions($("firstMateBackground"));

  statsToGrid($("captainBaseStats"), captainBase);
  statsToGrid($("firstMateBaseStats"), firstMateBase);

  $("captainName").addEventListener("input", updateAddButtons);
  $("captainBackground").addEventListener("change", ()=>{
    captainChosen = { choose1: null, choose2: [] };
    captainSelectedPowers = [];
    $("captainPowerSearch").value = "";
    save();
    renderCaptainAll();
  });
  $("captainCoreCount").addEventListener("change", ()=>{
    save();
    renderCaptainAll();
  });
  $("captainPowerSearch").addEventListener("input", ()=>{
    renderCaptainPowerList();
    updateAddButtons();
  });
  $("addCaptainBtn").addEventListener("click", addCaptainToSquad);

  $("firstMateName").addEventListener("input", updateAddButtons);
  $("firstMateBackground").addEventListener("change", ()=>{
    firstMateChosen = { choose1: null, choose2: [] };
    firstMateSelectedPowers = [];
    $("firstMatePowerSearch").value = "";
    save();
    renderFirstMateAll();
  });
  $("firstMateCoreCount").addEventListener("change", ()=>{
    save();
    renderFirstMateAll();
  });
  $("firstMatePowerSearch").addEventListener("input", ()=>{
    renderFirstMatePowerList();
    updateAddButtons();
  });
  $("addFirstMateBtn").addEventListener("click", addFirstMateToSquad);

  $("resetBtn").addEventListener("click", resetAll);

  renderSoldierCatalog();
  renderCaptainAll();
  renderFirstMateAll();
  renderEquipmentAll();
  renderAll();

  window.addEventListener("scroll", ()=> hideTooltip(), { passive: true });
  window.addEventListener("resize", ()=> hideTooltip(), { passive: true });
}

init();