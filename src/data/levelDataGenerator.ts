import { TamilLevel, QuizQuestion, QuizDifficulty, GameActivity, TracingActivity } from '../types';
import { UYIR_LETTERS, MEI_LETTERS, AYTHAM_LETTER, UYIRMEI_LETTERS } from './mockData';

const generateOptions = (correct: string, pool: string[]): { id: string; text: string; isCorrect: boolean }[] => {
  const others = pool.filter(p => p !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [...others, correct].sort(() => 0.5 - Math.random());
  return options.map((opt, i) => ({ id: `o${i}`, text: opt, isCorrect: opt === correct }));
};

export const generateTamilLevels = (): TamilLevel[] => {
  const levels: TamilLevel[] = [];
  let questionCount = 1;

  const createId = () => {
    const id = `q${questionCount.toString().padStart(3, '0')}`;
    questionCount++;
    return id;
  };

  const createQuestion = (type: 'learn' | 'practice' | 'challenge', q: string, correct: string, pool: string[], exp: string, hint: string, xp: number): QuizQuestion => ({
    id: createId(),
    type,
    question: q,
    options: generateOptions(correct, pool),
    explanation: exp,
    hint,
    xp
  });

  const generateGame = (chapter: number, index: number, target: any): GameActivity => {
    const types: GameActivity['type'][] = ['letter_tap', 'memory', 'balloon_pop', 'letter_hunt', 'listen_choose'];
    const type = types[(chapter + index) % types.length];
    
    return {
      id: `g_${chapter}_${index}`,
      type,
      title: `Game: ${type.replace('_', ' ').toUpperCase()}`,
      description: 'Play this game to master the concept!',
      difficulty: chapter,
      xp: 15,
      content: { target: target.letter || target }
    };
  };

  const generateTracing = (chapter: number, index: number, target: any, type: TracingActivity['type']): TracingActivity => {
    return {
      id: `t_${chapter}_${index}`,
      character: target.letter || target,
      type,
      difficulty: chapter,
      xp: 20
    };
  };

  const uyirPool = UYIR_LETTERS.map(l => l.letter);
  const meiPool = MEI_LETTERS.map(l => l.letter);
  const uyirmeiPool = UYIRMEI_LETTERS.map(l => l.letter);

  for (let i = 1; i <= 100; i++) {
    let chapter = Math.ceil(i / 10);
    let title = '';
    let description = '';
    let difficulty: QuizDifficulty = 'Easy';
    let questions: QuizQuestion[] = [];
    let games: GameActivity[] = [];
    let tracing: TracingActivity[] = [];

    // Levels 1-10: Uyir Letters
    if (chapter === 1) {
      title = `உயிரெழுத்து (Uyir) - Level ${i}`;
      description = 'Master the Tamil vowels!';
      difficulty = 'Very Easy';
      const letterIndex = (i - 1) % 12;
      const uyir = UYIR_LETTERS[letterIndex];
      const nextUyir = UYIR_LETTERS[(letterIndex + 1) % 12];
      
      games.push(generateGame(chapter, i, uyir));
      tracing.push(generateTracing(chapter, i, uyir, 'uyir'));

      questions = [
        createQuestion('learn', `Identify this vowel: ${uyir.letter}`, uyir.letter, uyirPool, `${uyir.letter} is a Tamil vowel.`, `Look for the letter that looks like ${uyir.letter}.`, 10),
        createQuestion('practice', `Which word starts with ${uyir.letter}?`, uyir.word, [uyir.word, nextUyir.word, 'மரம்', 'பள்ளிக்கூடம்'], `${uyir.word} starts with ${uyir.letter}.`, `The word is related to ${uyir.englishMeaning}.`, 15),
        createQuestion('challenge', `What comes after ${uyir.letter} in the Tamil alphabet?`, nextUyir.letter, uyirPool, `${nextUyir.letter} comes after ${uyir.letter}.`, `Think of the vowel sequence.`, 25)
      ];
    }
    // Levels 11-20: Mei Letters
    else if (chapter === 2) {
      title = `மெய்யெழுத்து (Mei) - Level ${i}`;
      description = 'Master the Tamil consonants (with dots)!';
      difficulty = 'Easy';
      const letterIndex = (i - 1) % 18;
      const mei = MEI_LETTERS[letterIndex];
      
      games.push(generateGame(chapter, i, mei));
      tracing.push(generateTracing(chapter, i, mei, 'mei'));

      questions = [
        createQuestion('learn', `Which of these is a Mei letter?`, mei.letter, [mei.letter, uyirPool[0], uyirPool[1], uyirPool[2]], `Mei letters have a dot on top, like ${mei.letter}.`, `Look for the dot!`, 10),
        createQuestion('practice', `Identify the Mei letter in the word "${mei.word}"`, mei.letter, meiPool, `The Mei letter in ${mei.word} is ${mei.letter}.`, `Look for the letter with a dot in the word.`, 15),
        createQuestion('challenge', `What is the pronunciation of ${mei.letter}?`, mei.pronunciation, MEI_LETTERS.slice(0,4).map(l=>l.pronunciation), `${mei.letter} sounds like ${mei.pronunciation}.`, `Say it out loud.`, 25)
      ];
    }
    // Levels 21-30: Mei Classes (Vallinam, Mellinam, Idaiyinam)
    else if (chapter === 3) {
      title = `மெய்யெழுத்து வகைகள் - Level ${i}`;
      description = 'Learn Vallinam, Mellinam, and Idaiyinam.';
      difficulty = 'Medium';
      const classes = ['vallinam', 'mellinam', 'idaiyinam'];
      const classType = classes[(i - 1) % 3];
      const classLetters = MEI_LETTERS.filter(l => l.meiGroup === classType);
      const letter = classLetters[(i - 1) % classLetters.length];
      
      games.push(generateGame(chapter, i, letter));
      tracing.push(generateTracing(chapter, i, letter, 'mei'));

      questions = [
        createQuestion('learn', `Which group does ${letter.letter} belong to?`, classType, classes.concat('none'), `${letter.letter} is a ${classType} letter.`, `Think about how hard or soft the sound is.`, 10),
        createQuestion('practice', `Find another ${classType} letter:`, classLetters[(i % classLetters.length)].letter, meiPool, `These are ${classType} letters.`, `Match the sound type.`, 15),
        createQuestion('challenge', `Is ${letter.letter} a hard, soft, or medium sound?`, classType === 'vallinam' ? 'Hard' : classType === 'mellinam' ? 'Soft' : 'Medium', ['Hard', 'Soft', 'Medium', 'Silent'], `${classType} represents this sound type.`, `Val = Hard, Mel = Soft, Idai = Medium.`, 25)
      ];
    }
    // Levels 31-40: Aytham & Basic Uyirmei Formation
    else if (chapter === 4) {
      title = `ஆய்தம் & உயிர்மெய் - Level ${i}`;
      description = 'Special letter and combinations begin!';
      difficulty = 'Medium';
      const baseMei = MEI_LETTERS[(i - 1) % 18];
      const uyirmeiA = UYIRMEI_LETTERS.find(u => u.components?.mei === baseMei.letter && u.components?.uyir === 'அ');
      
      games.push(generateGame(chapter, i, uyirmeiA || 'க'));
      tracing.push(generateTracing(chapter, i, AYTHAM_LETTER, 'uyir')); // Or uyirmei

      questions = [
        createQuestion('learn', `What is the special Aytham letter?`, AYTHAM_LETTER.letter, [AYTHAM_LETTER.letter, 'அ', 'க்', 'க'], `Aytham is ${AYTHAM_LETTER.letter}.`, `It has three dots.`, 10),
        createQuestion('practice', `${baseMei.letter} + அ = ?`, uyirmeiA?.letter || 'க', uyirmeiPool, `${baseMei.letter} combined with அ becomes ${uyirmeiA?.letter}.`, `Remove the dot.`, 15),
        createQuestion('challenge', `Which word contains ${AYTHAM_LETTER.letter}?`, AYTHAM_LETTER.word, ['அம்மா', 'பந்து', AYTHAM_LETTER.word, 'மரம்'], `${AYTHAM_LETTER.word} uses the Aytham letter.`, `Look for the three dots.`, 25)
      ];
    }
    // Levels 41-50: K, S, T, Th, P, M Series combinations
    else if (chapter === 5) {
      title = `உயிர்மெய் Combinations - Level ${i}`;
      description = 'Master the hard consonant series.';
      difficulty = 'Hard';
      const kSeriesMei = ['க்', 'ச்', 'ட்', 'த்', 'ப்', 'ம்'];
      const baseMeiStr = kSeriesMei[(i - 1) % kSeriesMei.length];
      const targetUyir = UYIR_LETTERS[(i - 1) % 12];
      const resultLetter = UYIRMEI_LETTERS.find(u => u.components?.mei === baseMeiStr && u.components?.uyir === targetUyir.letter);
      
      games.push(generateGame(chapter, i, resultLetter || 'கா'));
      tracing.push(generateTracing(chapter, i, resultLetter || 'கா', 'uyirmei'));

      questions = [
        createQuestion('learn', `${baseMeiStr} + ${targetUyir.letter} = ?`, resultLetter?.letter || 'கா', uyirmeiPool, `${baseMeiStr} + ${targetUyir.letter} = ${resultLetter?.letter}`, `Combine the sounds.`, 10),
        createQuestion('practice', `What are the components of ${resultLetter?.letter}?`, `${baseMeiStr} + ${targetUyir.letter}`, [`${baseMeiStr} + ${targetUyir.letter}`, `க் + அ`, `ச் + இ`, `ப் + உ`], `${resultLetter?.letter} is formed by ${baseMeiStr} and ${targetUyir.letter}.`, `Break it down.`, 15),
        createQuestion('challenge', `Which word contains ${resultLetter?.letter}?`, resultLetter?.word || 'காகம்', [resultLetter?.word || 'காகம்', 'மரம்', 'பள்ளிக்கூடம்', 'விளையாட்டு'], `${resultLetter?.word} contains ${resultLetter?.letter}.`, `Look closely at the word.`, 25)
      ];
    }
    // Levels 51-60: Complete Uyirmei
    else if (chapter === 6) {
      title = `உயிர்மெய் Master - Level ${i}`;
      description = 'Master all remaining combinations.';
      difficulty = 'Hard';
      const randomUyirmei = UYIRMEI_LETTERS[(i * 3) % UYIRMEI_LETTERS.length];
      
      games.push(generateGame(chapter, i, randomUyirmei));
      tracing.push(generateTracing(chapter, i, randomUyirmei, 'uyirmei'));

      questions = [
        createQuestion('learn', `Identify the components of ${randomUyirmei.letter}`, `${randomUyirmei.components?.mei} + ${randomUyirmei.components?.uyir}`, [`${randomUyirmei.components?.mei} + ${randomUyirmei.components?.uyir}`, `க் + அ`, `ச் + இ`, `ப் + உ`], `It combines ${randomUyirmei.components?.mei} and ${randomUyirmei.components?.uyir}.`, `Look at the base letter and the modifier.`, 10),
        createQuestion('practice', `${randomUyirmei.components?.mei} + ${randomUyirmei.components?.uyir} = ?`, randomUyirmei.letter, uyirmeiPool, `The combination makes ${randomUyirmei.letter}.`, `Add the vowel modifier to the consonant.`, 15),
        createQuestion('challenge', `What is the pronunciation of ${randomUyirmei.letter}?`, randomUyirmei.pronunciation, UYIRMEI_LETTERS.slice(0,4).map(l=>l.pronunciation), `It is pronounced as ${randomUyirmei.pronunciation}.`, `Combine the sounds.`, 25)
      ];
    }
    // Levels 61-70: Vocabulary
    else if (chapter === 7) {
      title = `Vocabulary Builder - Level ${i}`;
      description = 'Learn new words in Tamil!';
      difficulty = 'Advanced';
      const vocabWord = MEI_LETTERS[(i - 1) % 18];
      
      games.push({ ...generateGame(chapter, i, vocabWord), type: 'word_match' });
      tracing.push(generateTracing(chapter, i, vocabWord.word, 'word'));

      questions = [
        createQuestion('learn', `What does "${vocabWord.word}" mean?`, vocabWord.englishMeaning, [vocabWord.englishMeaning, 'Car', 'House', 'Water'], `${vocabWord.word} means ${vocabWord.englishMeaning}.`, `Think about the picture you saw.`, 10),
        createQuestion('practice', `Which Tamil word means "${vocabWord.englishMeaning}"?`, vocabWord.word, meiPool.map((_, i) => MEI_LETTERS[i].word), `The Tamil word is ${vocabWord.word}.`, `Starts with ${vocabWord.word[0]}.`, 15),
        createQuestion('challenge', `Identify the image for "${vocabWord.word}"`, vocabWord.illustration, [vocabWord.illustration, '🚗', '🏠', '💧'], `The image is ${vocabWord.illustration}.`, `It looks like a ${vocabWord.englishMeaning}.`, 25)
      ];
    }
    // Levels 71-80: Word Formation
    else if (chapter === 8) {
      title = `Word Formation - Level ${i}`;
      description = 'Build words from letters.';
      difficulty = 'Advanced';
      const targetWord = 'கப்பல்'; // Sample
      
      games.push({ ...generateGame(chapter, i, targetWord), type: 'word_builder' });
      tracing.push(generateTracing(chapter, i, targetWord, 'word'));

      questions = [
        createQuestion('learn', `What is the first letter of "${targetWord}"?`, targetWord[0], [targetWord[0], 'ப', 'ல்', 'ம'], `The word starts with ${targetWord[0]}.`, `Look at the beginning.`, 10),
        createQuestion('practice', `Which letter is missing: க _ ல்?`, 'ப்ப', ['ப்ப', 'ம', 'ர', 'த'], `The word is ${targetWord}.`, `Think of a ship.`, 15),
        createQuestion('challenge', `Arrange to form a word: ல் / க / ப்ப`, targetWord, [targetWord, 'பல்கப்ப', 'கல்பப்ப', 'பப்பல்க'], `The correct arrangement is ${targetWord}.`, `It means Ship.`, 25)
      ];
    }
    // Levels 81-90: Sentences
    else if (chapter === 9) {
      title = `Sentence Master - Level ${i}`;
      description = 'Form simple Tamil sentences.';
      difficulty = 'Mastery';
      const sentence = 'நான் பள்ளிக்கு செல்கிறேன்.';
      
      games.push({ ...generateGame(chapter, i, sentence), type: 'sentence_builder' });
      tracing.push(generateTracing(chapter, i, sentence, 'sentence'));

      questions = [
        createQuestion('learn', `What does "${sentence}" mean?`, 'I am going to school.', ['I am going to school.', 'I am playing.', 'This is a book.', 'I eat food.'], `It means I am going to school.`, `பள்ளி means school.`, 10),
        createQuestion('practice', `Complete the sentence: நான் ___ செல்கிறேன்.`, 'பள்ளிக்கு', ['பள்ளிக்கு', 'மரம்', 'ஆடு', 'நாய்'], `பள்ளிக்கு fits correctly.`, `Where do you go to study?`, 15),
        createQuestion('challenge', `Arrange the words: செல்கிறேன் / நான் / பள்ளிக்கு`, sentence, [sentence, 'பள்ளிக்கு நான் செல்கிறேன்.', 'செல்கிறேன் நான் பள்ளிக்கு.', 'நான் செல்கிறேன் பள்ளிக்கு.'], `The standard order is Subject - Object - Verb.`, `Start with 'I'.`, 25)
      ];
    }
    // Levels 91-100: Final Mastery
    else {
      title = `Tamil Champion - Level ${i}`;
      description = 'The ultimate Tamil test!';
      difficulty = 'Mastery';
      
      games.push({ ...generateGame(chapter, i, 'வெற்றி'), type: 'word_builder' });
      tracing.push(generateTracing(chapter, i, 'தமிழ்', 'word'));

      questions = [
        createQuestion('learn', `Which of these is a complete sentence?`, 'இது ஒரு புத்தகம்.', ['இது ஒரு புத்தகம்.', 'மரம் நாய்', 'செல்கிறேன் நான்', 'பள்ளி'], `A sentence has a subject and a verb.`, `Look for the one that makes sense.`, 10),
        createQuestion('practice', `Identify the Uyirmei letter in 'மரம்'`, 'ம, ர', ['ம, ர', 'ம்', 'க்', 'அ'], `Both ம and ர are Uyirmei.`, `Look for letters without dots.`, 15),
        createQuestion('challenge', `Translate "He is running" to Tamil.`, 'அவன் ஓடுகிறான்.', ['அவன் ஓடுகிறான்.', 'நான் நடக்கிறேன்.', 'அவள் பாடுகிறாள்.', 'இது மரம்.'], `அவன் = He, ஓடுகிறான் = is running.`, `அவன் means He.`, 25)
      ];
    }

    levels.push({
      level: i,
      chapter,
      title,
      description,
      difficulty,
      games,
      tracing,
      questions
    });
  }

  return levels;
};

export const QUIZ_LEVELS = generateTamilLevels();
