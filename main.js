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
    title: "Choose Your Story",
    text: `Welcome, traveler! You stand at the crossroads of two tales about Kweku Ananse, the trickster spider. Will you walk the path of a traditional story from the ancestors, or venture into a new retelling set in the marketplace? Each path has its own twists, lessons, and endings.`,
    choices: [{ id: "storySelection", label: "Choose a story to experience" }],
  },
  storySelection: {
    id: "storySelection",
    title: "Select Your Tale",
    text: `Choose which Ananse story you wish to experience:`,
    choices: [
      { id: "skyGodIntro", label: "How Ananse Got All Stories (Traditional)" },
      {
        id: "wisdomPotIntro",
        label: "Ananse and the Pot of Wisdom (Traditional)",
      },
      { id: "marketIntro", label: "Market Morning (Original Retelling)" },
    ],
  },

  // TRADITIONAL STORY 1: How Ananse Got All Stories
  skyGodIntro: {
    id: "skyGodIntro",
    title: "How Ananse Got All Stories",
    text: `Long ago, all stories belonged to Nyame, the Sky God. They lived in a golden box at the edge of the heavens, guarded by silence and clouds. Ananse the spider looked up from his web and yearned to possess them. One day, he climbed the silk thread to the sky and approached the throne.
    
    "Great Nyame," said Ananse, "I wish to buy your stories."
    
    Nyame laughed, a sound like distant thunder. "Many have tried, little spider. The price is four impossible captures: Onini the Python, Osebo the Leopard, the Mmoboro Hornets, and Mmoatia the Invisible Fairy. Bring them to me, and the stories are yours."`,
    choices: [
      { id: "skyGod_accept", label: "Accept the challenge" },
      { id: "skyGod_negotiate", label: "Try to negotiate easier terms" },
    ],
  },
  skyGod_negotiate: {
    id: "skyGod_negotiate",
    title: "The Sky God's Laughter",
    text: `"Easier terms?" Nyame's laughter rolls across the clouds like drums. "You think yourself so clever, spider, that you can bargain with the Sky God? Very well, I will add a fifth task: bring me your own mother, Ya Nsia, as proof of your commitment."
    
    Ananse's heart sinks. His cunning has backfired. Now the price is even steeper.`,
    choices: [
      { id: "skyGod_challenge", label: "Accept the harder challenge" },
      { id: "start", label: "Abandon the quest and return home" },
    ],
  },
  skyGod_accept: {
    id: "skyGod_accept",
    title: "The First Capture: Onini the Python",
    text: `Ananse descends to the forest and consults his wife, Aso. "How can I capture a python longer than ten men?" he asks.
    
    Aso thinks. "Cut a long bamboo pole. Go to the river and argue with yourself about whether Onini is truly as long as the pole. His pride will make him measure himself."
    
    Ananse does exactly this. When Onini hears the argument, he slithers forth. "I AM longer than that pole!" he hisses. "Tie me to it and see!" Ananse quickly binds the python to the bamboo, head to tail, and carries him to the sky.`,
    choices: [
      {
        id: "skyGod_hornets",
        label: "Continue to the Mmoboro Hornets (Canonical path)",
      },
      {
        id: "skyGod_leopard",
        label: "Hunt Osebo the Leopard next (Alternate path)",
      },
    ],
  },
  skyGod_challenge: {
    id: "skyGod_challenge",
    title: "The Harder Path",
    text: `With his mother Ya Nsia's blessing, Ananse sets out on the five-fold quest. He traps Onini the Python by appealing to pride, captures the Mmoboro Hornets with a gourd of rain, snares Osebo in a pit, tricks Mmoatia with a tar-doll, and brings his mother to the sky as proof of devotion.
    
    Nyame is astonished. He gathers the elders (Kontire, Akwam, the Oyoko chiefs) and declares: "Henceforth, all stories belong to Kwaku Ananse. They will be called Anansesem, spider-stories, for all time."`,
    choices: [
      { id: "skyGod_epilogue", label: "Return to earth with the stories" },
    ],
  },
  skyGod_hornets: {
    id: "skyGod_hornets",
    title: "The Second Capture: Mmoboro Hornets",
    text: `Ananse goes to the hornets' tree. Aso advises: "Fill a gourd with water. Pour some on them, then on yourself, and say the rains have come. Offer them shelter in an empty gourd."
    
    Ananse does so. The hornets, confused and damp, swarm into the gourd. He seals it and takes them to Nyame.`,
    choices: [
      {
        id: "skyGod_leopard",
        label: "Hunt Osebo the Leopard (Canonical path)",
      },
      { id: "skyGod_fairy", label: "Seek Mmoatia the Fairy (Alternate path)" },
    ],
  },
  skyGod_leopard: {
    id: "skyGod_leopard",
    title: "The Third Capture: Osebo the Leopard",
    text: `For Osebo, Ananse digs a deep pit on the leopard's path and covers it with branches. When the leopard falls in, Ananse leans over the edge.
    
    "Osebo! I will help you escape if you let me bind a rope around you to pull you up." The proud leopard agrees. Once bound, Ananse hauls him not out, but up the thread to the sky.`,
    choices: [
      { id: "skyGod_fairy", label: "Seek Mmoatia the Fairy (Canonical path)" },
      {
        id: "skyGod_prideEnd",
        label: "Present what you have now (Alternate ending)",
      },
    ],
  },
  skyGod_fairy: {
    id: "skyGod_fairy",
    title: "The Fourth Capture: Mmoatia the Invisible Fairy",
    text: `Mmoatia is the hardest. Aso says: "Carve a wooden doll and cover it with sticky tree sap. Place a bowl of mashed yam before it."
    
    Ananse does so. Mmoatia appears, invisible but hungry. She asks the doll to share. When it doesn't respond, she strikes it and sticks fast. Ananse wraps her in cloth and takes her to the sky.
    
    Nyame counts the four captures: Python, Hornets, Leopard, Fairy. He calls his council and declares the stories now belong to Ananse.`,
    choices: [
      {
        id: "skyGod_canonEnd",
        label: "Receive the golden box of stories (Canonical ending)",
      },
      {
        id: "skyGod_greedEnd",
        label: "Ask for more than stories (Alternate ending)",
      },
    ],
  },
  skyGod_canonEnd: {
    id: "skyGod_canonEnd",
    title: "The Stories Are Ananse's",
    text: `Nyame opens the golden box and its light spills across the clouds like dawn. "From this day forward," he proclaims, "all stories are Anansesem, Ananse's stories. Tell them well, spider, for they are the soul of your people."
    
    Ananse descends the silk thread with the box strapped to his back. When he reaches earth, he opens it, and stories fly out like birds (some tragic, some joyful, some cunning) and settle into every village and every hearth. From that day to this, whenever a story is told, it carries Ananse's name.
    
    **CANONICAL ENDING: This is the traditional version of the tale, told across Ghana and the diaspora. Ananse's cleverness earns him the title of storykeeper, a role he holds to this day.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  skyGod_greedEnd: {
    id: "skyGod_greedEnd",
    title: "The Greedy Spider",
    text: `"Great Nyame," Ananse says, "I have done the impossible. Surely I deserve not just stories, but also wealth, power, and a seat among the gods."
    
    Nyame's eyes narrow. "You have wit, spider, but not wisdom. Stories were enough; they would have made you immortal. But greed has a price."
    
    He takes back the golden box. Ananse descends empty-handed. From that day, he must earn each story through trickery and toil, and his name becomes a warning: cleverness without humility leads to loss.
    
    **ALTERNATE ENDING: In this version, Ananse's greed costs him the gift. Some storytellers use this ending to teach that cunning must be tempered with gratitude.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  skyGod_prideEnd: {
    id: "skyGod_prideEnd",
    title: "Incomplete Bargain",
    text: `Ananse presents three of the four captures to Nyame. "Great Sky God, see what I have brought: Python, Hornets, and Leopard. Surely this is enough?"
    
    Nyame shakes his head. "A bargain is a bargain, spider. Four I asked for; four you must bring. Return when you have Mmoatia."
    
    Ananse leaves without the stories. He spends years trying to catch the fairy, but she eludes him. His name becomes a lesson: half-measures do not buy whole rewards.
    
    **ALTERNATE ENDING: This version teaches the importance of seeing tasks through to completion.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  skyGod_epilogue: {
    id: "skyGod_epilogue",
    title: "The Price of Devotion",
    text: `Ananse returns with the golden box, but the cost weighs heavy. He brought his own mother to the sky as proof of commitment, a sacrifice that haunts him. The stories he earned are bittersweet, for they remind him that even cleverness has its price.
    
    Still, he tells the tales. They spread across the land, carrying wisdom and warning alike. And always, in the corner of each story, is the question: what would you sacrifice for immortality?
    
    **ALTERNATE ENDING: This version explores the emotional cost of Ananse's ambition, a reminder that every bargain has hidden weight.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },

  // TRADITIONAL STORY 2: Ananse and the Pot of Wisdom
  wisdomPotIntro: {
    id: "wisdomPotIntro",
    title: "Ananse and the Pot of Wisdom",
    text: `Once, all the wisdom in the world was scattered like seeds across the earth. Ananse the spider thought to himself: "If I gather all the wisdom and keep it for myself, I will be the wisest creature ever known. Everyone will come to me, and I will be powerful."
    
    So he traveled from village to village, forest to river, mountain to shore, collecting every piece of wisdom he could find. He gathered them all into a large clay pot, sealing it with a woven lid.
    
    "Now," he said, "I must hide this pot where no one can find it. I will put it at the top of the tallest tree."`,
    choices: [
      {
        id: "wisdomPot_climb",
        label: "Climb the tree with the pot (Canonical path)",
      },
      { id: "wisdomPot_bury", label: "Bury the pot instead (Alternate path)" },
    ],
  },
  wisdomPot_climb: {
    id: "wisdomPot_climb",
    title: "The Difficult Climb",
    text: `Ananse tied the pot to his belly with a strong cord and began to climb the tallest palm tree. But the pot was heavy and awkward, and it kept bumping against the trunk. He slipped and struggled, again and again, unable to make progress.
    
    Below, his young son Ntikuma watched. Finally, Ntikuma called up: "Father, why don't you tie the pot to your back? Then you can climb easily."
    
    Ananse stopped. He realized his son was right.`,
    choices: [
      {
        id: "wisdomPot_anger",
        label: "Become angry at being outsmarted (Canonical path)",
      },
      {
        id: "wisdomPot_grateful",
        label: "Thank Ntikuma for the wisdom (Alternate path)",
      },
    ],
  },
  wisdomPot_bury: {
    id: "wisdomPot_bury",
    title: "The Buried Pot",
    text: `Ananse digs a deep hole at the base of the tree and buries the pot, covering it with leaves and stones. "There," he says. "No one will find it here."
    
    But wisdom cannot be buried. It seeps into the soil, into the roots of the tree, into the water that flows underground. Soon, the forest itself grows wise: the animals speak in riddles, the birds sing prophecies, and even the leaves whisper secrets.
    
    Ananse realizes his mistake: wisdom shared becomes greater; wisdom hoarded becomes lost.
    
    **ALTERNATE ENDING: This version teaches that wisdom cannot be contained; it must flow freely to thrive.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  wisdomPot_anger: {
    id: "wisdomPot_anger",
    title: "The Scattered Wisdom",
    text: `Furious that a child had shown him wisdom he himself had missed, Ananse lost his temper. In a fit of rage, he hurled the pot from the tree.
    
    The pot shattered on the ground. Wisdom spilled out like rain: some pieces flying into the wind, some sinking into the earth, some carried away by the river. It spread across the world, settling into people, animals, and plants.
    
    From that day on, wisdom was no longer held by one being. Everyone possessed a small piece. And Ananse learned a hard lesson: that even he, the clever one, did not hold all knowledge.
    
    **CANONICAL ENDING: This is the traditional version, teaching that wisdom is scattered among all beings, and that humility is the beginning of understanding.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  wisdomPot_grateful: {
    id: "wisdomPot_grateful",
    title: "The Shared Wisdom",
    text: `Ananse climbed down the tree and embraced his son. "Ntikuma," he said, "you have shown me that even the wisest can learn from the youngest."
    
    He untied the pot and opened it. Together, father and son poured out the wisdom, letting it spread across the village. People gathered it up: some took pieces of healing, others of music, others of farming or building.
    
    From that day on, wisdom belonged to the community, and Ananse became not the hoarder of wisdom, but the teacher who helped it flow.
    
    **ALTERNATE ENDING: In this version, Ananse learns to share rather than hoard, becoming a figure of generosity.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },

  // ORIGINAL STORY: Market Morning
  marketIntro: {
    id: "marketIntro",
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
    text: `You tuck the small story into your pocket and move on through the vendor aisles. The kindness travels with the merchant, a soft thread in the day's weaving; small, but not without consequence.
    
    **MARKET ENDING: This is a gentle, contemplative ending where Ananse's small kindness ripples quietly through the community.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
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
    text: `The argument spirals beyond Kweku's control: rumor fans into grievance and grievance into fights. Stalls close early, and the market's chorus fractures into silence. Alone, Ananse watches and wonders if his cleverness has a price too heavy to pay.
    
    **MARKET ENDING: A cautionary conclusion where unchecked trickery harms the social fabric.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
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
    text: `The chief's decree is a cold wind: Kweku is sent beyond the market's boundary. In exile he sits by new fires, spinning new webs and weighing how his cleverness has cut him loose from the people he played among. The tale becomes one of solitude and slow reflection.
    
    **MARKET ENDING: Exile, the trickster pays the ultimate social price.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  epilogue: {
    id: "epilogue",
    title: "Twilight Threads",
    text: `At dusk the market folds into itself and lanterns blink like catching insects. You gather the day's threads, cunning and kindness, rupture and repair and feel how a single choice shifts the weave of many lives. The trickster's motif endures: story is a tool of power and of repair, and every retelling remakes the world a little.
    
    **MARKET ENDING: A reflective, metanarrative conclusion about storytelling itself.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
  },
  legacy: {
    id: "legacy",
    title: "Legacy",
    text: `Kweku sets ink to bark and writes the day's story, knowing that children will tell it in new tongues. The myth is not finished; it lives by being told and retold, each teller reshaping the web anew.
    
    **MARKET ENDING: The story becomes part of the oral tradition, passed down through generations.**`,
    choices: [{ id: "start", label: "Return to story selection" }],
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
  // Traditional Story Summaries
  skyGod_canonEnd: `This is the canonical West African tale recorded by R.S. Rattray and told across Ghana for generations. It establishes Ananse as the keeper of all stories, a role that makes him a cultural hero and symbol of oral tradition. The tale teaches that cleverness, persistence, and cunning can overcome impossible challenges.`,
  skyGod_greedEnd: `This alternate ending explores the consequences of hubris. Many trickster tales include a moral warning: wisdom is the balancing force against cleverness. This version reminds us that even great feats mean nothing without humility and gratitude.`,
  skyGod_prideEnd: `A variation that emphasizes the importance of completing what one starts. Half-measures and shortcuts are common temptations in trickster tales, and this ending serves as a warning against them.`,
  skyGod_epilogue: `This version highlights the emotional and ethical costs of ambition. While Ananse wins the stories, his sacrifice of Ya Nsia (his mother) leaves a wound that no amount of fame can heal. It's a meditation on what we give up to achieve greatness.`,

  wisdomPot_anger: `The canonical version of the "Pot of Wisdom" tale, teaching that wisdom cannot be hoarded by one person; it belongs to all. Ananse's anger at being outsmarted by his own son is a humbling moment, reminding us that pride often blinds us to simple truths.`,
  wisdomPot_grateful: `An alternate, redemptive version where Ananse learns the lesson without losing his temper. This ending emphasizes generosity and community, turning the trickster into a teacher rather than a hoarder.`,
  wisdomPot_bury: `This variation uses the metaphor of buried wisdom seeping into nature, suggesting that knowledge cannot be contained; it will find a way to spread. It's a more mystical take on the story's central theme.`,

  // Market Story Summaries
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
  befriend: `This variant shows Ananse cultivating ties rather than exploiting them: the trickster who makes allies and learns reciprocal care.`,
  alliance: `Ananse leverages friendship and information to protect and bind communities; cunning becomes social capital.`,
  doubleCross: `A cautionary thread: the trickster who uses others must account for betrayal; favors can fracture when survival is at stake.`,
  accomplice: `The accomplice arc explores loyalty and leverage, underscoring how human strands complicate a spider's web.`,
  trial: `A formal reckoning: when story becomes evidence, the community negotiates justice through narrative and testimony.`,
  reconciliation: `A restorative ending where stories and shared labor rebuild trust; it highlights repair over punishment.`,
  festival: `A meta-ending: the market ritualizes the tale and transforms it into communal memory, exactly how myths live on.`,
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
