import type { CrosswordClue, CrosswordPuzzle, QuizQuestion, StudySyndrome } from '../types/gameplay';

export const studySyndromes: StudySyndrome[] = [
  {
    id: 'depresivo',
    name: 'Síndrome Depresivo Mayor',
    definition: 'Alteración del estado de ánimo con tristeza persistente y pérdida de interés. Se caracteriza por un periodo de al menos dos semanas de ánimo depresivo o pérdida de interés en actividades, acompañado de síntomas adicionales como cambios en el apetito, alteraciones del sueño, fatiga, sentimientos de inutilidad o culpa excesiva, dificultades de concentración y pensamientos de muerte o suicidio.',
    traits: ['Ánimo bajo la mayor parte del día', 'Disminución de energía', 'Dificultad para disfrutar actividades', 'Sentimientos de inutilidad', 'Baja autoestima'],
    symptoms: ['Insomnio o hipersomnia', 'Culpa excesiva', 'Problemas de concentración', 'Cambios en el apetito', 'Aislamiento social', 'Pérdida de libido'],
    differences: ['Se diferencia del duelo normal por su duración e impacto funcional sostenido. A diferencia de una reacción de duelo que puede durar varios meses, el síndrome depresivo es más prolongado y más severo en su impacto en el funcionamiento diario.'],
  },
  {
    id: 'ansiedad',
    name: 'Síndrome de Ansiedad Generalizada',
    definition: 'Preocupación excesiva y difícil de controlar en múltiples áreas de la vida (salud, finanzas, familia, trabajo) que persiste durante al menos seis meses. Se acompaña de síntomas físicos como tensión muscular, inquietud, fatiga y problemas de sueño.',
    traits: ['Alerta constante', 'Tensión muscular', 'Irritabilidad', 'Inquietud persistente', 'Dificultad para relajarse'],
    symptoms: ['Fatiga', 'Inquietud', 'Problemas de sueño', 'Dificultad para concentrarse', 'Tensión somática', 'Irritabilidad'],
    differences: ['A diferencia de fobias específicas, la preocupación es amplia y no se limita a un estímulo particular. A diferencia del Síndrome de Pánico, no hay crisis de ansiedad aguda sino una preocupación persistente.'],
  },
  {
    id: 'panic',
    name: 'Síndrome de Pánico',
    definition: 'Caracterizado por crisis recurrentes e inesperadas de miedo intenso acompañadas de síntomas físicos marcados como taquicardia, disnea, mareos y una sensación de peligro inminente. Seguido del miedo a futuras crisis, lo que puede llevar a conductas de evitación.',
    traits: ['Miedo a nuevas crisis', 'Conductas evitativas', 'Sensación de pérdida de control', 'Agorafobia secundaria', 'Anticipación ansiosa'],
    symptoms: ['Taquicardia', 'Disnea', 'Mareo o desrealización', 'Sudoración', 'Sensación de ahogo', 'Dolor torácico', 'Temblores'],
    differences: ['A diferencia de ansiedad generalizada, se caracteriza por crisis agudas y súbitas. No es lo mismo que una crisis de ansiedad prolongada. La clave está en el carácter recurrente e inesperado de las crisis.'],
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    syndromeId: 'depresivo',
    prompt: '¿Qué característica es más típica del Síndrome Depresivo Mayor?',
    options: ['Euforia mantenida', 'Tristeza persistente y anhedonia', 'Alucinaciones visuales aisladas', 'Aumento extremo de energía'],
    answerIndex: 1,
  },
  {
    id: 'q2',
    syndromeId: 'ansiedad',
    prompt: 'En Síndrome de Ansiedad Generalizada, la preocupación suele ser:',
    options: ['Muy específica y breve', 'Generalizada y difícil de controlar', 'Solo nocturna', 'Solo social'],
    answerIndex: 1,
  },
  {
    id: 'q3',
    syndromeId: 'panic',
    prompt: 'Una crisis de pánico puede incluir principalmente:',
    options: ['Taquicardia y sensación de ahogo', 'Solo fiebre', 'Parálisis permanente', 'Pérdida total de memoria'],
    answerIndex: 0,
  },
  {
    id: 'q4',
    syndromeId: 'depresivo',
    prompt: '¿Cuál de los siguientes puede aparecer en Síndrome Depresivo Mayor?',
    options: ['Insomnio o hipersomnia', 'Mayor necesidad de riesgo', 'Ausencia total de fatiga', 'Aumento del apetito en todos los casos'],
    answerIndex: 0,
  },
  {
    id: 'q5',
    syndromeId: 'ansiedad',
    prompt: '¿Qué diferencia mejor una fobia específica del Síndrome de Ansiedad Generalizada?',
    options: ['La fobia no genera evitación', 'La ansiedad generalizada no afecta el sueño', 'La fobia se centra en estímulos concretos', 'Son exactamente iguales'],
    answerIndex: 2,
  },
  {
    id: 'q6',
    syndromeId: 'panic',
    prompt: 'En Síndrome de Pánico, después de una crisis suele aparecer:',
    options: ['Miedo a nuevas crisis', 'Euforia sostenida', 'Ausencia de síntomas físicos', 'Mejora inmediata del sueño'],
    answerIndex: 0,
  },
];

