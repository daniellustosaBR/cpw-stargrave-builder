const STARTING_CREDITS = 400;

const CAPTAIN_BASE_STATS = { M: 6, F: 3, S: 2, A: 9, W: 3, H: 16 };

const CAPTAIN_BACKGROUNDS = {
  Biomorph: {
    statText: "+1 Health and choose two of the following: +1 Move, +1 Fight, +1 Shoot",
    fixed: { H: 1 },
    pick: { count: 2, options: ["M", "F", "S"] },
    corePowers: ["Adrenaline Surge","Armour Plates","Camouflage","Fling","Regenerate","Restructure Body","Toxic Claws","Toxic Secretion"]
  },
  Cyborg: {
    statText: "+1 Health and choose two of the following: +1 Move, +1 Fight, +1 Shoot",
    fixed: { H: 1 },
    pick: { count: 2, options: ["M", "F", "S"] },
    corePowers: ["Camouflage","Control Robot","Data Knock","Energy Shield","Power Spike","Quick Step","Target Lock","Temporary Upgrade"]
  },
  Mystic: {
    statText: "+2 Will, +1 Health, and choose one of the following: +1 Move, +1 Fight, +1 Shoot",
    fixed: { W: 2, H: 1 },
    pick: { count: 1, options: ["M","F","S"] },
    corePowers: ["Control Animal","Dark Energy","Heal","Life Leach","Mystic Trance","Puppet Master","Suggestion","Void Blade"]
  },
  "Robotics Expert": {
    statText: "+1 Will and choose two of the following: +1 Move, +1 Fight, +1 Shoot, +1 Health",
    fixed: { W: 1 },
    pick: { count: 2, options: ["M","F","S","H"] },
    corePowers: ["Control Robot","Create Robot","Drone","Electromagnetic Pulse","Remote Firing","Remote Guidance","Repair Robot","Re-wire Robot"]
  },
  Rogue: {
    statText: "+1 Will, +1 Health, and choose two of the following: +1 Move, +1 Fight, +1 Shoot",
    fixed: { W: 1, H: 1 },
    pick: { count: 2, options: ["M","F","S"] },
    corePowers: ["Bait and Switch","Bribe","Cancel Power","Concealed Firearm","Data Jump","Fortune","Haggle","Quick-Step"]
  },
  Psionicist: {
    statText: "+2 Will, +1 Health and choose one of the following: +1 Move, +1 Fight, +1 Shoot",
    fixed: { W: 2, H: 1 },
    pick: { count: 1, options: ["M","F","S"] },
    corePowers: ["Break Lock","Destroy Weapon","Lift","Psionic Fire","Psychic Shield","Pull","Suggestion","Wall of Force"]
  },
  Tekker: {
    statText: "+2 Will and choose two of the following: +1 Move, +1 Fight, +1 Shoot, +1 Health",
    fixed: { W: 2 },
    pick: { count: 2, options: ["M","F","S","H"] },
    corePowers: ["Anti-gravity Projection","Data Jump","Data Knock","Data Skip","Drone","Electromagnetic Pulse","Holographic Wall","Transport"]
  },
  Veteran: {
    statText: "+1 Fight, +1 Health, and choose one of the following: +1 Move, +1 Fight (for a total of +2), +1 Shoot",
    fixed: { F: 1, H: 1 },
    pick: { count: 1, options: ["M","F","S"] },
    corePowers: ["Armoury","Command","Coordinated Fire","Energy Shield","Fortune","Power Spike","Remote Firing","Target Designation"]
  }
};

