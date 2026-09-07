const fs = require('fs');

const generateStories = () => {
  const stories = [];
  const categories = ['Animals', 'Moral', 'Family', 'Nature', 'School', 'Fantasy', 'Funny', 'Friendship', 'Festival', 'Bedtime'];
  const titles = [
    { t: 'முயலும் ஆமையும்', e: 'The Rabbit and the Tortoise', m: 'பொறுமையே வெற்றி தரும்', i: '🐢' },
    { t: 'சிங்கமும் எலியும்', e: 'The Lion and the Mouse', m: 'சிறியவரும் உதவலாம்', i: '🦁' },
    { t: 'காகமும் நரியும்', e: 'The Crow and the Fox', m: 'புகழ்ச்சிக்கு மயங்காதே', i: '🐦' },
    { t: 'புத்திசாலி காகம்', e: 'The Thirsty Crow', m: 'முயற்சி திருவினையாக்கும்', i: '💧' },
    { t: 'பேசும் கிளி', e: 'The Talking Parrot', m: 'இனிமையாக பேசுவோம்', i: '🦜' },
    { t: 'நல்ல நண்பர்கள்', e: 'Good Friends', m: 'நட்பே உயர்வு', i: '🤝' },
    { t: 'உதவி செய்யும் எறும்பு', e: 'The Helpful Ant', m: 'உதவி செய்வோம்', i: '🐜' },
    { t: 'அம்மாவின் அன்பு', e: 'Mother\'s Love', m: 'அன்பே சிவம்', i: '❤️' },
    { t: 'அழகான மயில்', e: 'The Beautiful Peacock', m: 'கர்வம் கூடாது', i: '🦚' },
    { t: 'மாயப் பென்சில்', e: 'The Magic Pencil', m: 'கற்பனை செய்', i: '✏️' },
    { t: 'முதல் நாள் பள்ளி', e: 'First Day of School', m: 'பள்ளியே கோவில்', i: '🏫' },
    { t: 'நிலா பாட்டி', e: 'Grandma Moon', m: 'கதை கேட்போம்', i: '🌙' },
    { t: 'குரங்கும் தொப்பியும்', e: 'The Monkey and the Hats', m: 'புத்திசாலித்தனம்', i: '🐒' },
    { t: 'தங்க முட்டை', e: 'The Golden Egg', m: 'பேராசை பெரு நஷ்டம்', i: '🥚' },
    { t: 'சின்ன விதை', e: 'The Little Seed', m: 'வளர்ச்சி', i: '🌱' },
    { t: 'வண்ணத்துப்பூச்சி', e: 'The Butterfly', m: 'அழகு', i: '🦋' },
    { t: 'நாயும் எலும்பும்', e: 'The Dog and the Bone', m: 'கிடைத்ததை வைத்து மகிழ்', i: '🐶' },
    { t: 'பொங்கல் திருநாள்', e: 'Pongal Festival', m: 'உழவர் திருநாள்', i: '🌾' },
    { t: 'பறக்கும் கம்பளம்', e: 'Flying Carpet', m: 'உலகம் பெரியது', i: '✨' },
    { t: 'மீன் குட்டி', e: 'The Little Fish', m: 'பாதுகாப்பு', i: '🐟' }
  ];

  for (let i = 0; i < 20; i++) {
    const title = titles[i];
    stories.push({
      id: `story00${i + 1}`.slice(-8),
      titleTamil: title.t,
      titleEnglish: title.e,
      category: categories[i % categories.length],
      level: i + 1,
      difficulty: i < 7 ? 'easy' : (i < 14 ? 'medium' : 'hard'),
      estimatedMinutes: 2 + (i % 3),
      content: [
        {
          id: `s${i}_1`,
          tamilText: `இது ${title.t} கதை. ஒரு ஊரில்...`,
          englishText: `This is the story of ${title.e}. In a village...`,
          imageIcon: title.i
        },
        {
          id: `s${i}_2`,
          tamilText: `அவர்கள் காட்டுக்குச் சென்றார்கள். அங்கு...`,
          englishText: `They went to the forest. There...`,
          imageIcon: '🌳'
        },
        {
          id: `s${i}_3`,
          tamilText: `கதை முடிந்தது. நீதி: ${title.m}`,
          englishText: `The story ended. Moral: ${title.m}`,
          imageIcon: '✨'
        }
      ],
      vocabulary: [
        { id: `v${i}_1`, word: 'காடு', english: 'Forest', pronunciation: 'Kaadu' },
        { id: `v${i}_2`, word: 'நண்பன்', english: 'Friend', pronunciation: 'Nanban' },
        { id: `v${i}_3`, word: 'கதை', english: 'Story', pronunciation: 'Kathai' }
      ],
      questions: [
        {
          id: `q${i}_1`,
          type: 'multiple_choice',
          question: `இந்த கதை எதைப் பற்றியது? (What is this story about?)`,
          options: [
            { id: 'o1', text: title.t, isCorrect: true },
            { id: 'o2', text: 'புலி', isCorrect: false },
            { id: 'o3', text: 'பள்ளி', isCorrect: false }
          ]
        },
        {
          id: `q${i}_2`,
          type: 'true_false',
          question: `இந்த கதை நல்ல நீதியைத் தருகிறதா? (Does this story give a good moral?)`,
          options: [
            { id: 't1', text: 'ஆம் (Yes)', isCorrect: true },
            { id: 't2', text: 'இல்லை (No)', isCorrect: false }
          ]
        }
      ],
      moral: title.m,
      xpReward: 50 + (i * 2),
      illustration: title.i
    });
  }
  return stories;
};

