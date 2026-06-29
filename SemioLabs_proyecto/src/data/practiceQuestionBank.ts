import { studySyndromes } from './studySyndromes';
import type { HangmanQuestion, QuizQuestion } from '../types/gameplay';

const syndromeNames = studySyndromes.map((syndrome) => syndrome.name);

const pickDistractors = (correctName: string, offset: number) => {
  const others = syndromeNames.filter((name) => name !== correctName);
  return [others[offset % others.length], others[(offset + 7) % others.length], others[(offset + 14) % others.length]];
};

const buildOptions = (correctName: string, offset: number) => {
  const options = [...pickDistractors(correctName, offset), correctName];
  const answerIndex = offset % options.length;
  const [correctOption] = options.splice(3, 1);
  options.splice(answerIndex, 0, correctOption);
  return { options, answerIndex };
};

const diagnosticPrompts = [
  (name: string, trait: string, symptom: string) => `Caso clinico breve: predominan ${trait.toLowerCase()} y ${symptom.toLowerCase()}. ¿Que sindrome explica mejor el cuadro?`,
  (name: string, trait: string, symptom: string) => `Un paciente consulta con ${symptom.toLowerCase()} y se observa ${trait.toLowerCase()}. ¿Cual es la opcion mas probable?`,
  (name: string, trait: string, symptom: string) => `Durante la entrevista destaca ${trait.toLowerCase()}, acompanado de ${symptom.toLowerCase()}. ¿Que sindrome deberias sospechar?`,
  (name: string, trait: string, symptom: string) => `Si el signo guia es ${trait.toLowerCase()} y aparece ${symptom.toLowerCase()}, ¿que sindrome encaja mejor?`,
];

export const diagnosticoExpressQuestions: QuizQuestion[] = Array.from({ length: 30 }, (_, index) => {
  const syndrome = studySyndromes[index % studySyndromes.length];
  const trait = syndrome.traits[index % syndrome.traits.length];
  const symptom = syndrome.symptoms[(index + 1) % syndrome.symptoms.length];
  const { options, answerIndex } = buildOptions(syndrome.name, index);

  return {
    id: `de-auto-${index + 1}`,
    syndromeId: syndrome.id,
    prompt: diagnosticPrompts[index % diagnosticPrompts.length](syndrome.name, trait, symptom),
    options,
    answerIndex,
  };
});

const matchingSyndromes = studySyndromes.slice(0, 18);

export const verdaderoFalsoQuestions = Array.from({ length: 30 }, (_, index) => {
  const selected = [0, 1, 2].map((step) => matchingSyndromes[(index * 2 + step * 5) % matchingSyndromes.length]);
  const right = [selected[1], selected[2], selected[0]];

  return {
    id: `vf-auto-${index + 1}`,
    left: selected.map((syndrome, itemIndex) => {
      const trait = syndrome.traits[(index + itemIndex) % syndrome.traits.length];
      const symptom = syndrome.symptoms[(index + itemIndex + 1) % syndrome.symptoms.length];
      return `${trait}; ${symptom}`;
    }),
    right: right.map((syndrome) => syndrome.name),
    pairs: selected.map((syndrome) => right.findIndex((candidate) => candidate.id === syndrome.id)),
  };
});

const dragSyndromes = studySyndromes.slice(0, 18);

export const dragDropQuestions = Array.from({ length: 30 }, (_, index) => {
  const targets = [0, 1, 2].map((step) => dragSyndromes[(index * 3 + step * 4) % dragSyndromes.length]);
  const items = targets.flatMap((syndrome, targetIndex) => {
    const trait = syndrome.traits[(index + targetIndex) % syndrome.traits.length];
    const symptom = syndrome.symptoms[(index + targetIndex + 2) % syndrome.symptoms.length];
    return [
      { id: `item-${index + 1}-${targetIndex + 1}-a`, label: trait, syndrome: syndrome.id },
      { id: `item-${index + 1}-${targetIndex + 1}-b`, label: symptom, syndrome: syndrome.id },
    ];
  });

  return {
    id: `dd-auto-${index + 1}`,
    items,
    targets: targets.map((syndrome) => ({
      id: `target-${index + 1}-${syndrome.id}`,
      label: syndrome.name,
      syndrome: syndrome.id,
    })),
  };
});

export const hangmanQuestions: HangmanQuestion[] = studySyndromes.slice(0, 15).map((syndrome, index) => ({
  id: `hangman-${index + 1}`,
  syndromeId: syndrome.id,
  answer: syndrome.name.replace(/^Sindrome de\s+/i, '').replace(/^Sindrome\s+/i, ''),
  hint: syndrome.traits.slice(0, 2).join(' + '),
  detail: syndrome.definition,
}));
