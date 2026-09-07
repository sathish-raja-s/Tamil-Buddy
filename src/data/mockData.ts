import { TamilLetter, Badge, TamilStory as Story, QuizQuestion } from '../types';

export const UYIR_LETTERS: TamilLetter[] = [
  { id: 'u_a', category: 'uyir', letter: 'அ', word: 'அம்மா', englishMeaning: 'Mother', pronunciation: 'a', illustration: '👩‍👧' },
  { id: 'u_aa', category: 'uyir', letter: 'ஆ', word: 'ஆடு', englishMeaning: 'Goat', pronunciation: 'aa', illustration: '🐐' },
  { id: 'u_i', category: 'uyir', letter: 'இ', word: 'இலை', englishMeaning: 'Leaf', pronunciation: 'i', illustration: '🍃' },
  { id: 'u_ii', category: 'uyir', letter: 'ஈ', word: 'ஈட்டி', englishMeaning: 'Spear', pronunciation: 'ii', illustration: '🗡️' },
  { id: 'u_u', category: 'uyir', letter: 'உ', word: 'உரல்', englishMeaning: 'Mortar', pronunciation: 'u', illustration: '🥣' },
  { id: 'u_uu', category: 'uyir', letter: 'ஊ', word: 'ஊஞ்சல்', englishMeaning: 'Swing', pronunciation: 'uu', illustration: '🛝' },
  { id: 'u_e', category: 'uyir', letter: 'எ', word: 'எலி', englishMeaning: 'Rat', pronunciation: 'e', illustration: '🐀' },
  { id: 'u_ee', category: 'uyir', letter: 'ஏ', word: 'ஏணி', englishMeaning: 'Ladder', pronunciation: 'ee', illustration: '🪜' },
  { id: 'u_ai', category: 'uyir', letter: 'ஐ', word: 'ஐந்து', englishMeaning: 'Five', pronunciation: 'ai', illustration: '5️⃣' },
  { id: 'u_o', category: 'uyir', letter: 'ஒ', word: 'ஒட்டகம்', englishMeaning: 'Camel', pronunciation: 'o', illustration: '🐫' },
  { id: 'u_oo', category: 'uyir', letter: 'ஓ', word: 'ஓநாய்', englishMeaning: 'Wolf', pronunciation: 'oo', illustration: '🐺' },
  { id: 'u_au', category: 'uyir', letter: 'ஔ', word: 'ஔவையார்', englishMeaning: 'Poetess', pronunciation: 'au', illustration: '👵' },
];

export const AYTHAM_LETTER: TamilLetter = { id: 'a_k', category: 'aytham', letter: 'ஃ', word: 'எஃகு', englishMeaning: 'Steel', pronunciation: 'ak', illustration: '⚔️' };

