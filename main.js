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
    text: `Dawn loosens its light across the market stalls and Kweku Ananse wakes to the warm, smoky smell of cassava and grilled plantain. Here, words travel faster than coin; gossip is currency, and Ananse's webs literal and social catch more than flies. A merchant's cry breaks through the chatter: a precious cloth has vanished. Kweku studies the crowd, feeling the hum of motives. Will he thread himself into the loss as helper, thief, or playwright of a lesson?`,
    choices: [
      { id: "help", label: "Help the merchant find the cloth" },
      { id: "steal", label: "Steal the cloth quietly" },
      { id: "scheme", label: "Turn the loss into a lesson (big trick)" },
    ],
  },
  help: {
    id: "help",
    title: "A Small Kindness",
    text: `Kweku moves like a whisper between stalls: a tug of thread here, a tug of memory there. He traces the cloth's faint breath across the ground and returns it to the trembling merchant. Gratitude blooms into gossip and an old woman offers Kweku a tale about a trickster who once turned loss into alliance. The market smiles, but in the corners a question remains: did the kindness mend only a pocket, or a strand of the greater web?`,
    choices: [
      { id: "learn", label: "Listen to the neighbor’s story" },
      { id: "moveOn", label: "Move on - curiosity satisfied" },
    ],
  },
  learn: {
    id: "learn",
    title: "Story Within Story",
    text: `The neighbor's voice falls low and hushed; she paints Ananse as both fool and founder. Once, she says, he lost all he owned and spun his way back into favor-stringing favors, bargaining secrets, and trading stories until entire villages were bound to him. You feel how loss and making are two sides of the trickster's hand.`,
    choices: [
      { id: "oldWeb", label: "Ask about the old web" },
      { id: "epilogue", label: "Reflect and close the market day" },
    ],
  },
  oldWeb: {
    id: "oldWeb",
    title: "The Old Web",
    text: `She sketches the old web with her hands; loops and knots spanning rivers and paths. Ananse used strands not to ensnare but to link: a favor owed in one town became the shelter of another. You see the trickster not as lone trick but as architect of exchange, his cunning reshaping how people gave and received.`,
    choices: [{ id: "epilogue", label: "Return to market twilight" }],
  },
  moveOn: {
    id: "moveOn",
    title: "Quiet Day",
    text: "You tuck the small story into your pocket and move on through the vendor aisles. The kindness travels with the merchant, a soft thread in the day’s weaving; small, but not without consequence.",
    choices: [],
  },
  steal: {
    id: "steal",
    title: "A Quiet Thief",
    text: `When the dancers whirl and the crowd leans toward spectacle, Kweku slips through shadow and lifts the cloth like a secret. His throat tightens with the thrill; his fingers tingle. But the weave betrays itself; a pattern known to the chief, and suddenly the theft is no longer petty but political. The market hushes; choices harden into consequences.`,
    choices: [
      { id: "confess", label: "Confess and face the chief" },
      { id: "hide", label: "Hide the cloth and spin a new tale" },
    ],
  },
  confess: {
    id: "confess",
    title: "Confrontation",
    text: `The chief's voice booms across the square; people press in like tide. Kweku stands small beneath that gaze. Rather than posture, he bows and speaks. This speech is confession braided with a tale that turns shame into teaching. He performs humility and humor, and the crowd's anger loosens into a lesson that the young will carry home.`,
    choices: [
      { id: "rebuild", label: "Rebuild trust with a public act" },
      { id: "banished", label: "Refuse and face exile" },
    ],
  },
  hide: {
    id: "hide",
    title: "A Whispered Tale",
    text: `You tuck the cloth away and later whisper that it was cursed, that anyone who owns it will quarrel. The rumor moves like smoke, seeding suspicion between neighbors. Soon trust thins and old friends eye each other with caution. Your trick has taken root, and the market's web shows new, ragged holes.`,
    choices: [{ id: "epilogue", label: "Watch the consequences" }],
  },
  scheme: {
    id: "scheme",
    title: "The Great Lesson",
    text: `Kweku arranges actors and whispers, seeding a drama that will pull at the market’s seams. He lets rumor unfurl like a stage curtain, then in the messy middle performs the swap and reveals the trick. Some laugh; some weep; some feel enlightened. Yet a lesson taught as theater can cut both ways, with its fallout never wholly predictable.`,
    choices: [
      { id: "reveal", label: "Reveal your trick now" },
      { id: "letRage", label: "Let the market argue longer" },
    ],
  },
  reveal: {
    id: "reveal",
    title: "Reveal",
    text: `When the curtain falls, Kweku steps forward with the cloth in hand and peels back the illusion. Laughter and outrage ripple through the crowd; a friend turns away. You watch how a single clever act can redraw the map of loyalty; what benefits the many may wound the few.`,
    choices: [
      { id: "rebuild", label: "Try to rebuild a bridge" },
      { id: "epilogue", label: "Leave quietly" },
    ],
  },
  letRage: {
    id: "letRage",
    title: "Let Them Brawl",
    text: "The argument spirals beyond Kweku's control: rumor fans into grievance and grievance into fights. Stalls close early, and the market's chorus fractures into silence. Alone, Ananse watches and wonders if his cleverness has a price too heavy to pay.",
    choices: [],
  },
  rebuild: {
    id: "rebuild",
    title: "Rebuilding the Web",
    text: `Kweku summons those he harmed and lays down not excuses but work: he stitches bargains into the broken threads, arranges help for the injured, and speaks stories that bind rather than divide. In time, the market's web thickens again, this time held together by shared labor and contrition.`,
    choices: [
      { id: "legacy", label: "Record the lesson for children" },
      { id: "epilogue", label: "Let the day end" },
    ],
  },
  banished: {
    id: "banished",
    title: "Exile",
    text: `The chief's decree is a cold wind: Kweku is sent beyond the market's boundary. In exile he sits by new fires, spinning new webs and weighing how his cleverness has cut him loose from the people he played among. The tale becomes one of solitude and slow reflection.`,
    choices: [],
  },
  epilogue: {
    id: "epilogue",
    title: "Twilight Threads",
    text: `At dusk the market folds into itself and lanterns blink like catching insects. You gather the day's threads, cunning and kindness, rupture and repair and feel how a single choice shifts the weave of many lives. The trickster's motif endures: story is a tool of power and of repair, and every retelling remakes the world a little.`,
    choices: [],
  },
  legacy: {
    id: "legacy",
    title: "Legacy",
    text: `Kweku sets ink to bark and writes the day's story, knowing that children will tell it in new tongues. The myth is not finished; it lives by being told and retold, each teller reshaping the web anew.`,
    choices: [],
  },
  // new enriched branches
  befriend: {
    id: "befriend",
    title: "A New Ally",
    text: `After returning the cloth, Kweku lingers to share food with a young merchant who watched. He listens, laughs, and offers a small favor in return. That favor grows into an alliance: the merchant later warns Kweku of a plot, and a quiet partnership begins.`,
    choices: [
      { id: "alliance", label: "Build the alliance" },
      { id: "epilogue", label: "Part ways" },
    ],
  },
  alliance: {
    id: "alliance",
    title: "The Alliance",
    text: `The merchant and Kweku trade stories and small services. When trouble comes (a rumor that targets the merchant) Kweku uses his webs of information to protect his new friend. The market learns that alliances can be spun as deftly as tricks.`,
    choices: [
      { id: "legacy", label: "Record the friendship" },
      { id: "epilogue", label: "Let the day end" },
    ],
  },
  doubleCross: {
    id: "doubleCross",
    title: "Double Cross",
    text: `Kweku finds an accomplice in the crowd who owes him a favor; together they stage a theft. Yet favors are messy when the accomplice betrays Kweku to save themselves; with the trickster learning a sharp lesson about trust and leverage.`,
    choices: [
      { id: "confess", label: "Accept blame and teach" },
      { id: "banished", label: "Refuse and be cast out" },
    ],
  },
  accomplice: {
    id: "accomplice",
    title: "An Unsteady Friend",
    text: `The accomplice's loyalty frays under pressure. In the theater of rumor, survival often trumps gratitude. Kweku must decide whether to punish, forgive, or outwit this human strand in his web.`,
    choices: [
      { id: "rebuild", label: "Mend the bond" },
      { id: "letRage", label: "Exploit the fallout" },
    ],
  },
  trial: {
    id: "trial",
    title: "Market Trial",
    text: `The chief calls for a public accounting: testimonies, evidence of pattern, a telling of deeds. Kweku takes the stand and the market listens as the tale becomes a trial, where story and law braid together.`,
    choices: [
      { id: "rebuild", label: "Accept terms" },
      { id: "banished", label: "Refuse and leave" },
    ],
  },
  reconciliation: {
    id: "reconciliation",
    title: "Mended Threads",
    text: `Slowly, with small acts and an honest story, the market's bonds are mended. Kweku helps arrange a feast where grievances are named and forgiven; laughter returns like rain after drought.`,
    choices: [
      { id: "legacy", label: "Teach the children" },
      { id: "epilogue", label: "Close the day" },
    ],
  },
  festival: {
    id: "festival",
    title: "Festival of Stories",
    text: `At a later season, the market holds a festival where stories are traded like goods. Kweku and the community retell that day, each teller reshaping the truth for lesson or mirth. Your actions have become a new thread in the festival's loom.`,
    choices: [
      { id: "legacy", label: "Preserve the story" },
      { id: "epilogue", label: "Let it evolve" },
    ],
  },
};

