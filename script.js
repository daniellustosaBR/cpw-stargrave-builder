// script.js (versão estável)
// - Lê descrições de: power-descriptions.js (window.powerDescriptions)
// - Tooltip global flutuante (não é cortado por overflow)
// - Powers List / Selecionados funcionam com remover e retorno à lista
// - Botões ADICIONAR habilitam só quando requisitos completos
// - Captain (5 powers, 3 ou 4 core) / First Mate (4 powers, 2 ou 3 core)

const STORAGE_KEY = "cpw_stargrave_builder_v6";

const BASE_CREDITS = 400;
const MAX_SOLDIERS = 8;

// =========================
// DATA (BASE)
// =========================
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

// =========================
// STATE
// =========================
let state = { credits: BASE_CREDITS, soldiers: [], captain: null, firstMate: null };

let captainChosen = { choose1: null, choose2: [] };
let firstMateChosen = { choose1: null, choose2: [] };

let captainSelectedPowers = [];
let firstMateSelectedPowers = [];

// =========================
// HELPERS
// =========================
function $(id){ return document.getElementById(id); }
function deepCopy(obj){ return JSON.parse(JSON.stringify(obj)); }
function normalizeName(s){ return String(s || "").trim().toLowerCase(); }

function getBackground(name){
  for(let i=0;i<backgrounds.length;i++){
    if(backgrounds[i].name === name) return backgrounds[i];
  }
  return null;
}

function isCorePower(bgName, powerName){
  const bg = getBackground(bgName);
  if(!bg) return false;
  const pn = normalizeName(powerName);
  for(let i=0;i<bg.core.length;i++){
    if(normalizeName(bg.core[i]) === pn) return true;
  }
  return false;
}

function powerBaseInfo(powerName){
  const pn = normalizeName(powerName);
  for(let i=0;i<powers.length;i++){
    if(normalizeName(powers[i].name) === pn) return powers[i];
  }
  return null;
}