export const diagnosticoExpressQuestions: QuizQuestion[] = [
  {
    id: 'de1',
    syndromeId: 'depresivo',
    prompt: 'Paciente con tristeza persistente, pérdida de interés en actividades y fatiga durante 3 meses. ¿Cuál es el diagnóstico probable?',
    options: ['Síndrome Depresivo Mayor', 'Síndrome de Ansiedad Generalizada', 'Síndrome de Pánico', 'Síndrome Bipolar'],
    answerIndex: 0,
  },
  {
    id: 'de2',
    syndromeId: 'ansiedad',
    prompt: 'Preocupación excesiva sobre finanzas, salud y familia durante 6 meses con insomnio. ¿Diagnóstico?',
    options: ['Fobia específica', 'Síndrome de Ansiedad Generalizada', 'Síndrome de Pánico', 'Agorafobia'],
    answerIndex: 1,
  },
  {
    id: 'de3',
    syndromeId: 'panic',
    prompt: 'Crisis súbita de miedo intenso con taquicardia, sudoración y desrealización. ¿Qué es?',
    options: ['Crisis de ansiedad prolongada', 'Crisis de pánico', 'Ataque asmatiforme', 'Reacción alérgica'],
    answerIndex: 1,
  },
  {
    id: 'de4',
    syndromeId: 'depresivo',
    prompt: 'Pérdida de apetito, insomnio, culpa excesiva y dificultad de concentración. ¿Qué sugiere?',
    options: ['Síndrome de Ansiedad', 'Síndrome Depresivo Mayor', 'Síndrome del sueño primario', 'Estrés agudo'],
    answerIndex: 1,
  },
  {
    id: 'de5',
    syndromeId: 'ansiedad',
    prompt: 'Tensión muscular persistente, irritabilidad y fatiga sin causa clara. ¿Diagnóstico probable?',
    options: ['Síndrome Depresivo Mayor', 'Síndrome de Ansiedad Generalizada', 'Síndrome de Pánico', 'Estrés postraumático'],
    answerIndex: 1,
  },
];

export const verdaderoFalsoQuestions = [
  {
    id: 'vf1',
    left: [
      'Tristeza persistente, anhedonia, fatiga',
      'Preocupación excesiva, tensión muscular, insomnio',
      'Taquicardia, disnea, miedo a morir',
    ],
    right: ['Síndrome de Pánico', 'Síndrome Depresivo Mayor', 'Síndrome de Ansiedad Generalizada'],
    pairs: [0, 2, 1],
  },
  {
    id: 'vf2',
    left: [
      'Crisis súbita de miedo intenso',
      'Sentimientos de inutilidad y desesperanza',
      'Alerta constante y conductas evitativas',
    ],
    right: ['Síndrome de Ansiedad Generalizada', 'Síndrome de Pánico', 'Síndrome Depresivo Mayor'],
    pairs: [1, 2, 0],
  },
  {
    id: 'vf3',
    left: [
      'Insomnio o hipersomnia',
      'Miedo a nuevas crisis',
      'Preocupaciones específicas sobre situaciones',
    ],
    right: ['Síndrome de Pánico', 'Síndrome de Ansiedad Generalizada', 'Síndrome Depresivo Mayor'],
    pairs: [2, 0, 1],
  },
  {
    id: 'vf4',
    left: [
      'Irritabilidad, fatiga sin causa clara',
      'Culpa excesiva y pérdida de interés',
      'Sensación de pérdida de control',
    ],
    right: ['Síndrome de Pánico', 'Síndrome Depresivo Mayor', 'Síndrome de Ansiedad Generalizada'],
    pairs: [2, 1, 0],
  },
  {
    id: 'vf5',
    left: [
      'Aislamiento social y baja motivación',
      'Crisis con síntomas físicos marcados',
      'Tensión persistente y vigilancia constante',
    ],
    right: ['Síndrome de Ansiedad Generalizada', 'Síndrome de Pánico', 'Síndrome Depresivo Mayor'],
    pairs: [2, 1, 0],
  },
];