const SOLDIERS = [
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

let credits = STARTING_CREDITS;
let captainInSquad = false;
let firstMateInSquad = false;
let recruited = [];
let captainBuild = { name: "", background: "Biomorph", picks: [] };

const STORAGE_KEY = "cpw_stargrave_builder_v3_fix";

const $ = (id) => document.getElementById(id);
const bonus = (v) => (v >= 0 ? `+${v}` : `${v}`);
const statFmt = (key, v) => (key === "F" || key === "S" || key === "W" ? bonus(v) : `${v}`);

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ credits, captainInSquad, firstMateInSquad, recruited, captainBuild }));
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    credits = typeof data.credits === "number" ? data.credits : STARTING_CREDITS;
    captainInSquad = !!data.captainInSquad;
    firstMateInSquad = !!data.firstMateInSquad;
    recruited = Array.isArray(data.recruited) ? data.recruited : [];
    captainBuild = data.captainBuild || captainBuild;
    if (!CAPTAIN_BACKGROUNDS[captainBuild.background]) {
      captainBuild.background = "Biomorph";
      captainBuild.picks = [];
    }
  } catch {}
}

function enforcePickRules() {
  const bg = CAPTAIN_BACKGROUNDS[captainBuild.background];
  const max = bg.pick?.count ?? 0;
  const allowed = new Set(bg.pick?.options ?? []);
  captainBuild.picks = (captainBuild.picks || []).filter((p) => allowed.has(p));
  if (captainBuild.picks.length > max) captainBuild.picks = captainBuild.picks.slice(0, max);
}

function computeCaptainFinalStats() {
  enforcePickRules();
  const bg = CAPTAIN_BACKGROUNDS[captainBuild.background];
  const final = { ...CAPTAIN_BASE_STATS };
  if (bg.fixed) for (const k of Object.keys(bg.fixed)) final[k] += bg.fixed[k];
  for (const p of (captainBuild.picks || [])) if (final[p] !== undefined) final[p] += 1;
  return final;
}

function updateCaptainStatsUI() {
  const f = computeCaptainFinalStats();
  $("finalM").textContent = statFmt("M", f.M);
  $("finalF").textContent = statFmt("F", f.F);
  $("finalS").textContent = statFmt("S", f.S);
  $("finalA").textContent = statFmt("A", f.A);
  $("finalW").textContent = statFmt("W", f.W);
  $("finalH").textContent = statFmt("H", f.H);
}

function renderBackgroundDropdown() {
  const sel = $("captainBackground");
  sel.innerHTML = "";
  Object.keys(CAPTAIN_BACKGROUNDS).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
  sel.value = captainBuild.background;
}

function renderBackgroundDetails() {
  const bg = CAPTAIN_BACKGROUNDS[captainBuild.background];
  const container = $("bgDetails");
  container.innerHTML = "";

  const statBlock = document.createElement("div");
  statBlock.className = "kv";
  statBlock.innerHTML = `<div class="k">Stat Modifications</div><div class="v">${bg.statText}</div>`;
  container.appendChild(statBlock);

  if (bg.pick && bg.pick.count > 0) {
    const wrap = document.createElement("div");
    wrap.className = "kv";
    wrap.innerHTML = `<div class="k">Escolhas</div><div class="v">Selecione <b>${bg.pick.count}</b>: <div class="choice-row" id="pickRow"></div></div>`;
    container.appendChild(wrap);

    const pickRow = wrap.querySelector("#pickRow");

    bg.pick.options.forEach((key) => {
      const label = document.createElement("label");
      label.className = "choice";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = (captainBuild.picks || []).includes(key);

      input.addEventListener("change", () => {
        const set = new Set(captainBuild.picks || []);
        if (input.checked) set.add(key);
        else set.delete(key);
        captainBuild.picks = Array.from(set);
        enforcePickRules();
        renderBackgroundDetails();
        updateCaptainStatsUI();
        saveGame();
      });

      const txt = key === "M" ? "Move +1" : key === "F" ? "Fight +1" : key === "S" ? "Shoot +1" : "Health +1";
      label.appendChild(input);
      label.appendChild(document.createTextNode(txt));
      pickRow.appendChild(label);
    });
  }

  const powers = document.createElement("div");
  powers.className = "kv";
  powers.innerHTML = `<div class="k">Core Powers</div><div class="v">${bg.corePowers.join(", ")}</div>`;
  container.appendChild(powers);
}