// =========================
// STORAGE
// =========================
function save(){
  const payload = {
    state,
    captainChosen,
    firstMateChosen,
    captainSelectedPowers,
    firstMateSelectedPowers
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;

  try{
    const data = JSON.parse(raw);
    if(data && data.state) state = data.state;
    if(data && data.captainChosen) captainChosen = data.captainChosen;
    if(data && data.firstMateChosen) firstMateChosen = data.firstMateChosen;
    if(data && Array.isArray(data.captainSelectedPowers)) captainSelectedPowers = data.captainSelectedPowers;
    if(data && Array.isArray(data.firstMateSelectedPowers)) firstMateSelectedPowers = data.firstMateSelectedPowers;
  }catch(e){
    console.warn("Falha ao carregar storage:", e);
  }
}

// =========================
// UI: Credits / Counters
// =========================
function setCredits(n){
  state.credits = n;
  $("credits").textContent = String(state.credits);
  save();
}

function renderSoldierCount(){
  $("soldierCount").textContent = String(state.soldiers.length);
}

// =========================
// STATS
// =========================
function statsToGrid(container, stats){
  container.innerHTML = "";

  const order = ["Move","Fight","Shoot","Armour","Will","Health"];
  for(let i=0;i<order.length;i++){
    const k = order[i];
    const v = stats[k];

    const div = document.createElement("div");
    div.className = "stat";

    const left = document.createElement("b");
    left.textContent = k;

    const right = document.createElement("span");
    if(k === "Fight" || k === "Shoot" || k === "Will"){
      right.textContent = (v >= 0 ? ("+" + v) : String(v));
    }else{
      right.textContent = String(v);
    }

    div.appendChild(left);
    div.appendChild(right);
    container.appendChild(div);
  }
}

function computeFinalStats(baseStats, bgName, chosen){
  const bg = getBackground(bgName);
  const out = deepCopy(baseStats);

  if(!bg) return out;
  const sm = bg.statMods || {};

  // fixos
  if(sm.Move) out.Move += sm.Move;
  if(sm.Fight) out.Fight += sm.Fight;
  if(sm.Shoot) out.Shoot += sm.Shoot;
  if(sm.Armour) out.Armour += sm.Armour;
  if(sm.Will) out.Will += sm.Will;
  if(sm.Health) out.Health += sm.Health;

  // choose1
  if(sm.choose1 && chosen && chosen.choose1){
    out[chosen.choose1] += 1;
  }

  // choose2
  if(sm.choose2 && chosen && Array.isArray(chosen.choose2)){
    for(let i=0;i<chosen.choose2.length;i++){
      out[chosen.choose2[i]] += 1;
    }
  }

  return out;
}

// =========================
// Activation rules
// =========================
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

// =========================
// DESCRIÇÕES (PROFISSIONAL)
// =========================
function powerDescription(name){
  const dict = window.powerDescriptions || {};
  return dict[name] || "Descrição não cadastrada ainda.";
}

// =========================
// Tooltip global
// =========================
function tooltipEl(){ return $("globalTooltip"); }

function showTooltip(html, x, y){
  const tip = tooltipEl();
  tip.innerHTML = html;
  tip.classList.add("show");
  tip.setAttribute("aria-hidden", "false");

  // primeiro posiciona, depois mede
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

function makeHelpIcon(powerName){
  const help = document.createElement("span");
  help.className = "help";
  help.textContent = "?";

  const base = powerBaseInfo(powerName);
  const desc = powerDescription(powerName);

  const html =
    '<div style="font-weight:900; margin-bottom:6px;">' + powerName + '</div>' +
    '<div style="opacity:.88; margin-bottom:8px; white-space:pre-wrap;">' + desc + '</div>' +
    '<div style="opacity:.7; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \'Liberation Mono\', \'Courier New\', monospace;">' +
      'Base: ' + (base ? base.activation : "—") + ' • Strain: ' + (base ? base.strain : "—") + ' • ' + (base ? base.category : "—") +
    '</div>';

  help.addEventListener("mouseenter", function(e){
    showTooltip(html, e.clientX, e.clientY);
  });
  help.addEventListener("mousemove", function(e){
    showTooltip(html, e.clientX, e.clientY);
  });
  help.addEventListener("mouseleave", function(){
    hideTooltip();
  });

  return help;
}

// =========================
// Background select
// =========================
function renderBackgroundOptions(selectEl){
  selectEl.innerHTML = "";
  for(let i=0;i<backgrounds.length;i++){
    const bg = backgrounds[i];
    const opt = document.createElement("option");
    opt.value = bg.name;
    opt.textContent = bg.name;
    selectEl.appendChild(opt);
  }
}

// =========================
// Stat Mod UI
// =========================
function renderStatChoices(targetId, bgName, chosen, onChange){
  const bg = getBackground(bgName);
  const container = $(targetId);
  container.innerHTML = "";

  if(!bg){
    container.innerHTML = '<div class="muted small">Selecione um background.</div>';
    return;
  }

  const sm = bg.statMods || {};
  const fixedKeys = ["Move","Fight","Shoot","Armour","Will","Health"].filter(function(k){ return !!sm[k]; });

  if(fixedKeys.length){
    const fixed = document.createElement("div");
    fixed.className = "choice-group";
    fixed.innerHTML = '<div class="choice-title">Fixos</div>';
    const row = document.createElement("div");
    row.className = "choice-row";

    for(let i=0;i<fixedKeys.length;i++){
      const k = fixedKeys[i];
      const pill = document.createElement("div");
      pill.className = "pill-option";
      pill.innerHTML = "<span>" + k + " " + (sm[k] >= 0 ? ("+" + sm[k]) : sm[k]) + "</span>";
      row.appendChild(pill);
    }

    fixed.appendChild(row);
    container.appendChild(fixed);
  }

  // choose1
  if(sm.choose1){
    const g = document.createElement("div");
    g.className = "choice-group";
    g.innerHTML = '<div class="choice-title">Escolha 1 (+1)</div>';

    const row = document.createElement("div");
    row.className = "choice-row";

    for(let i=0;i<sm.choose1.length;i++){
      const opt = sm.choose1[i];

      const label = document.createElement("label");
      label.className = "pill-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = targetId + "_choose1";
      input.checked = (chosen.choose1 === opt);

      input.addEventListener("change", function(){
        chosen.choose1 = opt;
        onChange();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt + " +1"));
      row.appendChild(label);
    }

    g.appendChild(row);
    container.appendChild(g);
  }

  // choose2
  if(sm.choose2){
    const g = document.createElement("div");
    g.className = "choice-group";
    g.innerHTML = '<div class="choice-title">Escolha 2 (+1 cada)</div>';

    const row = document.createElement("div");
    row.className = "choice-row";

    for(let i=0;i<sm.choose2.length;i++){
      const opt = sm.choose2[i];

      const label = document.createElement("label");
      label.className = "pill-option";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = (chosen.choose2.indexOf(opt) >= 0);

      input.addEventListener("change", function(){
        if(input.checked){
          if(chosen.choose2.length >= 2){
            input.checked = false;
            alert("Você deve escolher exatamente 2 opções aqui.");
            return;
          }
          chosen.choose2.push(opt);
        }else{
          chosen.choose2 = chosen.choose2.filter(function(x){ return x !== opt; });
        }
        onChange();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(opt + " +1"));
      row.appendChild(label);
    }

    g.appendChild(row);
    container.appendChild(g);
  }

  if(!fixedKeys.length && !sm.choose1 && !sm.choose2){
    container.innerHTML = '<div class="muted small">Sem modificações especiais.</div>';
  }
}

// =========================
// Powers list sorting
// =========================
function sortedPowersForBackground(bgName, search, selectedArray){
  const q = normalizeName(search);
  const selectedSet = {};
  for(let i=0;i<selectedArray.length;i++){
    selectedSet[normalizeName(selectedArray[i])] = true;
  }

  // filtra
  const filtered = [];
  for(let i=0;i<powers.length;i++){
    const p = powers[i];
    const pn = normalizeName(p.name);

    if(selectedSet[pn]) continue;
    if(q && normalizeName(p.name).indexOf(q) === -1) continue;

    filtered.push({
      name: p.name,
      activation: p.activation,
      strain: p.strain,
      category: p.category,
      core: isCorePower(bgName, p.name)
    });
  }

  // ordena core primeiro, depois alfabético
  filtered.sort(function(a,b){
    if(a.core !== b.core) return a.core ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return filtered;
}

// =========================
// Validation (enable buttons)
// =========================
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
  for(let i=0;i<captainSelectedPowers.length;i++){
    if(isCorePower(bgName, captainSelectedPowers[i])) coreCount++;
  }

  return nameOk && !!bgName && statsOk && powersOk && (coreCount === coreNeed);
}

function isFirstMateReady(){
  const nameOk = normalizeName($("firstMateName").value).length > 0;
  const bgName = $("firstMateBackground").value;
  const statsOk = isStatSelectionComplete(bgName, firstMateChosen);

  const powersOk = firstMateSelectedPowers.length === 4;
  const coreNeed = parseInt($("firstMateCoreCount").value, 10);
  let coreCount = 0;
  for(let i=0;i<firstMateSelectedPowers.length;i++){
    if(isCorePower(bgName, firstMateSelectedPowers[i])) coreCount++;
  }

  return nameOk && !!bgName && statsOk && powersOk && (coreCount === coreNeed);
}

function updateAddButtons(){
  $("addCaptainBtn").disabled = (!isCaptainReady() || !!state.captain);
  $("addFirstMateBtn").disabled = (!isFirstMateReady() || !!state.firstMate);
}

// =========================
// Captain rendering
// =========================
function renderCaptainAll(){
  const bgName = $("captainBackground").value;

  // stat choices
  renderStatChoices("captainStatChoices", bgName, captainChosen, function(){
    save();
    renderCaptainAll();
  });

  // stats grids
  statsToGrid($("captainBaseStats"), captainBase);
  const finalStats = computeFinalStats(captainBase, bgName, captainChosen);
  statsToGrid($("captainFinalStats"), finalStats);

  // power lists
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

  for(let i=0;i<list.length;i++){
    const p = list[i];

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeHelpIcon(p.name));

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
    btn.addEventListener("click", (function(powerName){
      return function(){
        if(captainSelectedPowers.length >= 5){
          alert("Captain só pode ter 5 powers.");
          return;
        }
        captainSelectedPowers.push(powerName);
        save();
        renderCaptainAll();
      };
    })(p.name));

    row.appendChild(left);
    row.appendChild(btn);
    listEl.appendChild(row);
  }
}

function renderCaptainSelectedList(){
  const bgName = $("captainBackground").value;
  const out = $("captainSelectedPowers");
  out.innerHTML = "";

  for(let i=0;i<captainSelectedPowers.length;i++){
    const pn = captainSelectedPowers[i];
    const core = isCorePower(bgName, pn);

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeHelpIcon(pn));

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
    btn.addEventListener("click", (function(powerName){
      return function(){
        captainSelectedPowers = captainSelectedPowers.filter(function(x){ return x !== powerName; });
        save();
        renderCaptainAll();
      };
    })(pn));

    row.appendChild(left);
    row.appendChild(btn);
    out.appendChild(row);
  }
}

// =========================
// First Mate rendering
// =========================
function renderFirstMateAll(){
  const bgName = $("firstMateBackground").value;

  renderStatChoices("firstMateStatChoices", bgName, firstMateChosen, function(){
    save();
    renderFirstMateAll();
  });

  statsToGrid($("firstMateBaseStats"), firstMateBase);
  const finalStats = computeFinalStats(firstMateBase, bgName, firstMateChosen);
  statsToGrid($("firstMateFinalStats"), finalStats);

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

  for(let i=0;i<list.length;i++){
    const p = list[i];

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeHelpIcon(p.name));

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
    btn.addEventListener("click", (function(powerName){
      return function(){
        if(firstMateSelectedPowers.length >= 4){
          alert("First Mate só pode ter 4 powers.");
          return;
        }
        firstMateSelectedPowers.push(powerName);
        save();
        renderFirstMateAll();
      };
    })(p.name));

    row.appendChild(left);
    row.appendChild(btn);
    listEl.appendChild(row);
  }
}

function renderFirstMateSelectedList(){
  const bgName = $("firstMateBackground").value;
  const out = $("firstMateSelectedPowers");
  out.innerHTML = "";

  for(let i=0;i<firstMateSelectedPowers.length;i++){
    const pn = firstMateSelectedPowers[i];
    const core = isCorePower(bgName, pn);

    const row = document.createElement("div");
    row.className = "power-item";

    const left = document.createElement("div");
    left.className = "power-left";

    left.appendChild(makeHelpIcon(pn));

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
    btn.addEventListener("click", (function(powerName){
      return function(){
        firstMateSelectedPowers = firstMateSelectedPowers.filter(function(x){ return x !== powerName; });
        save();
        renderFirstMateAll();
      };
    })(pn));

    row.appendChild(left);
    row.appendChild(btn);
    out.appendChild(row);
  }
}

// =========================
// Add Captain / First Mate
// =========================
function addCaptainToSquad(){
  if(!isCaptainReady()){
    alert("Preencha todos os requisitos do Captain antes de adicionar.");
    return;
  }
  if(state.captain) return;

  const name = $("captainName").value.trim();
  const bgName = $("captainBackground").value;
  const finalStats = computeFinalStats(captainBase, bgName, captainChosen);
  const gear = $("captainGear").value.trim();

  const list = [];
  for(let i=0;i<captainSelectedPowers.length;i++){
    const pn = captainSelectedPowers[i];
    const base = powerBaseInfo(pn);
    list.push({
      name: pn,
      activation: activationCaptain(bgName, pn),
      strain: base ? base.strain : "—",
      core: isCorePower(bgName, pn)
    });
  }

  state.captain = { name, background: bgName, statsFinal: finalStats, powers: list, gear: gear };

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
  const gear = $("firstMateGear").value.trim();

  const list = [];
  for(let i=0;i<firstMateSelectedPowers.length;i++){
    const pn = firstMateSelectedPowers[i];
    const base = powerBaseInfo(pn);
    list.push({
      name: pn,
      activation: activationFirstMate(bgName, pn),
      strain: base ? base.strain : "—",
      core: isCorePower(bgName, pn)
    });
  }

  state.firstMate = { name, background: bgName, statsFinal: finalStats, powers: list, gear: gear };

  save();
  renderAll();
  $("firstMateSection").style.display = "none";
}

// =========================
// Soldiers catalog
// =========================
function renderSoldierCatalog(){
  const wrap = $("soldierCatalog");
  wrap.innerHTML = "";

  for(let i=0;i<soldierCatalog.length;i++){
    const u = soldierCatalog[i];

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
    btn.addEventListener("click", (function(unit){
      return function(){
        if(state.soldiers.length >= MAX_SOLDIERS){
          alert("Limite de 8 soldados atingido.");
          return;
        }
        if(state.credits < unit.cost){
          alert("Créditos insuficientes.");
          return;
        }
        state.soldiers.push({ name: unit.name, cost: unit.cost });
        setCredits(state.credits - unit.cost);
        save();
        renderAll();
      };
    })(u));

    row.appendChild(left);
    row.appendChild(btn);
    wrap.appendChild(row);
  }
}

// =========================
// Squad UI
// =========================
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
  btn.addEventListener("click", function(){
    state.captain = null;
    save();
    $("captainSection").style.display = "";
    renderAll();
  });

  head.appendChild(left);
  head.appendChild(btn);

  const pows = document.createElement("div");
  pows.className = "item-powers";
  let powText = [];
  for(let i=0;i<state.captain.powers.length;i++){
    powText.push(state.captain.powers[i].name + " (" + state.captain.powers[i].activation + ")");
  }
  pows.innerHTML = "<b>Powers:</b> " + powText.join(", ");

  const gear = document.createElement("div");
  gear.className = "item-gear";
  gear.innerHTML = "<b>Equip:</b> " + (state.captain.gear ? state.captain.gear : "<span class='muted'>[vazio]</span>");

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
  btn.addEventListener("click", function(){
    state.firstMate = null;
    save();
    $("firstMateSection").style.display = "";
    renderAll();
  });

  head.appendChild(left);
  head.appendChild(btn);

  const pows = document.createElement("div");
  pows.className = "item-powers";
  let powText = [];
  for(let i=0;i<state.firstMate.powers.length;i++){
    powText.push(state.firstMate.powers[i].name + " (" + state.firstMate.powers[i].activation + ")");
  }
  pows.innerHTML = "<b>Powers:</b> " + powText.join(", ");

  const gear = document.createElement("div");
  gear.className = "item-gear";
  gear.innerHTML = "<b>Equip:</b> " + (state.firstMate.gear ? state.firstMate.gear : "<span class='muted'>[vazio]</span>");

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
    btn.addEventListener("click", (function(index, refund){
      return function(){
        state.soldiers.splice(index, 1);
        setCredits(state.credits + refund);
        save();
        renderAll();
      };
    })(i-1, soldier.cost));

    head.appendChild(left);
    head.appendChild(btn);

    card.appendChild(head);
    body.appendChild(card);
  }
}