export const asociaSintomasQuestions: QuizQuestion[] = [
  {
    id: 'as1',
    syndromeId: 'depresivo',
    prompt: 'Anhedonia, aislamiento social, insomnio. ¿A qué síndrome pertenecen estos síntomas?',
    options: ['Síndrome de Ansiedad', 'Síndrome Depresivo Mayor', 'Síndrome de Pánico', 'Fobia social'],
    answerIndex: 1,
  },
  {
    id: 'as2',
    syndromeId: 'ansiedad',
    prompt: 'Inquietud, problemas de concentración, tensión muscular. ¿Cuál es el diagnóstico?',
    options: ['Depresión', 'Síndrome de Ansiedad Generalizada', 'Pánico', 'Síndrome del sueño'],
    answerIndex: 1,
  },
  {
    id: 'as3',
    syndromeId: 'panic',
    prompt: 'Taquicardia, disnea, mareos, miedo a morir. ¿Qué síndrome es?',
    options: ['Ansiedad social', 'Síndrome de Pánico', 'Agorafobia', 'Hipocondría'],
    answerIndex: 1,
  },
  {
    id: 'as4',
    syndromeId: 'depresivo',
    prompt: 'Culpa excesiva, sentimientos de inutilidad, desesperanza. ¿Diagnóstico?',
    options: ['Síndrome de Ansiedad', 'Síndrome Depresivo Mayor', 'Estrés agudo', 'Fatiga'],
    answerIndex: 1,
  },
  {
    id: 'as5',
    syndromeId: 'ansiedad',
    prompt: 'Alerta constante, conductas evitativas, miedo anticipatorio. ¿Cuál es?',
    options: ['Depresión', 'Síndrome de Ansiedad Generalizada', 'Síndrome del sueño', 'Fatiga crónica'],
    answerIndex: 1,
  },
];

