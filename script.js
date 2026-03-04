let credits = 400;
let soldierCount = 0;
const maxSoldiers = 8;

// para preencher slots de soldier em ordem
const soldierSlotIds = [
  "slot-soldier-1",
  "slot-soldier-2",
  "slot-soldier-3",
  "slot-soldier-4",
  "slot-soldier-5",
  "slot-soldier-6",
  "slot-soldier-7",
  "slot-soldier-8"
];

// guarda qual unidade está em cada slot de soldier (array paralelo)
let soldierSlots = []; // ex: [{name,cost,slotId,element}, ...]

const soldiers = [
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

function updateCredits() {
  document.getElementById("credits").innerText = credits;
}

function updateSoldierCount() {
  document.getElementById("soldier-count").innerText = `${soldierCount} / ${maxSoldiers}`;
}

function setSlotEmpty(slotId, message) {
  const slot = document.getElementById(slotId);
  slot.innerHTML = `<span class="slot-label">${message}</span>`;
}

function setSlotFilled(slotId, labelText, onRemove) {
  const slot = document.getElementById(slotId);

  const nameSpan = document.createElement("span");
  nameSpan.textContent = labelText;

  const btn = document.createElement("button");
  btn.className = "btn-remove";
  btn.textContent = "REMOVER";
  btn.onclick = onRemove;

  slot.innerHTML = "";
  slot.appendChild(nameSpan);
  slot.appendChild(btn);
}

/* CAPTAIN */
function addCaptain() {
  document.getElementById("captain-section").style.display = "none";

  setSlotFilled("slot-captain", "Captain", () => {
    document.getElementById("captain-section").style.display = "block";
    setSlotEmpty("slot-captain", "Captain obrigatório");
  });
}

/* FIRST MATE */
function addFirstMate() {
  document.getElementById("firstmate-section").style.display = "none";

  setSlotFilled("slot-firstmate", "First Mate", () => {
    document.getElementById("firstmate-section").style.display = "block";
    setSlotEmpty("slot-firstmate", "First Mate obrigatório");
  });
}

/* SOLDIERS */
function addSoldier(name, cost) {
  if (soldierCount >= maxSoldiers) return;
  if (credits < cost) return;

  // escolhe o próximo slot livre
  const nextSlotId = soldierSlotIds[soldierCount];
  if (!nextSlotId) return;

  credits -= cost;
  soldierCount++;

  updateCredits();
  updateSoldierCount();

  setSlotFilled(nextSlotId, `${name} (${cost}cr)`, () => {
    // remover soldier: reembolsa e reorganiza slots
    removeSoldierFromSlot(nextSlotId, cost);
  });

  soldierSlots.push({ slotId: nextSlotId, name, cost });
}

function removeSoldierFromSlot(slotId, cost) {
  // remove do registro
  const index = soldierSlots.findIndex(s => s.slotId === slotId);
  if (index === -1) return;

  credits += cost;
  soldierCount--;

  updateCredits();
  updateSoldierCount();

  soldierSlots.splice(index, 1);

  // re-render de todos os slots de soldier na ordem (compacta)
  // 1) limpa todos
  soldierSlotIds.forEach(id => setSlotEmpty(id, "Slot livre"));

  // 2) preenche na ordem atual
  soldierSlots.forEach((s, i) => {
    const targetSlotId = soldierSlotIds[i];
    s.slotId = targetSlotId;

    setSlotFilled(targetSlotId, `${s.name} (${s.cost}cr)`, () => {
      removeSoldierFromSlot(targetSlotId, s.cost);
    });
  });
}

/* RENDER SOLDIERS LIST */
function renderSoldiers() {
  const list = document.getElementById("soldier-list");
  list.innerHTML = "";

  soldiers.forEach(soldier => {
    const div = document.createElement("div");
    div.className = "soldier-item";

    div.innerHTML = `
      <span>${soldier.name} (${soldier.cost}cr)</span>
      <button class="btn-add">ADICIONAR</button>
    `;

    div.querySelector("button").onclick = function () {
      addSoldier(soldier.name, soldier.cost);
    };

    list.appendChild(div);
  });
}

// INIT
setSlotEmpty("slot-captain", "Captain obrigatório");
setSlotEmpty("slot-firstmate", "First Mate obrigatório");
soldierSlotIds.forEach(id => setSlotEmpty(id, "Slot livre"));

renderSoldiers();
updateCredits();
updateSoldierCount();