// =========================
// Render all
// =========================
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

// =========================
// Reset
// =========================
function resetAll(){
  const ok = confirm("Resetar tudo? Isso limpa Captain, First Mate, Soldiers e créditos.");
  if(!ok) return;

  state = { credits: BASE_CREDITS, soldiers: [], captain: null, firstMate: null };
  captainChosen = { choose1: null, choose2: [] };
  firstMateChosen = { choose1: null, choose2: [] };
  captainSelectedPowers = [];
  firstMateSelectedPowers = [];

  localStorage.removeItem(STORAGE_KEY);

  $("captainName").value = "";
  $("captainGear").value = "";
  $("captainPowerSearch").value = "";

  $("firstMateName").value = "";
  $("firstMateGear").value = "";
  $("firstMatePowerSearch").value = "";

  $("captainSection").style.display = "";
  $("firstMateSection").style.display = "";

  hideTooltip();

  renderCaptainAll();
  renderFirstMateAll();
  renderAll();
}

// =========================
// Init
// =========================
function init(){
  load();

  // background selects
  renderBackgroundOptions($("captainBackground"));
  renderBackgroundOptions($("firstMateBackground"));

  // initial grids
  statsToGrid($("captainBaseStats"), captainBase);
  statsToGrid($("firstMateBaseStats"), firstMateBase);

  // listeners (Captain)
  $("captainName").addEventListener("input", updateAddButtons);
  $("captainBackground").addEventListener("change", function(){
    captainChosen = { choose1: null, choose2: [] };
    captainSelectedPowers = [];
    $("captainPowerSearch").value = "";
    save();
    renderCaptainAll();
  });
  $("captainCoreCount").addEventListener("change", function(){
    save();
    renderCaptainAll();
  });
  $("captainPowerSearch").addEventListener("input", function(){
    renderCaptainPowerList();
    updateAddButtons();
  });
  $("addCaptainBtn").addEventListener("click", addCaptainToSquad);

  // listeners (First Mate)
  $("firstMateName").addEventListener("input", updateAddButtons);
  $("firstMateBackground").addEventListener("change", function(){
    firstMateChosen = { choose1: null, choose2: [] };
    firstMateSelectedPowers = [];
    $("firstMatePowerSearch").value = "";
    save();
    renderFirstMateAll();
  });
  $("firstMateCoreCount").addEventListener("change", function(){
    save();
    renderFirstMateAll();
  });
  $("firstMatePowerSearch").addEventListener("input", function(){
    renderFirstMatePowerList();
    updateAddButtons();
  });
  $("addFirstMateBtn").addEventListener("click", addFirstMateToSquad);

  // soldiers
  renderSoldierCatalog();

  // reset
  $("resetBtn").addEventListener("click", resetAll);

  // hide tooltip on scroll/resize (evita ficar "perdido")
  window.addEventListener("scroll", function(){ hideTooltip(); }, { passive: true });
  window.addEventListener("resize", function(){ hideTooltip(); }, { passive: true });

  // initial renders
  renderCaptainAll();
  renderFirstMateAll();
  renderAll();
}

init();