export const dragDropQuestions = [
  {
    id: 'dd1',
    items: [
      { id: 'item1', label: 'Tristeza persistente', syndrome: 'depresivo' },
      { id: 'item2', label: 'Taquicardia y pánico', syndrome: 'panic' },
      { id: 'item3', label: 'Preocupación constante', syndrome: 'ansiedad' },
      { id: 'item4', label: 'Pérdida de interés', syndrome: 'depresivo' },
      { id: 'item5', label: 'Miedo a nuevas crisis', syndrome: 'panic' },
    ],
    targets: [
      { id: 'target1', label: 'Síndrome Depresivo Mayor', syndrome: 'depresivo' },
      { id: 'target2', label: 'Síndrome de Pánico', syndrome: 'panic' },
      { id: 'target3', label: 'Síndrome de Ansiedad Generalizada', syndrome: 'ansiedad' },
    ],
  },
  {
    id: 'dd2',
    items: [
      { id: 'item1', label: 'Insomnio o hipersomnia', syndrome: 'depresivo' },
      { id: 'item2', label: 'Disnea y mareos', syndrome: 'panic' },
      { id: 'item3', label: 'Tensión muscular', syndrome: 'ansiedad' },
      { id: 'item4', label: 'Culpa excesiva', syndrome: 'depresivo' },
      { id: 'item5', label: 'Conductas evitativas', syndrome: 'ansiedad' },
    ],
    targets: [
      { id: 'target1', label: 'Síndrome Depresivo Mayor', syndrome: 'depresivo' },
      { id: 'target2', label: 'Síndrome de Pánico', syndrome: 'panic' },
      { id: 'target3', label: 'Síndrome de Ansiedad Generalizada', syndrome: 'ansiedad' },
    ],
  },
  {
    id: 'dd3',
    items: [
      { id: 'item1', label: 'Aislamiento social', syndrome: 'depresivo' },
      { id: 'item2', label: 'Crisis de miedo intenso', syndrome: 'panic' },
      { id: 'item3', label: 'Alerta constante', syndrome: 'ansiedad' },
      { id: 'item4', label: 'Fatiga y apatía', syndrome: 'depresivo' },
      { id: 'item5', label: 'Sensación de pérdida de control', syndrome: 'panic' },
    ],
    targets: [
      { id: 'target1', label: 'Síndrome Depresivo Mayor', syndrome: 'depresivo' },
      { id: 'target2', label: 'Síndrome de Pánico', syndrome: 'panic' },
      { id: 'target3', label: 'Síndrome de Ansiedad Generalizada', syndrome: 'ansiedad' },
    ],
  },
  {
    id: 'dd4',
    items: [
      { id: 'item1', label: 'Desesperanza', syndrome: 'depresivo' },
      { id: 'item2', label: 'Taquicardia', syndrome: 'panic' },
      { id: 'item3', label: 'Inquietud', syndrome: 'ansiedad' },
      { id: 'item4', label: 'Anhedonia', syndrome: 'depresivo' },
      { id: 'item5', label: 'Miedo a morir', syndrome: 'panic' },
    ],
    targets: [
      { id: 'target1', label: 'Síndrome Depresivo Mayor', syndrome: 'depresivo' },
      { id: 'target2', label: 'Síndrome de Pánico', syndrome: 'panic' },
      { id: 'target3', label: 'Síndrome de Ansiedad Generalizada', syndrome: 'ansiedad' },
    ],
  },
  {
    id: 'dd5',
    items: [
      { id: 'item1', label: 'Irritabilidad', syndrome: 'depresivo' },
      { id: 'item2', label: 'Desrealización', syndrome: 'panic' },
      { id: 'item3', label: 'Problemas de concentración', syndrome: 'ansiedad' },
      { id: 'item4', label: 'Baja autoestima', syndrome: 'depresivo' },
      { id: 'item5', label: 'Sensación de ahogo', syndrome: 'panic' },
    ],
    targets: [
      { id: 'target1', label: 'Síndrome Depresivo Mayor', syndrome: 'depresivo' },
      { id: 'target2', label: 'Síndrome de Pánico', syndrome: 'panic' },
      { id: 'target3', label: 'Síndrome de Ansiedad Generalizada', syndrome: 'ansiedad' },
    ],
  },
];

const buildCrosswordCells = (
  rows: string[],
  numbers: Record<string, number>,
): Array<Array<{ blocked: boolean; solution?: string; number?: number }>> =>
  rows.map((row, rowIndex) =>
    [...row].map((char, colIndex) => {
      if (char === '.') {
        return { blocked: true };
      }

      return {
        blocked: false,
        solution: char,
        ...(numbers[`${rowIndex}-${colIndex}`] ? { number: numbers[`${rowIndex}-${colIndex}`] } : {}),
      };
    }),
  );

const crosswordRows = [
  '............',
  '.....D......',
  '.....E......',
  '.....PANICO.',
  '.....R......',
  '.ANSIEDAD...',
  '.....S......',
  '....BIPOLAR.',
  '.....O......',
  '....INSOMNIO',
  '........A...',
  '........N...',
  '........I...',
  '........A...',
];

const crosswordNumbers = {
  '1-5': 1,
  '3-5': 2,
  '5-1': 3,
  '7-4': 4,
  '9-4': 5,
  '9-8': 6,
};