export const MEI_LETTERS: TamilLetter[] = [
  { id: 'm_k', category: 'mei', meiGroup: 'vallinam', letter: 'க்', word: 'சக்கரம்', englishMeaning: 'Wheel', pronunciation: 'ik', illustration: '🎡' },
  { id: 'm_ng', category: 'mei', meiGroup: 'mellinam', letter: 'ங்', word: 'சிங்கம்', englishMeaning: 'Lion', pronunciation: 'ing', illustration: '🦁' },
  { id: 'm_ch', category: 'mei', meiGroup: 'vallinam', letter: 'ச்', word: 'தச்சர்', englishMeaning: 'Carpenter', pronunciation: 'ich', illustration: '🪚' },
  { id: 'm_nj', category: 'mei', meiGroup: 'mellinam', letter: 'ஞ்', word: 'இஞ்சி', englishMeaning: 'Ginger', pronunciation: 'inj', illustration: '🫚' },
  { id: 'm_t', category: 'mei', meiGroup: 'vallinam', letter: 'ட்', word: 'பட்டம்', englishMeaning: 'Kite', pronunciation: 'it', illustration: '🪁' },
  { id: 'm_nn', category: 'mei', meiGroup: 'mellinam', letter: 'ண்', word: 'கண்', englishMeaning: 'Eye', pronunciation: 'inn', illustration: '👁️' },
  { id: 'm_th', category: 'mei', meiGroup: 'vallinam', letter: 'த்', word: 'வாத்து', englishMeaning: 'Duck', pronunciation: 'ith', illustration: '🦆' },
  { id: 'm_nd', category: 'mei', meiGroup: 'mellinam', letter: 'ந்', word: 'பந்து', englishMeaning: 'Ball', pronunciation: 'ind', illustration: '⚽' },
  { id: 'm_p', category: 'mei', meiGroup: 'vallinam', letter: 'ப்', word: 'கப்பல்', englishMeaning: 'Ship', pronunciation: 'ip', illustration: '🚢' },
  { id: 'm_m', category: 'mei', meiGroup: 'mellinam', letter: 'ம்', word: 'மரம்', englishMeaning: 'Tree', pronunciation: 'im', illustration: '🌳' },
  { id: 'm_y', category: 'mei', meiGroup: 'idaiyinam', letter: 'ய்', word: 'நாய்', englishMeaning: 'Dog', pronunciation: 'iy', illustration: '🐶' },
  { id: 'm_r', category: 'mei', meiGroup: 'idaiyinam', letter: 'ர்', word: 'தேர்', englishMeaning: 'Chariot', pronunciation: 'ir', illustration: '🛕' },
  { id: 'm_l', category: 'mei', meiGroup: 'idaiyinam', letter: 'ல்', word: 'பல்', englishMeaning: 'Tooth', pronunciation: 'il', illustration: '🦷' },
  { id: 'm_v', category: 'mei', meiGroup: 'idaiyinam', letter: 'வ்', word: 'செவ்வந்தி', englishMeaning: 'Chrysanthemum', pronunciation: 'iv', illustration: '🌼' },
  { id: 'm_zh', category: 'mei', meiGroup: 'idaiyinam', letter: 'ழ்', word: 'யாழ்', englishMeaning: 'Harp', pronunciation: 'izh', illustration: '🪕' },
  { id: 'm_ll', category: 'mei', meiGroup: 'idaiyinam', letter: 'ள்', word: 'வாள்', englishMeaning: 'Sword', pronunciation: 'ill', illustration: '🗡️' },
  { id: 'm_tr', category: 'mei', meiGroup: 'vallinam', letter: 'ற்', word: 'காற்றாலை', englishMeaning: 'Windmill', pronunciation: 'itr', illustration: '🌬️' },
  { id: 'm_n', category: 'mei', meiGroup: 'mellinam', letter: 'ன்', word: 'மீன்', englishMeaning: 'Fish', pronunciation: 'in', illustration: '🐟' },
];

const MEI_BASES = ['க','ங','ச','ஞ','ட','ண','த','ந','ப','ம','ய','ர','ல','வ','ழ','ள','ற','ன'];
const UYIR_MODIFIERS = ['','ா','ி','ீ','ு','ூ','ெ','ே','ை','ொ','ோ','ௌ'];
const UYIR_LETTERS_SIMPLE = ['அ','ஆ','இ','ஈ','உ','ஊ','எ','ஏ','ஐ','ஒ','ஓ','ஔ'];

export const generateUyirmeiLetters = (): TamilLetter[] => {
  const uyirmei: TamilLetter[] = [];
  MEI_LETTERS.forEach((mei, meiIndex) => {
    const baseChar = MEI_BASES[meiIndex];
    UYIR_LETTERS_SIMPLE.forEach((uyirChar, uyirIndex) => {
      const modifier = UYIR_MODIFIERS[uyirIndex];
      const combinedLetter = baseChar + modifier;
      
      let sampleWord = combinedLetter;
      let engMeaning = '...';
      let ill = '📝';
      
      if (combinedLetter === 'க') { sampleWord = 'கடல்'; engMeaning = 'Sea'; ill = '🌊'; }
      if (combinedLetter === 'கா') { sampleWord = 'காகம்'; engMeaning = 'Crow'; ill = '🐦‍⬛'; }
      if (combinedLetter === 'கி') { sampleWord = 'கிளி'; engMeaning = 'Parrot'; ill = '🦜'; }
      if (combinedLetter === 'கு') { sampleWord = 'குரங்கு'; engMeaning = 'Monkey'; ill = '🐒'; }
      if (combinedLetter === 'கை') { sampleWord = 'கை'; engMeaning = 'Hand'; ill = '🖐️'; }
      
      uyirmei.push({
        id: `um_${meiIndex}_${uyirIndex}`,
        category: 'uyirmei',
        letter: combinedLetter,
        components: { mei: mei.letter, uyir: uyirChar },
        word: sampleWord,
        englishMeaning: engMeaning,
        pronunciation: `${mei.pronunciation.replace('i','')} + ${UYIR_LETTERS[uyirIndex].pronunciation}`,
        illustration: ill
      });
    });
  });
  return uyirmei;
};

export const UYIRMEI_LETTERS = generateUyirmeiLetters();
export const TAMIL_LETTERS: TamilLetter[] = [...UYIR_LETTERS, ...MEI_LETTERS, AYTHAM_LETTER, ...UYIRMEI_LETTERS];