function makeSlot(id, title, subtitle, highlight) {
  const slot = document.createElement("div");
  slot.className = `slot ${highlight ? "highlight" : ""}`;
  slot.id = id;

  const left = document.createElement("div");
  left.className = "slot-left";
  left.innerHTML = `<div class="slot-title">${title}</div><div class="slot-sub">${subtitle}</div>`;

  const right = document.createElement("div");
  right.className = "slot-right";

  slot.appendChild(left);
  slot.appendChild(right);
  return slot;
}

function setSlotContent(slotId, title, subtitle, removeHandler, removeLabel = "REMOVER") {
  const slot = $(slotId);
  if (!slot) return;

  slot.querySelector(".slot-title").textContent = title;
  slot.querySelector(".slot-sub").textContent = subtitle;

  const right = slot.querySelector(".slot-right");
  right.innerHTML = "";

  if (removeHandler) {
    const btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.textContent = removeLabel;
    btn.onclick = removeHandler;
    right.appendChild(btn);
  }
}

function buildSquadSlots() {
  const grid = $("squadGrid");
  grid.innerHTML = "";
  grid.appendChild(makeSlot("captainSlot", "CAPTAIN", "Captain obrigatório", true));
  grid.appendChild(makeSlot("firstMateSlot", "FIRST MATE", "First Mate obrigatório", true));
  for (let i = 0; i < 8; i++) grid.appendChild(makeSlot(`soldierSlot_${i}`, `SOLDIER ${i + 1}`, "Vazio", false));
}

function renderSoldierCatalog() {
  const wrap = $("soldierCatalog");
  wrap.innerHTML = "";
  SOLDIERS.forEach((u) => {
    const row = document.createElement("div");
    row.className = "unit-row";
    row.innerHTML = `<div><span class="unit-name">${u.name}</span> <span class="unit-cost">(${u.cost}cr)</span></div>`;
    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = "ADICIONAR";
    btn.onclick = () => addSoldier(u);
    row.appendChild(btn);
    wrap.appendChild(row);
  });
}

function addCaptain() {
  if (captainInSquad) return;
  captainInSquad = true;
  $("btnAddCaptain").disabled = true;

  const capName = ($("captainName").value || "").trim();
  captainBuild.name = capName;

  const bg = captainBuild.background;
  const s = computeCaptainFinalStats();

  const subtitle =
    `${capName ? capName + " · " : ""}${bg} · ` +
    `Move ${s.M} · Fight ${bonus(s.F)} · Shoot ${bonus(s.S)} · Armour ${s.A} · Will ${bonus(s.W)} · Health ${s.H}`;

  setSlotContent("captainSlot", "CAPTAIN", subtitle, removeCaptain);
  updateDisplay();
  saveGame();
}

function removeCaptain() {
  captainInSquad = false;
  $("btnAddCaptain").disabled = false;
  setSlotContent("captainSlot", "CAPTAIN", "Captain obrigatório", null);
  updateDisplay();
  saveGame();
}

function addFirstMate() {
  if (firstMateInSquad) return;
  firstMateInSquad = true;
  $("btnAddFirstMate").disabled = true;
  setSlotContent("firstMateSlot", "FIRST MATE", "Adicionado ao Squad", removeFirstMate);
  updateDisplay();
  saveGame();
}

function removeFirstMate() {
  firstMateInSquad = false;
  $("btnAddFirstMate").disabled = false;
  setSlotContent("firstMateSlot", "FIRST MATE", "First Mate obrigatório", null);
  updateDisplay();
  saveGame();
}

function addSoldier(unit) {
  if (recruited.length >= 8) return alert("Limite de 8 Soldiers atingido.");
  if (credits < unit.cost) return alert("Créditos insuficientes.");

  credits -= unit.cost;
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  recruited.push({ id, name: unit.name, cost: unit.cost });
  updateDisplay();
  saveGame();
}

function removeSoldierById(id) {
  const idx = recruited.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const [r] = recruited.splice(idx, 1);
  credits += r.cost;
  updateDisplay();
  saveGame();
}

