// Simple interactive story engine for Kweku Ananse retelling
const startBtn = document.getElementById("startBtn");
const beginBtn = document.getElementById("beginBtn");
const narrateToggle = document.getElementById("narrateToggle");
const storySection = document.getElementById("story");
const sceneEl = document.getElementById("scene");
const choicesEl = document.getElementById("choices");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const analysisBtn = document.getElementById("analysisBtn");
const analysisSection = document.getElementById("analysis");
const heroSpider = document.querySelector(".hero-spider");
const voiceSelect = document.getElementById("voiceSelect");
const rateRange = document.getElementById("rateRange");
const rateLabel = document.getElementById("rateLabel");
const narrationControls = document.getElementById("narrationControls");

let narrationEnabled = false;
let history = [];
let availableVoices = [];

const scenes = {
  start: {
    id: "start",
    title: "Market Morning",
    text: `Kweku Ananse wakes to the smell of cassava and grilled plantain. In the market, gossip is a currency, and Kweku's webs catch more than flies: they gather whispers. A merchant loses a precious cloth; will Ananse help, steal, or scheme for a lesson?`,
    choices: [
      { id: "help", label: "Help the merchant find the cloth" },
      { id: "steal", label: "Steal the cloth quietly" },
      { id: "scheme", label: "Turn the loss into a lesson (big trick)" },
    ],
  },
  help: {
    id: "help",
    title: "A Small Kindness",
    text: `Kweku chooses kindness: he uses tiny threads to reconstruct the trail of the cloth. The merchant is grateful; a neighbor rewards Kweku with a story about an old trickster. The moral is pleasant — but is it the whole tale?`,
    choices: [
      { id: "learn", label: "Listen to the neighbor’s story" },
      { id: "moveOn", label: "Move on — curiosity satisfied" },
    ],
  },
  learn: {
    id: "learn",
    title: "Story Within Story",
    text: `The neighbor tells a variant: Ananse once lost everything and rebuilt a web of allies. You realize the motif: losing and making is part of the trickster's craft. The tale connects to course motifs — transformation through tale-making.`,
    choices: [
      { id: "oldWeb", label: "Ask about the old web" },
      { id: "epilogue", label: "Reflect and close the market day" },
    ],
  },
  oldWeb: {
    id: "oldWeb",
    title: "The Old Web",
    text: `In the neighbor's telling, Ananse once built a great web that spanned villages — not to trap, but to connect. Each strand carried a favor and a secret. You learn that Ananse's cunning often remakes community ties, not just individuals.`,
    choices: [{ id: "epilogue", label: "Return to market twilight" }],
  },
  moveOn: {
    id: "moveOn",
    title: "Quiet Day",
    text: "You move on; a quiet kindness carries forth. End of branch.",
    choices: [],
  },
  steal: {
    id: "steal",
    title: "A Quiet Thief",
    text: `Under the stall, while all eyes are on the healing dance, Kweku slips the cloth into his bag. He grins — until someone recognizes the weave: it's the chief's garb. The stakes rise.`,
    choices: [
      { id: "confess", label: "Confess and face the chief" },
      { id: "hide", label: "Hide the cloth and spin a new tale" },
    ],
  },
  confess: {
    id: "confess",
    title: "Confrontation",
    text: `The chief summons Kweku. In the open square, Kweku must choose humility or bravado. He chooses a middle path: he confesses and offers a lesson for the youth — a public performance that rewires the market's expectations.`,
    choices: [
      { id: "rebuild", label: "Rebuild trust with a public act" },
      { id: "banished", label: "Refuse and face exile" },
    ],
  },
  hide: {
    id: "hide",
    title: "A Whispered Tale",
    text: `You hide the cloth and spin a tale that starts a feud. The city learns to distrust cloth-buyers. The weave of rumor grows; some ties fray.`,
    choices: [{ id: "epilogue", label: "Watch the consequences" }],
  },
  scheme: {
    id: "scheme",
    title: "The Great Lesson",
    text: `Kweku stages a play: he spreads a rumor that the cloth carries a curse. While people argue, Kweku performs a sly swap and teaches them to look beyond rumor. But lessons have unexpected consequences.`,
    choices: [
      { id: "reveal", label: "Reveal your trick now" },
      { id: "letRage", label: "Let the market argue longer" },
    ],
  },
  reveal: {
    id: "reveal",
    title: "Reveal",
    text: `Kweku reveals the trick; some laugh, some cry. The community learns, but the trickster loses a friend. You see how Ananse's craft reshapes relationships: a gain for the many can be a loss for the few.`,
    choices: [
      { id: "rebuild", label: "Try to rebuild a bridge" },
      { id: "epilogue", label: "Leave quietly" },
    ],
  },
  letRage: {
    id: "letRage",
    title: "Let Them Brawl",
    text: "Rumors spread; the market fractures. Ananse ponders whether cleverness is worth the cost. End of branch.",
    choices: [],
  },
  rebuild: {
    id: "rebuild",
    title: "Rebuilding the Web",
    text: `Kweku calls together those he wronged and uses his webs—not to trick—but to mend: he arranges labor exchanges, stories shared, and a public apology. The market learns that trickery can be a tool for repair when paired with responsibility.`,
    choices: [
      { id: "legacy", label: "Record the lesson for children" },
      { id: "epilogue", label: "Let the day end" },
    ],
  },
  banished: {
    id: "banished",
    title: "Exile",
    text: `Kweku refuses the chief's terms and is sent away. Alone, he fashions new webs and weighs the cost of being clever but unrepentant. End of branch.`,
    choices: [],
  },
  epilogue: {
    id: "epilogue",
    title: "Twilight Threads",
    text: `At twilight the market closes. You leave with threads of the day: cunning, kindness, rupture, repair. The core motif endures: the trickster shapes community through story and action. Consider how Homer or Ovid reworked motifs — and how you have reshaped Ananse today.`,
    choices: [],
  },
  legacy: {
    id: "legacy",
    title: "Legacy",
    text: `Kweku writes his own tale—one that the next generation will retell differently. The myth continues: motifs preserved, forms altered. End of project.`,
    choices: [],
  },
};