export const crosswordPuzzle: CrosswordPuzzle = {
  id: 'crucigrama-1',
  rows: crosswordRows.length,
  cols: crosswordRows[0].length,
  cells: buildCrosswordCells(crosswordRows, crosswordNumbers),
  clues: [
    {
      id: 'c1',
      number: 1,
      direction: 'down',
      row: 1,
      col: 5,
      length: 9,
      clue: 'Trastorno del estado de animo con tristeza persistente, anhedonia y baja energia.',
      answer: 'DEPRESION',
    },
    {
      id: 'c2',
      number: 2,
      direction: 'across',
      row: 3,
      col: 5,
      length: 6,
      clue: 'Crisis subita de miedo intenso con taquicardia y sensacion de ahogo.',
      answer: 'PANICO',
    },
    {
      id: 'c3',
      number: 3,
      direction: 'across',
      row: 5,
      col: 1,
      length: 8,
      clue: 'Preocupacion excesiva y dificil de controlar durante varios meses.',
      answer: 'ANSIEDAD',
    },
    {
      id: 'c4',
      number: 4,
      direction: 'across',
      row: 7,
      col: 4,
      length: 7,
      clue: 'Alternancia de episodios depresivos con periodos de animo elevado o mania.',
      answer: 'BIPOLAR',
    },
    {
      id: 'c5',
      number: 5,
      direction: 'across',
      row: 9,
      col: 4,
      length: 8,
      clue: 'Dificultad para iniciar o mantener el sueno.',
      answer: 'INSOMNIO',
    },
    {
      id: 'c6',
      number: 6,
      direction: 'down',
      row: 9,
      col: 8,
      length: 5,
      clue: 'Estado de animo anormalmente elevado, expansivo o irritable.',
      answer: 'MANIA',
    },
  ],
};


type CrosswordPlacement = Omit<CrosswordClue, 'id' | 'length'>;

const createCrosswordPuzzle = (id: string, placements: CrosswordPlacement[]): CrosswordPuzzle => {
  const rows = Math.max(...placements.map((p) => (p.direction === 'across' ? p.row : p.row + p.answer.length - 1))) + 1;
  const cols = Math.max(...placements.map((p) => (p.direction === 'across' ? p.col + p.answer.length - 1 : p.col))) + 1;
  const grid: Array<Array<string | null>> = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));
  const starts = new Map<string, number>();

  placements.forEach((placement) => {
    let row = placement.row;
    let col = placement.col;
    starts.set(`${row}-${col}`, placement.number);

    [...placement.answer.toUpperCase()].forEach((letter) => {
      const existing = grid[row][col];
      if (existing && existing !== letter) {
        throw new Error(`Invalid crossword overlap in ${id} at ${row}-${col}`);
      }
      grid[row][col] = letter;
      if (placement.direction === 'across') col += 1;
      else row += 1;
    });
  });

  return {
    id,
    rows,
    cols,
    cells: grid.map((row, rowIndex) =>
      row.map((letter, colIndex) =>
        letter
          ? {
              blocked: false,
              solution: letter,
              ...(starts.has(`${rowIndex}-${colIndex}`) ? { number: starts.get(`${rowIndex}-${colIndex}`) } : {}),
            }
          : { blocked: true },
      ),
    ),
    clues: placements.map((placement, index) => ({
      ...placement,
      id: `${id}-c${index + 1}`,
      answer: placement.answer.toUpperCase(),
      length: placement.answer.length,
    })),
  };
};