function updateDisplay() {
  $("credits").textContent = String(credits);
  $("soldierCount").textContent = String(recruited.length);

  const total = (captainInSquad ? 1 : 0) + (firstMateInSquad ? 1 : 0) + recruited.length;
  $("squadCount").textContent = String(total);

  for (let i = 0; i < 8; i++) {
    const slotId = `soldierSlot_${i}`;
    const s = recruited[i];
    if (!s) setSlotContent(slotId, `SOLDIER ${i + 1}`, "Vazio", null);
    else setSlotContent(slotId, s.name, `${s.cost}cr`, () => removeSoldierById(s.id), "REMOVER");
  }
}

function resetAll() {
  credits = STARTING_CREDITS;
  captainInSquad = false;
  firstMateInSquad = false;
  recruited = [];
  captainBuild = { name: "", background: "Biomorph", picks: [] };
  localStorage.removeItem(STORAGE_KEY);

  $("captainName").value = "";
  renderBackgroundDropdown();
  renderBackgroundDetails();

  $("baseM").textContent = String(CAPTAIN_BASE_STATS.M);
  $("baseF").textContent = statFmt("F", CAPTAIN_BASE_STATS.F);
  $("baseS").textContent = statFmt("S", CAPTAIN_BASE_STATS.S);
  $("baseA").textContent = String(CAPTAIN_BASE_STATS.A);
  $("baseW").textContent = statFmt("W", CAPTAIN_BASE_STATS.W);
  $("baseH").textContent = String(CAPTAIN_BASE_STATS.H);

  updateCaptainStatsUI();

  $("btnAddCaptain").disabled = false;
  $("btnAddFirstMate").disabled = false;

  setSlotContent("captainSlot", "CAPTAIN", "Captain obrigatório", null);
  setSlotContent("firstMateSlot", "FIRST MATE", "First Mate obrigatório", null);

  updateDisplay();
}

function init() {
  $("baseM").textContent = String(CAPTAIN_BASE_STATS.M);
  $("baseF").textContent = statFmt("F", CAPTAIN_BASE_STATS.F);
  $("baseS").textContent = statFmt("S", CAPTAIN_BASE_STATS.S);
  $("baseA").textContent = String(CAPTAIN_BASE_STATS.A);
  $("baseW").textContent = statFmt("W", CAPTAIN_BASE_STATS.W);
  $("baseH").textContent = String(CAPTAIN_BASE_STATS.H);

  loadGame();

  buildSquadSlots();
  renderSoldierCatalog();
  renderBackgroundDropdown();

  $("captainBackground").addEventListener("change", (e) => {
    captainBuild.background = e.target.value;
    captainBuild.picks = [];
    renderBackgroundDetails();
    updateCaptainStatsUI();
    saveGame();
  });

  $("captainName").value = captainBuild.name || "";
  $("captainName").addEventListener("input", (e) => {
    captainBuild.name = e.target.value;
    if (captainInSquad) {
      captainInSquad = false;
      $("btnAddCaptain").disabled = false;
      addCaptain();
    }
    saveGame();
  });

  renderBackgroundDetails();
  updateCaptainStatsUI();

  $("btnAddCaptain").onclick = addCaptain;
  $("btnAddFirstMate").onclick = addFirstMate;
  $("btnReset").onclick = resetAll;

  if (!captainInSquad) {
    setSlotContent("captainSlot", "CAPTAIN", "Captain obrigatório", null);
    $("btnAddCaptain").disabled = false;
  } else {
    $("btnAddCaptain").disabled = true;
    const was = captainInSquad;
    captainInSquad = false;
    $("btnAddCaptain").disabled = false;
    addCaptain();
    captainInSquad = was;
    $("btnAddCaptain").disabled = true;
  }

  if (!firstMateInSquad) {
    setSlotContent("firstMateSlot", "FIRST MATE", "First Mate obrigatório", null);
    $("btnAddFirstMate").disabled = false;
  } else {
    $("btnAddFirstMate").disabled = true;
    setSlotContent("firstMateSlot", "FIRST MATE", "Adicionado ao Squad", removeFirstMate);
  }

  updateDisplay();
}

init();