function populateVoices() {
  if (!("speechSynthesis" in window)) return;
  availableVoices = speechSynthesis.getVoices() || [];
  voiceSelect.innerHTML = "";
  availableVoices.forEach((v, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
  if (availableVoices.length) voiceSelect.selectedIndex = 0;
}

// populate on load and when voices change
populateVoices();
if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = populateVoices;
}

function speak(text) {
  if (!narrationEnabled) return;
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  const rate = parseFloat(rateRange?.value || 0.95);
  u.rate = rate;
  const sel = parseInt(voiceSelect?.value);
  if (!Number.isNaN(sel) && availableVoices[sel])
    u.voice = availableVoices[sel];
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

function renderScene(sceneId) {
  const scene = scenes[sceneId];
  if (!scene) return;
  sceneEl.innerHTML = `<h2>${escapeHtml(scene.title)}</h2><p>${escapeHtml(
    scene.text
  )}</p>`;
  choicesEl.innerHTML = "";
  if (scene.choices && scene.choices.length) {
    scene.choices.forEach((ch) => {
      const b = document.createElement("button");
      b.className = "choice-btn";
      b.textContent = ch.label;
      b.addEventListener("click", () => {
        history.push(sceneId);
        renderScene(ch.id);
      });
      choicesEl.appendChild(b);
    });
  } else {
    const done = document.createElement("p");
    done.textContent = "— End of branch —";
    choicesEl.appendChild(done);
  }
  heroSpider.classList.add("active-spider");
  speak(scene.title + ". " + scene.text);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

beginBtn.addEventListener("click", () => {
  document.getElementById("hero").classList.add("hidden");
  storySection.classList.remove("hidden");
  renderScene("start");
});

startBtn.addEventListener("click", () => {
  document.getElementById("hero").classList.toggle("hidden");
  storySection.classList.toggle("hidden");
  if (!storySection.classList.contains("hidden")) renderScene("start");
});

narrateToggle.addEventListener("click", () => {
  narrationEnabled = !narrationEnabled;
  narrateToggle.textContent = narrationEnabled
    ? "Narration: On"
    : "Toggle Narration";
  if (narrationEnabled) {
    narrationControls.setAttribute("aria-hidden", "false");
    // ensure voices populated
    populateVoices();
  } else {
    narrationControls.setAttribute("aria-hidden", "true");
    speechSynthesis && speechSynthesis.cancel();
  }
});

rateRange &&
  rateRange.addEventListener("input", () => {
    rateLabel.textContent = rateRange.value;
  });

backBtn.addEventListener("click", () => {
  if (history.length === 0) return;
  const prev = history.pop();
  renderScene(prev);
});

restartBtn.addEventListener("click", () => {
  history = [];
  renderScene("start");
});

analysisBtn.addEventListener("click", () => {
  analysisSection.classList.toggle("hidden");
});

// Start small animation loop for decorative spider
(function floatLoop() {
  heroSpider.classList.toggle("float-flag");
  setTimeout(floatLoop, 4000);
})();