export const crosswordPuzzles: CrosswordPuzzle[] = [
  crosswordPuzzle,
  createCrosswordPuzzle('crucigrama-2', [
    { number: 1, direction: 'down', row: 1, col: 5, clue: 'Preocupacion persistente y dificil de controlar.', answer: 'ANSIEDAD' },
    { number: 2, direction: 'across', row: 1, col: 5, clue: 'Falta de motivacion o energia para iniciar actividades.', answer: 'APATIA' },
    { number: 3, direction: 'across', row: 2, col: 3, clue: 'Crisis brusca con miedo intenso y sintomas fisicos.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 3, col: 3, clue: 'Dificultad para dormir o mantener el sueno.', answer: 'INSOMNIO' },
    { number: 5, direction: 'across', row: 5, col: 4, clue: 'Trastorno con tristeza persistente y anhedonia.', answer: 'DEPRESION' },
    { number: 6, direction: 'across', row: 7, col: 4, clue: 'Animo elevado, expansivo o irritable.', answer: 'MANIA' },
  ]),
  createCrosswordPuzzle('crucigrama-3', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Alterna episodios depresivos con mania o hipomania.', answer: 'BIPOLAR' },
    { number: 2, direction: 'across', row: 2, col: 6, clue: 'Problema para conciliar o sostener el sueno.', answer: 'INSOMNIO' },
    { number: 3, direction: 'across', row: 3, col: 6, clue: 'Ataque repentino de miedo intenso.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 4, col: 5, clue: 'Miedo intenso ante un objeto o situacion especifica.', answer: 'FOBIA' },
    { number: 5, direction: 'across', row: 5, col: 4, clue: 'Sentimiento frecuente de responsabilidad excesiva.', answer: 'CULPA' },
    { number: 6, direction: 'across', row: 6, col: 5, clue: 'Estado de animo elevado o euforico.', answer: 'MANIA' },
  ]),
  createCrosswordPuzzle('crucigrama-4', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Crisis de miedo intenso con palpitaciones y ahogo.', answer: 'PANICO' },
    { number: 2, direction: 'across', row: 2, col: 6, clue: 'Desinteres y reduccion de la iniciativa.', answer: 'APATIA' },
    { number: 3, direction: 'across', row: 3, col: 5, clue: 'Preocupacion excesiva y sostenida.', answer: 'ANSIEDAD' },
    { number: 4, direction: 'across', row: 4, col: 6, clue: 'Dificultad para dormir.', answer: 'INSOMNIO' },
    { number: 5, direction: 'across', row: 5, col: 6, clue: 'Sentimiento de responsabilidad o remordimiento.', answer: 'CULPA' },
    { number: 6, direction: 'across', row: 6, col: 5, clue: 'Miedo irracional y desproporcionado.', answer: 'FOBIA' },
  ]),
  createCrosswordPuzzle('crucigrama-5', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Alteracion del sueno frecuente en ansiedad y depresion.', answer: 'INSOMNIO' },
    { number: 2, direction: 'across', row: 1, col: 6, clue: 'Irritabilidad intensa o enojo.', answer: 'IRA' },
    { number: 3, direction: 'across', row: 2, col: 4, clue: 'Crisis subita de miedo intenso.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 3, col: 4, clue: 'Preocupacion excesiva.', answer: 'ANSIEDAD' },
    { number: 5, direction: 'across', row: 4, col: 5, clue: 'Miedo especifico e intenso.', answer: 'FOBIA' },
    { number: 6, direction: 'across', row: 6, col: 5, clue: 'Incapacidad de disfrutar actividades.', answer: 'ANHEDONIA' },
  ]),
  createCrosswordPuzzle('crucigrama-6', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Animo anormalmente elevado o expansivo.', answer: 'MANIA' },
    { number: 2, direction: 'across', row: 1, col: 6, clue: 'Tristeza profunda y persistente.', answer: 'MELANCOLIA' },
    { number: 3, direction: 'across', row: 2, col: 5, clue: 'Ataque con miedo intenso.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 3, col: 5, clue: 'Preocupacion dificil de controlar.', answer: 'ANSIEDAD' },
    { number: 5, direction: 'across', row: 4, col: 6, clue: 'Problema de sueno.', answer: 'INSOMNIO' },
    { number: 6, direction: 'across', row: 5, col: 6, clue: 'Falta de interes o energia.', answer: 'APATIA' },
  ]),
  createCrosswordPuzzle('crucigrama-7', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Miedo persistente ante algo concreto.', answer: 'FOBIA' },
    { number: 2, direction: 'across', row: 1, col: 6, clue: 'Cansancio frecuente y baja energia.', answer: 'FATIGA' },
    { number: 3, direction: 'across', row: 2, col: 5, clue: 'Aislamiento o sensacion de desconexion social.', answer: 'SOLEDAD' },
    { number: 4, direction: 'across', row: 3, col: 6, clue: 'Trastorno con fases depresivas y elevadas.', answer: 'BIPOLAR' },
    { number: 5, direction: 'across', row: 4, col: 6, clue: 'Dificultad para dormir.', answer: 'INSOMNIO' },
    { number: 6, direction: 'across', row: 5, col: 6, clue: 'Preocupacion anticipatoria.', answer: 'ANSIEDAD' },
  ]),
  createCrosswordPuzzle('crucigrama-8', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Falta de motivacion y respuesta emocional baja.', answer: 'APATIA' },
    { number: 2, direction: 'across', row: 1, col: 6, clue: 'Preocupacion persistente.', answer: 'ANSIEDAD' },
    { number: 3, direction: 'across', row: 2, col: 6, clue: 'Crisis de miedo intenso.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 3, col: 5, clue: 'Animo elevado o irritable.', answer: 'MANIA' },
    { number: 5, direction: 'across', row: 4, col: 6, clue: 'Tension corporal frecuente en ansiedad.', answer: 'TENSION' },
    { number: 6, direction: 'across', row: 6, col: 2, clue: 'Miedo intenso ante un estimulo especifico.', answer: 'FOBIA' },
  ]),
  createCrosswordPuzzle('crucigrama-9', [
    { number: 1, direction: 'down', row: 1, col: 6, clue: 'Sentimiento de responsabilidad excesiva o remordimiento.', answer: 'CULPA' },
    { number: 2, direction: 'across', row: 1, col: 6, clue: 'Respuesta observable que mantiene o evita sintomas.', answer: 'CONDUCTA' },
    { number: 3, direction: 'across', row: 2, col: 5, clue: 'Alteracion alimentaria con atracones y purgas.', answer: 'BULIMIA' },
    { number: 4, direction: 'across', row: 3, col: 3, clue: 'Retiro social marcado.', answer: 'AISLAMIENTO' },
    { number: 5, direction: 'across', row: 4, col: 6, clue: 'Crisis subita de miedo.', answer: 'PANICO' },
    { number: 6, direction: 'across', row: 5, col: 6, clue: 'Preocupacion excesiva.', answer: 'ANSIEDAD' },
  ]),
  createCrosswordPuzzle('crucigrama-10', [
    { number: 1, direction: 'down', row: 1, col: 7, clue: 'Perdida de interes o placer en actividades.', answer: 'ANHEDONIA' },
    { number: 2, direction: 'across', row: 1, col: 7, clue: 'Preocupacion excesiva y sostenida.', answer: 'ANSIEDAD' },
    { number: 3, direction: 'across', row: 2, col: 5, clue: 'Crisis intensa de miedo.', answer: 'PANICO' },
    { number: 4, direction: 'across', row: 3, col: 7, clue: 'Estado de energia elevada menor que mania.', answer: 'HIPOMANIA' },
    { number: 5, direction: 'across', row: 4, col: 6, clue: 'Trastorno con tristeza persistente.', answer: 'DEPRESION' },
    { number: 6, direction: 'across', row: 6, col: 6, clue: 'Miedo especifico.', answer: 'FOBIA' },
  ]),
];
export const botNames = ['Ana', 'Diego', 'María', 'José', 'Lucía', 'Carla', 'Sofía', 'Samuel'];

export const minigames = [
  {
    id: 'diagnostico-express',
    name: 'Diagnóstico Express',
    description: 'Identifica el síndrome correcto basado en una descripción clínica.',
    icon: '🩺',
    active: true,
  },
  {
    id: 'verdadero-falso',
    name: 'Unir con Líneas',
    description: 'Conecta cada grupo de síntomas con el síndrome correspondiente.',
    icon: '🔀',
    active: true,
  },
  {
    id: 'asocia-sintomas',
    name: 'Asocia Síntomas',
    description: 'Relaciona síntomas con el síndrome correspondiente.',
    icon: '🧠',
    active: true,
  },
  {
    id: 'crucigrama',
    name: 'Crucigrama',
    description: 'Resuelve el crucigrama con descripciones de síndromes clínicos.',
    icon: '🧩',
    active: true,
  },
  {
    id: 'ahorcado',
    name: 'Ahorcado Clínico',
    description: 'Adivina el síndrome antes de que se complete el muñeco.',
    icon: '🧍',
    active: true,
  },
];
