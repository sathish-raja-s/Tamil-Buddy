export type HeritageCategory = 'Bharathiyar' | 'Thirukkural' | 'Aathichudi' | 'Sangam' | 'Proverbs' | 'Avvaiyar' | 'Bharathidasan';

export interface PoemLine {
  id: string;
  tamilText: string;
  englishText: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  english: string;
  pronunciation: string;
}

export interface HeritageItem {
  id: string;
  titleTamil: string;
  titleEnglish: string;
  category: HeritageCategory;
  author: string;
  simpleMeaning: string;
  englishMeaning: string;
  lifeLesson?: string;
  lyrics: PoemLine[];
  vocabulary: Vocabulary[];
  xpReward: number;
  illustration: string;
  level: number;
}

export const HERITAGE_DATA: HeritageItem[] = [
  {
    id: "h_b_001",
    titleTamil: "ஓடி விளையாடு பாப்பா",
    titleEnglish: "Play and Run, Child",
    category: "Bharathiyar",
    author: "மகாகவி சுப்பிரமணிய பாரதியார்",
    simpleMeaning: "குழந்தைகள் எப்போதும் சுறுசுறுப்பாகவும், தைரியமாகவும் இருக்க வேண்டும். மாலை நேரத்தில் உடற்பயிற்சி மற்றும் விளையாட்டு மிகவும் முக்கியம்.",
    englishMeaning: "Children should always be active and brave. Playing in the evening is very important.",
    lifeLesson: "சுறுசுறுப்பாகவும், ஆரோக்கியமாகவும் இருங்கள் (Be active and healthy).",
    level: 1,
    xpReward: 20,
    illustration: "🏃🏽‍♀️",
    lyrics: [
      { id: "l1", tamilText: "ஓடி விளையாடு பாப்பா,", englishText: "Run and play, child," },
      { id: "l2", tamilText: "நீ ஓய்ந்திருக்க லாகாது பாப்பா.", englishText: "You shouldn't rest/stay idle, child." },
      { id: "l3", tamilText: "கூடி விளையாடு பாப்பா,", englishText: "Play together, child," },
      { id: "l4", tamilText: "ஒரு குழந்தையை வையாதே பாப்பா.", englishText: "Don't scold another child." }
    ],
    vocabulary: [
      { id: "v1", word: "ஓடி", english: "Run", pronunciation: "Odi" },
      { id: "v2", word: "விளையாடு", english: "Play", pronunciation: "Vilaiyaadu" },
      { id: "v3", word: "கூடி", english: "Together", pronunciation: "Koodi" }
    ]
  },
  {
    id: "h_t_001",
    titleTamil: "அகர முதல எழுத்தெல்லாம்",
    titleEnglish: "A is the first letter",
    category: "Thirukkural",
    author: "திருவள்ளுவர்",
    simpleMeaning: "எழுத்துக்கள் எல்லாம் 'அ' என்ற எழுத்தில் தொடங்குகின்றன. அதுபோல, இந்த உலகம் கடவுளில் தொடங்குகிறது.",
    englishMeaning: "Just as 'A' is the beginning of all letters, God is the beginning of this world.",
    lifeLesson: "ஆரம்பத்தை மறக்காதே (Don't forget the beginning).",
    level: 5,
    xpReward: 15,
    illustration: "🪷",
    lyrics: [
      { id: "l1", tamilText: "அகர முதல எழுத்தெல்லாம் ஆதி", englishText: "A is the starting for all letters" },
      { id: "l2", tamilText: "பகவன் முதற்றே உலகு.", englishText: "God is the starting for the world." }
    ],
    vocabulary: [
      { id: "v1", word: "அகரம்", english: "Letter A", pronunciation: "Agaram" },
      { id: "v2", word: "உலகு", english: "World", pronunciation: "Ulagu" }
    ]
  },
  {
    id: "h_a_001",
    titleTamil: "அறம் செய விரும்பு",
    titleEnglish: "Desire to do good",
    category: "Aathichudi",
    author: "ஔவையார்",
    simpleMeaning: "நல்ல செயல்களைச் செய்ய நாம் எப்போதும் ஆசைப்பட வேண்டும்.",
    englishMeaning: "We should always desire to do good deeds.",
    lifeLesson: "எப்போதும் நல்லதே செய் (Always do good).",
    level: 2,
    xpReward: 10,
    illustration: "🤝",
    lyrics: [
      { id: "l1", tamilText: "அறம் செய விரும்பு", englishText: "Desire to do good deeds" }
    ],
    vocabulary: [
      { id: "v1", word: "அறம்", english: "Good deed", pronunciation: "Aram" },
      { id: "v2", word: "விரும்பு", english: "Desire", pronunciation: "Virumbu" }
    ]
  },
  {
    id: "h_p_001",
    titleTamil: "கற்றது கைமண் அளவு",
    titleEnglish: "What we learned is a handful",
    category: "Proverbs",
    author: "ஔவையார்",
    simpleMeaning: "நாம் கற்றுக்கொண்டது கையில் உள்ள மண் அளவுதான். இன்னும் கற்றுக்கொள்ள வேண்டியது உலகம் அளவு உள்ளது.",
    englishMeaning: "What we have learned is only a handful of sand. What is left to learn is as big as the world.",
    lifeLesson: "கற்றுக்கொண்டே இரு (Keep learning).",
    level: 8,
    xpReward: 10,
    illustration: "🌍",
    lyrics: [
      { id: "l1", tamilText: "கற்றது கைமண் அளவு,", englishText: "What is learned is a handful of sand," },
      { id: "l2", tamilText: "கல்லாதது உலகளவு.", englishText: "What is unlearned is the size of the world." }
    ],
    vocabulary: [
      { id: "v1", word: "கற்றது", english: "Learned", pronunciation: "Kattrathu" },
      { id: "v2", word: "உலகம்", english: "World", pronunciation: "Ulagam" }
    ]
  }
];