// Canonical/interpretive summaries for each ending branch.
const mythSummaries = {
  moveOn: `This version highlights Ananse as a benevolent trickster: a figure who uses cleverness to assist and weave social bonds. It echoes variants in which Ananse's cunning benefits the community and yields stories or favors in return.`,
  epilogue: `The epilogue emphasizes the trickster's role in transforming community relationships. Like many Ananse tales, the motif of storytelling as power is central: the trickster makes and remakes social ties through narrative and action.`,
  confess: `This branch maps to tales where Ananse faces social consequences and chooses public restitution. It aligns with versions that stress responsibility: the trickster who must restore balance after a clever act.`,
  rebuild: `Here Ananse uses cunning to repair rather than to harm. This mirrors variants where his intelligence becomes a tool for community repair, showing that trickery can be redirected toward the common good.`,
  hide: `This darker variant echoes stories in which Ananse's tricks sow distrust or feud. Many traditional versions remind listeners that cunning has costs: social fragmentation, lost trust, or exile.`,
  reveal: `This ending shows the pedagogical trick: Ananse exposes falsehoods through performance, teaching the community. It reflects versions where the trickster's lesson is both revealing and costly.`,
  letRage: `This outcome aligns with cautionary versions of Ananse stories where rumor and unchecked cunning fracture the community, a reminder that cleverness without care can harm the social web.`,
  banished: `Ananse's exile is a common motif in tales where the trickster crosses moral lines. Exile allows the story to explore solitude, reflection, and eventual return or reinvention.`,
  legacy: `A meta-ending: Ananse records a tale that will be retold differently. This summary reminds readers that myths survive through retelling and transformation.`,
  moveOn_default: `A simple, peaceful ending that preserves Ananse's kindness as a way to secure narratives and social capital; it connects to tales of small favors leading to larger stories.`,
};
// Add summaries for the new branches
mythSummaries.befriend = `This variant shows Ananse cultivating ties rather than exploiting them: the trickster who makes allies and learns reciprocal care.`;
mythSummaries.alliance = `Ananse leverages friendship and information to protect and bind communities; cunning becomes social capital.`;
mythSummaries.doubleCross = `A cautionary thread: the trickster who uses others must account for betrayal; favors can fracture when survival is at stake.`;
mythSummaries.accomplice = `The accomplice arc explores loyalty and leverage, underscoring how human strands complicate a spider's web.`;
mythSummaries.trial = `A formal reckoning: when story becomes evidence, the community negotiates justice through narrative and testimony.`;
mythSummaries.reconciliation = `A restorative ending where stories and shared labor rebuild trust; it highlights repair over punishment.`;
mythSummaries.festival = `A meta-ending: the market ritualizes the tale and transforms it into communal memory, exactly how myths live on.`;

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
    done.textContent = "The story concludes.";
    choicesEl.appendChild(done);

    // show an interpretive myth summary for ending scenes
    const summaryText =
      mythSummaries[sceneId] || mythSummaries[sceneId + "_default"] || null;
    if (summaryText) {
      const s = document.createElement("div");
      s.className = "myth-summary";
      s.innerHTML = `<h4>Myth Summary</h4><p>${escapeHtml(summaryText)}</p>`;
      choicesEl.appendChild(s);
      // speak the summary if narration is on
      speak("Myth summary. " + summaryText);
    }
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
