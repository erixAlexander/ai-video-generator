const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Write a script to generate a 30 seconds video on topic: interesting historical story along with AI image prompt in Realistic format for each scene give me the result in JSON format with imagePrompt and ContextText as field",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "scenes": [\n    {\n      "imagePrompt": "A bustling 16th-century European port city, with tall ships at dock, merchants haggling, and people from various cultures interacting. Golden hour lighting, realistic style, vibrant colors.",\n      "contextText": "The year is 1522. The world is just beginning to truly open up, and the port of Seville is a melting pot of cultures and dreams."\n    },\n    {\n      "imagePrompt": "A close-up of a young, determined, dark-haired man with a map partially unrolled on a wooden table. He looks focused, with a spark of ambition in his eyes. Intricate details of 16th-century clothing and cartography. Realistic style, dramatic lighting.",\n        "contextText": "Our story focuses on a young cartographer named Diego, his eyes fixed on the unexplored corners of the world maps."\n    },\n    {\n      "imagePrompt": "A worn, handwritten letter with a wax seal, resting on top of the map. The letter is open slightly and shows intricate calligraphy. Realistic detail and a vintage feel.",\n         "contextText":"Diego dreams of a faster way to the spice islands and the precious cargo they held, but his dreams are hampered by the old and flawed European maps. He receives a letter."\n    },\n     {\n      "imagePrompt": "An elaborate secret room, filled with old books and strange instruments. A single window illuminates the space. Diego, now slightly older and more weathered, studies a book with focused intent. Realistic style, low-key lighting, hints of magical elements.",\n       "contextText": "The letter reveals the existence of a secret society that guarded even older texts and maps, hinting at a hidden river in the Americas that flows all the way to the Pacific."\n     },\n    {\n      "imagePrompt": "Diego, now a seasoned traveler, stands at the edge of a grand, unknown river with lush jungles on either side. He looks determined, holding a worn compass. A small group of explorers and indigenous people are seen in the background.  Realistic style, daylight, immersive perspective.",\n      "contextText": "Fueled by this new knowledge, Diego and his crew set sail for the Americas, searching for the legendary river. He and his crew would encounter danger and wonder at every turn."\n    },\n    {\n      "imagePrompt":"A wide shot of a small boat navigating a rough river, with dense rainforest on either side and high, rocky cliffs in the distance. A sense of isolation and adventure, realistic style, natural lighting",\n        "contextText":"After months of travel, they finally located the hidden river, a natural wonder previously only whispered about in hushed tones."\n     },\n    {\n      "imagePrompt":"Diego stands on the shore of a vast ocean, the sun setting over the horizon, a sense of accomplishment in his posture, the ship that sailed across the river is seen anchored nearby. Realistic style, warm colors, dramatic lighting.",\n      "contextText":"And finally, they emerged on the other side of the continent, having found a new passage to the Pacific. A feat previously considered impossible, Diego changed how the world was mapped."\n    },\n    {\n      "imagePrompt": "A stylized final shot, showing a map with Diego\'s route highlighted, morphing into a modern-day world map. Text overlay: \'Sometimes, the greatest discoveries are hidden in the stories we don\'t know.\' Realistic style transition.",\n       "contextText": "Diego\'s incredible voyage has largely been forgotten by history, yet he proved that the edge of the map is not the edge of possibility. A little bit of imagination can change the world!"\n     }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});