export const EXTRA_HERITAGE_DATA: HeritageItem[] = [
  {
    id: "h_b_002",
    titleTamil: "அச்சமில்லை அச்சமில்லை",
    titleEnglish: "Fear Not, Fear Not",
    category: "Bharathiyar",
    author: "மகாகவி சுப்பிரமணிய பாரதியார்",
    simpleMeaning: "நாம் எந்த சூழ்நிலையிலும் பயப்படாமல் தைரியமாக இருக்க வேண்டும்.",
    englishMeaning: "We should always be brave and not fear any situation.",
    lifeLesson: "தைரியமே துணை (Courage is your companion).",
    level: 3,
    xpReward: 20,
    illustration: "🦁",
    lyrics: [
      { id: "l1", tamilText: "அச்சமில்லை அச்சமில்லை அச்சமென்பதில்லையே", englishText: "Fear not, fear not, there is no fear" },
      { id: "l2", tamilText: "இச்சகத்து ளோரெலாம் எதிர்த்து நின்ற போதிலும்,", englishText: "Even if the whole world stands against us," },
      { id: "l3", tamilText: "அச்சமில்லை அச்சமில்லை அச்சமென்பதில்லையே", englishText: "Fear not, fear not, there is no fear" }
    ],
    vocabulary: [
      { id: "v1", word: "அச்சம்", english: "Fear", pronunciation: "Acham" },
      { id: "v2", word: "எதிர்த்து", english: "Against/Oppose", pronunciation: "Edhirthu" }
    ]
  },
  {
    id: "h_t_002",
    titleTamil: "அன்பிலார் எல்லாம் தமக்குரியர்",
    titleEnglish: "The Loveless Take All",
    category: "Thirukkural",
    author: "திருவள்ளுவர்",
    simpleMeaning: "அன்பு இல்லாதவர்கள் எல்லாமே தனக்குத்தான் சொந்தம் என்பார்கள். ஆனால் அன்பு உள்ளவர்கள் தங்கள் உடம்பும் பிறருக்கே சொந்தம் என்பார்கள்.",
    englishMeaning: "Those without love want everything for themselves. Those with love will give even their bones to others.",
    lifeLesson: "அன்பே சிவம் (Love is supreme).",
    level: 6,
    xpReward: 15,
    illustration: "❤️",
    lyrics: [
      { id: "l1", tamilText: "அன்பிலார் எல்லாம் தமக்குரியர் அன்புடையார்", englishText: "The loveless claim all for themselves, the loving" },
      { id: "l2", tamilText: "என்பும் உரியர் பிறர்க்கு.", englishText: "offer even their bones to others." }
    ],
    vocabulary: [
      { id: "v1", word: "அன்பு", english: "Love", pronunciation: "Anbu" },
      { id: "v2", word: "பிறர்க்கு", english: "To others", pronunciation: "Pirarkku" }
    ]
  },
  {
    id: "h_a_002",
    titleTamil: "ஆறுவது சினம்",
    titleEnglish: "Cool down your anger",
    category: "Aathichudi",
    author: "ஔவையார்",
    simpleMeaning: "நமக்கு கோபம் வந்தால், அதை உடனே குறைத்துக்கொள்ள வேண்டும். கோபம் ஆபத்தானது.",
    englishMeaning: "When we get angry, we should cool it down immediately. Anger is dangerous.",
    lifeLesson: "கோபத்தை குறை (Reduce anger).",
    level: 2,
    xpReward: 10,
    illustration: "🧘‍♂️",
    lyrics: [
      { id: "l1", tamilText: "ஆறுவது சினம்", englishText: "Cool down your anger" }
    ],
    vocabulary: [
      { id: "v1", word: "சினம்", english: "Anger", pronunciation: "Sinam" },
      { id: "v2", word: "ஆறுவது", english: "To cool down", pronunciation: "Aaruvathu" }
    ]
  },
  {
    id: "h_s_001",
    titleTamil: "யாதும் ஊரே யாவரும் கேளிர்",
    titleEnglish: "Every country is my country, everyone is my kin",
    category: "Sangam",
    author: "கணியன் பூங்குன்றனார்",
    simpleMeaning: "எல்லா ஊரும் நமது ஊர்தான். எல்லா மக்களும் நமது உறவினர்கள்தான். நாம் அனைவரும் ஒற்றுமையாக வாழ வேண்டும்.",
    englishMeaning: "Every town is our town, and everyone is our kin. We should all live in unity.",
    lifeLesson: "உலகம் ஒரு குடும்பம் (The world is one family).",
    level: 9,
    xpReward: 30,
    illustration: "🤝",
    lyrics: [
      { id: "l1", tamilText: "யாதும் ஊரே யாவரும் கேளிர்", englishText: "Every country is my country, everyone is my kin" }
    ],
    vocabulary: [
      { id: "v1", word: "யாதும்", english: "Everything", pronunciation: "Yaathum" },
      { id: "v2", word: "ஊர்", english: "Town/Country", pronunciation: "Oor" },
      { id: "v3", word: "கேளிர்", english: "Relatives", pronunciation: "Kelir" }
    ]
  }
];

HERITAGE_DATA.push(...EXTRA_HERITAGE_DATA);