const generateRhymes = () => {
  const rhymes = [];
  const categories = ['Animals', 'Alphabet', 'Colors', 'Numbers', 'Nature', 'School', 'Good Habits'];
  const titles = [
    { t: 'நிலா நிலா ஓடி வா', e: 'Moon Moon Come Running', i: '🌕' },
    { t: 'கை வீசம்மா கை வீசு', e: 'Swing Your Hands', i: '👋' },
    { t: 'தோசையம்மா தோசை', e: 'Dosa Mother Dosa', i: '🥞' },
    { t: 'யானை யானை', e: 'Elephant Elephant', i: '🐘' },
    { t: 'நாய்க்குட்டி', e: 'Puppy', i: '🐕' },
    { t: 'அம்மா இங்கே வா வா', e: 'Mother Come Here', i: '👩‍👧' },
    { t: 'மழை வருது', e: 'Rain is Coming', i: '🌧️' },
    { t: 'வண்ணத்துப்பூச்சி', e: 'Butterfly', i: '🦋' },
    { t: 'குட்டிப் பூனை', e: 'Little Cat', i: '🐈' },
    { t: 'பள்ளிக்குச் செல்வோம்', e: 'Let\'s Go to School', i: '🏫' },
    { t: 'ஓடி விளையாடு பாப்பா', e: 'Run and Play Child', i: '🏃' },
    { t: 'சின்னஞ்சிறு குருவி', e: 'Little Sparrow', i: '🐦' },
    { t: 'மாம்பழம்', e: 'Mango', i: '🥭' },
    { t: 'காகம் ஒன்று', e: 'One Crow', i: '🦅' },
    { t: 'பாட்டி சுட்ட வடை', e: 'Grandma\'s Vada', i: '🍩' },
    { t: 'வண்ணங்கள்', e: 'Colors', i: '🎨' },
    { t: 'எண்கள்', e: 'Numbers', i: '🔢' },
    { t: 'பற்கள் துலக்கு', e: 'Brush Teeth', i: '🪥' },
    { t: 'மரம் வளர்ப்போம்', e: 'Grow Trees', i: '🌳' },
    { t: 'தமிழ் மொழி', e: 'Tamil Language', i: 'தமிழ்' }
  ];

  for (let i = 0; i < 20; i++) {
    const title = titles[i];
    rhymes.push({
      id: `rhyme00${i + 1}`.slice(-8),
      titleTamil: title.t,
      titleEnglish: title.e,
      category: categories[i % categories.length],
      level: i + 1,
      difficulty: i < 10 ? 'easy' : 'medium',
      lyrics: [
        { id: `l${i}_1`, tamilText: `${title.t} !`, englishText: `${title.e} !` },
        { id: `l${i}_2`, tamilText: `அழகு அழகு ${title.t}`, englishText: `Beautiful beautiful ${title.e}` },
        { id: `l${i}_3`, tamilText: `எல்லோருக்கும் பிடிக்கும்`, englishText: `Everyone likes it` }
      ],
      vocabulary: [
        { id: `v${i}_1`, word: 'அழகு', english: 'Beautiful', pronunciation: 'Azhagu' },
        { id: `v${i}_2`, word: 'பாட்டு', english: 'Song', pronunciation: 'Paattu' }
      ],
      xpReward: 30 + i,
      illustration: title.i
    });
  }
  return rhymes;
};

const storiesCode = `import { TamilStory } from '../types';

export const STORIES_DATA: TamilStory[] = ${JSON.stringify(generateStories(), null, 2)};
`;

const rhymesCode = `import { TamilRhyme } from '../types';

export const RHYMES_DATA: TamilRhyme[] = ${JSON.stringify(generateRhymes(), null, 2)};
`;

fs.writeFileSync('src/data/storyData.ts', storiesCode);
fs.writeFileSync('src/data/rhymeData.ts', rhymesCode);
console.log('Data generated');
