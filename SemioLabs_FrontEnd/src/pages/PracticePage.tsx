import { useEffect, useMemo, useRef, useState } from 'react';
import ActionButton from '../components/ActionButton';
import { useNavigate } from 'react-router-dom';
import { 
  crosswordPuzzles,
  minigames,
} from '../data/gameData';
import { diagnosticoExpressQuestions, dragDropQuestions, hangmanQuestions, verdaderoFalsoQuestions } from '../data/practiceQuestionBank';
import type { MatchHistoryItem, CrosswordClue, HangmanQuestion } from '../types/gameplay';
import { useLocalProgress } from '../hooks/useLocalProgress';
import { calculateAnswerPoints, getStreakBonus } from '../services/scoringService';

type GameMode = 'diagnostico-express' | 'verdadero-falso' | 'asocia-sintomas' | 'crucigrama' | 'ahorcado' | 'carrusel';

interface VFQuestion {
  id: string;
  left: string[];
  right: string[];
  pairs: number[];
}

interface DragDropItem {
  id: string;
  label: string;
  syndrome: string;
}

interface DragDropTarget {
  id: string;
  label: string;
  syndrome: string;
}

interface DragDropQuestion {
  id: string;
  items: DragDropItem[];
  targets: DragDropTarget[];
}

const shuffleItems = <T,>(items: T[]) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const HANGMAN_MAX_ERRORS = 6;
const HANGMAN_SECONDS = 80;
const HANGMAN_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MATCH_COLORS = ['match-color-0', 'match-color-1', 'match-color-2'];

const normalizeGuessValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .toUpperCase();

const getGuessLetter = (value: string) => {
  const normalized = normalizeGuessValue(value);
  const match = normalized.match(/[A-ZÑ]/);
  return match ? match[0] : '';
};

function PracticePage() {
  const navigate = useNavigate();
  const { progress, stats, saveMatch } = useLocalProgress();
  const [started, setStarted] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [selectedMode, setSelectedMode] = useState<GameMode>('diagnostico-express');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [ended, setEnded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [vfMatches, setVFMatches] = useState<{ [leftIdx: number]: number }>({});
  const [dragMatches, setDragMatches] = useState<{ [key: string]: string }>({});
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedLeftIndex, setSelectedLeftIndex] = useState<number | null>(null);
  const [crosswordAnswers, setCrosswordAnswers] = useState<Record<string, string>>({});
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const [focusedCellKey, setFocusedCellKey] = useState<string | null>(null);
  const [selectedCrosswordIndex, setSelectedCrosswordIndex] = useState(0);
  const [selectedHangmanIndex, setSelectedHangmanIndex] = useState(0);
  const [hangmanGuesses, setHangmanGuesses] = useState<string[]>([]);
  const [hangmanInput, setHangmanInput] = useState('');
  const [hangmanTimeLeft, setHangmanTimeLeft] = useState(HANGMAN_SECONDS);
  const [gameRound, setGameRound] = useState(0);
  const questionStartRef = useRef<number>(0);
  const crosswordPuzzle = crosswordPuzzles[selectedCrosswordIndex] || crosswordPuzzles[0];
  const selectedHangmanQuestion = hangmanQuestions[selectedHangmanIndex] || hangmanQuestions[0];

  const questions = useMemo(() => {
    if (selectedMode === 'diagnostico-express') {
      return shuffleItems(diagnosticoExpressQuestions).slice(0, 5);
    } else if (selectedMode === 'carrusel') {
      const carouselQuestions: any[] = [];
      // 5 diagnóstico express
      shuffleItems(diagnosticoExpressQuestions).slice(0, 5).forEach(q => {
        carouselQuestions.push({ ...q, type: 'diagnostico' });
      });
      // 5 verdadero-falso
      shuffleItems(verdaderoFalsoQuestions).slice(0, 5).forEach(q => {
        carouselQuestions.push({ ...q, type: 'vf' });
      });
      // 5 drag-drop
      shuffleItems(dragDropQuestions).slice(0, 5).forEach(q => {
        carouselQuestions.push({ ...q, type: 'dragdrop' });
      });
      carouselQuestions.push({ id: 'carousel-crossword', type: 'crossword' });
      carouselQuestions.push({ ...shuffleItems(hangmanQuestions)[0], type: 'hangman' });
      return shuffleItems(carouselQuestions);
    } else if (selectedMode === 'crucigrama') {
      return crosswordPuzzle.clues;
    } else if (selectedMode === 'ahorcado') {
      return [selectedHangmanQuestion];
    }
    return shuffleItems(diagnosticoExpressQuestions).slice(0, 5);
  }, [selectedMode, crosswordPuzzle, selectedHangmanQuestion, gameRound]);

  const vfQuestions = useMemo(() => shuffleItems(verdaderoFalsoQuestions).slice(0, 5), [gameRound]);
  const ddQuestions = useMemo(() => shuffleItems(dragDropQuestions).slice(0, 5), [gameRound]);

  const currentQuestion = selectedMode === 'carrusel' 
    ? questions[questionIndex]
    : selectedMode === 'verdadero-falso'
    ? vfQuestions[questionIndex]
    : selectedMode === 'asocia-sintomas'
    ? ddQuestions[questionIndex]
    : questions[questionIndex];

  const isDiagnostico = selectedMode === 'diagnostico-express' || 
    (selectedMode === 'carrusel' && (currentQuestion as any).type === 'diagnostico');
  const isVerdaderoFalso = selectedMode === 'verdadero-falso' || 
    (selectedMode === 'carrusel' && (currentQuestion as any).type === 'vf');
  const isDragDrop = selectedMode === 'asocia-sintomas' || 
    (selectedMode === 'carrusel' && (currentQuestion as any).type === 'dragdrop');
  const isCrossword = selectedMode === 'crucigrama' ||
    (selectedMode === 'carrusel' && (currentQuestion as any).type === 'crossword');
  const isHangman = selectedMode === 'ahorcado' ||
    (selectedMode === 'carrusel' && (currentQuestion as any).type === 'hangman');
  const currentHangmanQuestion = isHangman ? currentQuestion as HangmanQuestion & { type?: string } : null;
  const normalizedHangmanAnswer = currentHangmanQuestion ? normalizeGuessValue(currentHangmanQuestion.answer) : '';
  const hangmanWrongGuesses = hangmanGuesses.filter((letter) => !normalizedHangmanAnswer.includes(letter));
  const hangmanCorrectGuesses = hangmanGuesses.filter((letter) => normalizedHangmanAnswer.includes(letter));
  const hangmanIsComplete = !!currentHangmanQuestion && [...normalizedHangmanAnswer].every((letter) => {
    if (!/[A-ZÑ]/.test(letter)) return true;
    return hangmanGuesses.includes(letter);
  });

  const averageTime = times.length > 0 ? Number((times.reduce((acc, n) => acc + n, 0) / times.length).toFixed(2)) : 0;
  const accuracy = correct + incorrect > 0 ? Number(((correct / (correct + incorrect)) * 100).toFixed(1)) : 0;

  const handleShowModeSelector = () => {
    setShowModeSelector(true);
  };

  const handleCloseModeSelector = () => {
    setShowModeSelector(false);
    if (!started && !ended) {
      navigate('/');
    }
  };

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
    startGame(mode);
  };

  const startGame = (mode: GameMode = selectedMode) => {
    setStarted(true);
    setEnded(false);
    setSaved(false);
    setQuestionIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setCorrect(0);
    setIncorrect(0);
    setStreak(0);
    setBestStreak(0);
    setTimes([]);
    setMatchedPairs([]);
    setVFMatches({});
    setDragMatches({});
    setCrosswordAnswers({});
    setSelectedClueId(null);
    setFocusedCellKey(null);
    setHangmanGuesses([]);
    setHangmanInput('');
    setHangmanTimeLeft(HANGMAN_SECONDS);
    setGameRound((prev) => prev + 1);
    if (mode === 'crucigrama' || mode === 'carrusel') {
      setSelectedCrosswordIndex(Math.floor(Math.random() * crosswordPuzzles.length));
    }
    if (mode === 'ahorcado') {
      setSelectedHangmanIndex(Math.floor(Math.random() * hangmanQuestions.length));
    }
    setSelectedLeftIndex(null);
    questionStartRef.current = Date.now();
  };

  const getGameName = () => {
    const game = minigames.find((g) => g.id === selectedMode);
    return game?.name || 'Carrusel';
  };

  const getTotalQuestions = () => {
    if (selectedMode === 'carrusel') return questions.length;
    if (selectedMode === 'verdadero-falso') return vfQuestions.length;
    if (selectedMode === 'asocia-sintomas') return ddQuestions.length;
    if (selectedMode === 'crucigrama') return 1;
    if (selectedMode === 'ahorcado') return 1;
    return questions.length;
  };

  const checkVFAnswer = () => {
    const vfQ = currentQuestion as VFQuestion;
    let correct = 0;
    vfQ.left.forEach((_, idx) => {
      if (vfMatches[idx] === vfQ.pairs[idx]) {
        correct++;
      }
    });
    return correct === vfQ.left.length;
  };

  const getVFCounts = () => {
    const vfQ = currentQuestion as VFQuestion;
    let correctCount = 0;
    let incorrectCount = 0;

    vfQ.left.forEach((_, idx) => {
      if (vfMatches[idx] === vfQ.pairs[idx]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    return { correctCount, incorrectCount };
  };

  const checkDragDropMatch = () => {
    const ddQ = currentQuestion as DragDropQuestion;
    let correctCount = 0;
    ddQ.items.forEach((item) => {
      const selectedTargetId = dragMatches[item.id];
      if (selectedTargetId) {
        const selectedTarget = ddQ.targets.find((t) => t.id === selectedTargetId);
        if (selectedTarget && selectedTarget.syndrome === item.syndrome) {
          correctCount++;
        }
      }
    });
    return correctCount === ddQ.items.length;
  };

  const normalizeCrosswordValue = (value: string) =>
    value.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/gi, '');

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const checkCrosswordAnswers = () => {
    return crosswordPuzzle.cells.every((rowCells, rowIndex) =>
      rowCells.every((cell, colIndex) => {
        if (cell.blocked || !cell.solution) return true;
        const answer = normalizeCrosswordValue(crosswordAnswers[getCellKey(rowIndex, colIndex)] || '');
        return answer === cell.solution;
      }),
    );
  };

  const getCrosswordCounts = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    crosswordPuzzle.cells.forEach((rowCells, rowIndex) => {
      rowCells.forEach((cell, colIndex) => {
        if (cell.blocked || !cell.solution) return;
        const answer = normalizeCrosswordValue(crosswordAnswers[getCellKey(rowIndex, colIndex)] || '');
        if (answer === cell.solution) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });
    });

    return { correctCount, incorrectCount };
  };

  const getCrosswordCellStatus = (row: number, col: number, solution?: string) => {
    if (!locked || !solution) return '';
    const answer = normalizeCrosswordValue(crosswordAnswers[getCellKey(row, col)] || '');
    return answer === solution ? 'correct' : 'wrong';
  };

  const handleCrosswordChange = (row: number, col: number, value: string) => {
    if (locked) return;
    const letterMatch = value.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/);
    const char = letterMatch ? letterMatch[0].toUpperCase() : '';
    setCrosswordAnswers((prev) => ({
      ...prev,
      [getCellKey(row, col)]: char,
    }));
  };

  const selectedCells = useMemo(() => {
    if (!selectedClueId) return new Set<string>();
    const clue = crosswordPuzzle.clues.find((c) => c.id === selectedClueId);
    const keys = new Set<string>();
    if (!clue) return keys;
    let r = clue.row;
    let c = clue.col;
    for (let i = 0; i < clue.length; i++) {
      keys.add(getCellKey(r, c));
      if (clue.direction === 'across') c += 1;
      else r += 1;
    }
    return keys;
  }, [selectedClueId]);

  const handleClueClick = (clue: CrosswordClue) => {
    setSelectedClueId(clue.id);
    // focus the first cell of the clue
    setTimeout(() => {
      const el = document.getElementById(`cell-${clue.row}-${clue.col}-input`) as HTMLInputElement | null;
      el?.focus();
    }, 0);
  };

  const shuffleArray = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Only include the crossword puzzle answers in the answer bank (shuffled)
  // Filter to answers that match at least one clue length so all shown answers can fit somewhere
  const answerBank = useMemo(() => {
    const clueLengths = new Set<number>(crosswordPuzzle.clues.map((c) => c.length));
    const fromClues = crosswordPuzzle.clues.map((c) => (c.answer || '').toUpperCase().replace(/\s+/g, ''));
    const unique = Array.from(new Set(fromClues));
    const filtered = unique.filter((ans) => clueLengths.has(ans.length));
    return shuffleArray(filtered);
  }, [crosswordPuzzle]);

  const fillClueWithAnswer = (clueId: string, answer: string) => {
    const clue = crosswordPuzzle.clues.find((c) => c.id === clueId);
    if (!clue) return;
    if (answer.length !== clue.length) return;
    const updates: Record<string, string> = {};
    let r = clue.row;
    let c = clue.col;
    for (let i = 0; i < clue.length; i++) {
      updates[getCellKey(r, c)] = answer[i];
      if (clue.direction === 'across') c += 1;
      else r += 1;
    }
    setCrosswordAnswers((prev) => ({ ...prev, ...updates }));
  };

  const handleLetterInsert = (letter: string) => {
    if (!focusedCellKey) {
      // focus first available cell
      const firstCell = crosswordPuzzle.cells.findIndex((row) => row.some((c: any) => !c.blocked));
      if (firstCell === -1) return;
      const col = crosswordPuzzle.cells[firstCell].findIndex((c: any) => !c.blocked);
      setTimeout(() => {
        const el = document.getElementById(`cell-${firstCell}-${col}-input`) as HTMLInputElement | null;
        el?.focus();
        handleCrosswordChange(firstCell, col, letter);
      }, 0);
      return;
    }

    const [rStr, cStr] = focusedCellKey.split('-');
    const r = Number(rStr);
    const c = Number(cStr);
    handleCrosswordChange(r, c, letter);
    // keep focus on the same cell (user can click next)
    setTimeout(() => {
      const el = document.getElementById(`cell-${r}-${c}-input`) as HTMLInputElement | null;
      el?.focus();
    }, 0);
  };

  const onCrosswordVerify = () => {
    if (locked) return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const seconds = Number(elapsed.toFixed(2));
    const isCorrect = checkCrosswordAnswers();
    const { correctCount, incorrectCount } = getCrosswordCounts();
    const nextStreak = isCorrect ? streak + 1 : 0;
    const basePoints = calculateAnswerPoints(seconds, isCorrect);
    const bonus = getStreakBonus(nextStreak);
    const total = isCorrect ? basePoints + bonus : correctCount;

    setLocked(true);
    setTimes((prev) => [...prev, seconds]);
    setStreak(nextStreak);
    setBestStreak((prev) => Math.max(prev, nextStreak));
    setScore((prev) => prev + total);
    setCorrect((prev) => prev + correctCount);
    setIncorrect((prev) => prev + incorrectCount);
  };

  const getDragDropCounts = () => {
    const ddQ = currentQuestion as DragDropQuestion;
    let correctCount = 0;
    let incorrectCount = 0;
    
    ddQ.items.forEach((item) => {
      const selectedTargetId = dragMatches[item.id];
      const selectedTarget = ddQ.targets.find((t) => t.id === selectedTargetId);
      if (selectedTarget && selectedTarget.syndrome === item.syndrome) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });
    
    return { correctCount, incorrectCount };
  };

  const goNext = () => {
    const totalQuestions = getTotalQuestions();
    if (questionIndex === totalQuestions - 1) {
      setEnded(true);
      setStarted(false);
      if (!saved) {
        saveMatch({
          id: crypto.randomUUID(),
          mode: selectedMode as MatchHistoryItem['mode'],
          date: new Date().toISOString(),
          score,
          correct,
          incorrect,
          averageTime,
          accuracy,
          won: accuracy >= 70,
          perfectStreak: bestStreak >= 5,
        });
        setSaved(true);
      }
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelected(null);
    setLocked(false);
    setVFMatches({});
    setDragMatches({});
    setCrosswordAnswers({});
    setSelectedClueId(null);
    setFocusedCellKey(null);
    setHangmanGuesses([]);
    setHangmanInput('');
    setHangmanTimeLeft(HANGMAN_SECONDS);
    setSelectedLeftIndex(null);
    questionStartRef.current = Date.now();
  };

  const onAnswer = (index: number) => {
    if (locked) return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const seconds = Number(elapsed.toFixed(2));
    
    let isCorrect = false;
    if (isDiagnostico) {
      const q = currentQuestion as any;
      isCorrect = index === q.answerIndex;
    } else if (isVerdaderoFalso) {
      // For matching game, don't mark as correct here - wait for verify button
      return;
    }
    
    const nextStreak = isCorrect ? streak + 1 : 0;
    const basePoints = calculateAnswerPoints(seconds, isCorrect);
    const bonus = getStreakBonus(nextStreak);
    const total = basePoints + bonus;

    setSelected(index);
    setLocked(true);
    setTimes((prev) => [...prev, seconds]);
    setStreak(nextStreak);
    setBestStreak((prev) => Math.max(prev, nextStreak));
    setScore((prev) => prev + total);

    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    } else {
      setIncorrect((prev) => prev + 1);
    }
  };

  const onDragDrop = () => {
    if (locked) return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const seconds = Number(elapsed.toFixed(2));
    
    const { correctCount, incorrectCount } = getDragDropCounts();
    const isCorrect = checkDragDropMatch();
    const nextStreak = isCorrect ? streak + 1 : 0;
    const basePoints = calculateAnswerPoints(seconds, isCorrect);
    const bonus = getStreakBonus(nextStreak);
    const total = isCorrect ? basePoints + bonus : correctCount;

    setLocked(true);
    setTimes((prev) => [...prev, seconds]);
    setStreak(nextStreak);
    setBestStreak((prev) => Math.max(prev, nextStreak));
    setScore((prev) => prev + total);

    // Count individual items as correct/incorrect
    setCorrect((prev) => prev + correctCount);
    setIncorrect((prev) => prev + incorrectCount);
  };

  const onVerdaderoFalso = () => {
    if (locked) return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const seconds = Number(elapsed.toFixed(2));
    
    const isCorrect = checkVFAnswer();
    const { correctCount, incorrectCount } = getVFCounts();
    const nextStreak = isCorrect ? streak + 1 : 0;
    const basePoints = calculateAnswerPoints(seconds, isCorrect);
    const bonus = getStreakBonus(nextStreak);
    const total = isCorrect ? basePoints + bonus : correctCount;

    setLocked(true);
    setTimes((prev) => [...prev, seconds]);
    setStreak(nextStreak);
    setBestStreak((prev) => Math.max(prev, nextStreak));
    setScore((prev) => prev + total);

    setCorrect((prev) => prev + correctCount);
    setIncorrect((prev) => prev + incorrectCount);
  };

  const getHangmanLetterHits = (letter: string) =>
    [...normalizedHangmanAnswer].filter((answerLetter) => answerLetter === letter).length;

  const scoreHangmanGuess = (letter: string) => {
    const hitCount = getHangmanLetterHits(letter);

    if (hitCount > 0) {
      setCorrect((prev) => prev + hitCount);
      setScore((prev) => prev + hitCount);
      return;
    }

    setIncorrect((prev) => prev + 1);
  };

  const finishHangman = (won: boolean, guesses = hangmanGuesses, timedOut = false) => {
    if (locked) return;

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const seconds = Number(elapsed.toFixed(2));
    const hasWrongGuesses = guesses.some((letter) => !normalizedHangmanAnswer.includes(letter));
    const nextStreak = won ? streak + 1 : 0;
    const basePoints = calculateAnswerPoints(seconds, won);
    const bonus = getStreakBonus(nextStreak);
    const total = won ? basePoints + bonus : 0;

    setLocked(true);
    setTimes((prev) => [...prev, seconds]);
    setStreak(nextStreak);
    setBestStreak((prev) => Math.max(prev, nextStreak));
    setScore((prev) => prev + total);
    if (timedOut && !hasWrongGuesses) {
      setIncorrect((prev) => prev + 1);
    }
  };

  const handleHangmanGuess = (rawValue: string) => {
    if (locked || !currentHangmanQuestion) return;

    const letter = getGuessLetter(rawValue);
    setHangmanInput('');
    if (!letter || hangmanGuesses.includes(letter)) return;

    const nextGuesses = [...hangmanGuesses, letter];
    const nextWrongGuesses = nextGuesses.filter((guess) => !normalizedHangmanAnswer.includes(guess));
    const nextComplete = [...normalizedHangmanAnswer].every((answerLetter) => {
      if (!/[A-ZÑ]/.test(answerLetter)) return true;
      return nextGuesses.includes(answerLetter);
    });

    scoreHangmanGuess(letter);
    setHangmanGuesses(nextGuesses);

    if (nextComplete) {
      finishHangman(true, nextGuesses);
    } else if (nextWrongGuesses.length >= HANGMAN_MAX_ERRORS) {
      finishHangman(false, nextGuesses);
    }
  };

  const renderHangmanAnswer = () => {
    if (!currentHangmanQuestion) return null;

    return currentHangmanQuestion.answer.split('').map((letter, index) => {
      const normalizedLetter = normalizeGuessValue(letter);
      const isVisible = !/[A-ZÑ]/.test(normalizedLetter) || hangmanGuesses.includes(normalizedLetter) || locked;
      return (
        <span key={`${letter}-${index}`} className={`hangman-slot ${!/[A-ZÑ]/.test(normalizedLetter) ? 'separator' : ''}`}>
          {isVisible ? letter : ''}
        </span>
      );
    });
  };

  useEffect(() => {
    if (!started || !isHangman || locked) return;

    if (hangmanTimeLeft <= 0) {
      finishHangman(false, hangmanGuesses, true);
      return;
    }

    const timer = window.setTimeout(() => {
      setHangmanTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [started, isHangman, locked, hangmanTimeLeft, hangmanGuesses]);

  const onVFLeftClick = (leftIdx: number) => {
    if (locked) {
      // If locked, toggle the selection for visual feedback
      if (selectedLeftIndex === leftIdx) {
        setSelectedLeftIndex(null);
      } else {
        setSelectedLeftIndex(leftIdx);
      }
    } else {
      // If not locked, allow clicking to select a left item
      setSelectedLeftIndex(leftIdx);
    }
  };

  const onVFRightClick = (rightIdx: number) => {
    if (locked || selectedLeftIndex === null) return;
    
    const newMatches = { ...vfMatches };
    if (newMatches[selectedLeftIndex] === rightIdx) {
      delete newMatches[selectedLeftIndex];
    } else {
      Object.keys(newMatches).forEach((leftKey) => {
        if (newMatches[Number(leftKey)] === rightIdx) {
          delete newMatches[Number(leftKey)];
        }
      });
      newMatches[selectedLeftIndex] = rightIdx;
    }
    setVFMatches(newMatches);
  };

  const handleReturnHome = () => {
    if (started) {
      const shouldLeave = window.confirm('¿Seguro que deseas abandonar el juego y volver al inicio?');
      if (!shouldLeave) return;
    }

    navigate('/');
  };

  return (
    <>
      {(started || ended) && <div className="practice-brand-badge">SemioLabs</div>}

      {showModeSelector && (
        <div className="game-mode-overlay">
          <div className="game-mode-modal">
            <div className="game-mode-header">
              <h2>Elige tu modo de juego</h2>
              <p>Selecciona un minijuego o juega todos en carrusel</p>
            </div>

            <div className="game-modes-grid">
              {minigames.map((game) => (
                <button
                  key={game.id}
                  className="game-mode-card"
                  onClick={() => handleSelectMode(game.id as GameMode)}
                >
                  <span className="game-mode-icon">{game.icon}</span>
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                </button>
              ))}

              <button className="game-mode-card carousel-mode" onClick={() => handleSelectMode('carrusel')}>
                <span className="game-mode-icon">🎠</span>
                <h3>Modo Carrusel</h3>
                <p>Juega todos los minijuegos en la misma partida</p>
              </button>
            </div>

            <div className="game-mode-actions">
              <ActionButton variant="ghost" onClick={handleCloseModeSelector}>
                Cancelar
              </ActionButton>
            </div>
          </div>
        </div>
      )}

      {started ? (
        <div className="stack-col">
          <article className={`mini-card practice-game-card ${isCrossword ? 'crossword-wrapper' : ''} ${isHangman ? 'hangman-wrapper' : ''}`}>
            <h3>
              {getGameName()} - Pregunta {questionIndex + 1} de {getTotalQuestions()}
            </h3>

            {isDiagnostico && (
              <>
                <p>{(currentQuestion as any).prompt}</p>
                <div className="options-grid">
                  {(currentQuestion as any).options.map((option: string, index: number) => {
                    const q = currentQuestion as any;
                    const isCorrect = index === q.answerIndex;
                    const isSelected = selected === index;
                    const className = locked
                      ? isCorrect
                        ? 'option-btn option-correct'
                        : isSelected
                          ? 'option-btn option-wrong'
                          : 'option-btn'
                      : 'option-btn';

                    return (
                      <button key={option} className={className} onClick={() => onAnswer(index)} disabled={locked}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {isVerdaderoFalso && (
              <>
                <div className="matching-container">
                  <svg className="matching-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    {Object.entries(vfMatches).map(([leftKey, rightIndex]) => {
                      const leftIndex = Number(leftKey);
                      const colorClass = MATCH_COLORS[leftIndex % MATCH_COLORS.length];
                      const leftY = ((leftIndex + 0.5) / (currentQuestion as VFQuestion).left.length) * 100;
                      const rightY = ((rightIndex + 0.5) / (currentQuestion as VFQuestion).right.length) * 100;

                      return (
                        <g key={`${leftIndex}-${rightIndex}`} className={`matching-line ${colorClass}`}>
                          <line x1="44" y1={leftY} x2="56" y2={rightY} />
                          <circle cx="44" cy={leftY} r="1.25" />
                          <circle cx="56" cy={rightY} r="1.25" />
                        </g>
                      );
                    })}
                  </svg>
                  <div className="matching-column">
                    <h4>Síntomas</h4>
                    {(currentQuestion as VFQuestion).left.map((symptom, index) => {
                      const hasMatch = vfMatches[index] !== undefined;
                      const isSelected = selectedLeftIndex === index;
                      const isCorrectMatch = locked && vfMatches[index] === (currentQuestion as VFQuestion).pairs[index];
                      const isWrongMatch = locked && hasMatch && vfMatches[index] !== (currentQuestion as VFQuestion).pairs[index];
                      const matchColor = hasMatch ? MATCH_COLORS[index % MATCH_COLORS.length] : '';
                      
                      return (
                        <button
                          key={symptom}
                          className={`matching-item ${matchColor} ${isSelected ? 'selected' : ''} ${isCorrectMatch ? 'correct' : ''} ${isWrongMatch ? 'wrong' : ''}`}
                          onClick={() => onVFLeftClick(index)}
                          disabled={locked && !isSelected}
                        >
                          {symptom}
                          {hasMatch && !locked && ' ✓'}
                          {isCorrectMatch && ' ✓'}
                          {isWrongMatch && ' ✗'}
                        </button>
                      );
                    })}
                  </div>
                  <div className="matching-column">
                    <h4>Síndromes</h4>
                    {(currentQuestion as VFQuestion).right.map((disorder, index) => {
                      const isMatched = Object.values(vfMatches).includes(index);
                      const matchedLeftIndex = Object.keys(vfMatches).find(key => vfMatches[parseInt(key)] === index);
                      const matchedLeftNumber = matchedLeftIndex !== undefined ? parseInt(matchedLeftIndex) : null;
                      const targetColor = matchedLeftNumber !== null ? MATCH_COLORS[matchedLeftNumber % MATCH_COLORS.length] : '';
                      const isCorrectTarget = locked && matchedLeftNumber !== null && (currentQuestion as VFQuestion).pairs[matchedLeftNumber] === index;
                      const isWrongTarget = locked && matchedLeftNumber !== null && (currentQuestion as VFQuestion).pairs[matchedLeftNumber] !== index;
                      
                      return (
                        <button
                          key={disorder}
                          className={`matching-target ${targetColor} ${selectedLeftIndex !== null && !locked ? 'selectable' : ''} ${isMatched ? 'matched' : ''} ${isCorrectTarget ? 'correct' : ''} ${isWrongTarget ? 'wrong' : ''}`}
                          onClick={() => onVFRightClick(index)}
                          disabled={locked}
                        >
                          {disorder}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {isDragDrop && (
              <>
                <div className="drag-drop-container">
                  <div className="drag-items">
                    <h4>Síntomas</h4>
                    {(currentQuestion as DragDropQuestion).items.map((item) => (
                      <div
                        key={item.id}
                        className="drag-item"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer?.setData('itemId', item.id);
                          e.dataTransfer!.effectAllowed = 'copy';
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>

                  <div className="drop-targets">
                    <h4>Arrastra síntomas a su síndrome</h4>
                    {(currentQuestion as DragDropQuestion).targets.map((target) => (
                      <div
                        key={target.id}
                        className="drop-target"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer!.dropEffect = 'copy';
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          const itemId = e.dataTransfer?.getData('itemId');
                          if (itemId) {
                            setDragMatches((prev) => ({
                              ...prev,
                              [itemId]: target.id,
                            }));
                          }
                        }}
                      >
                        <div className="target-label">{target.label}</div>
                        <div className="target-items">
                          {(currentQuestion as DragDropQuestion).items
                            .filter((item) => dragMatches[item.id] === target.id)
                            .map((item) => {
                              const isCorrectMatch = locked && item.syndrome === target.syndrome;
                              const isWrongMatch = locked && item.syndrome !== target.syndrome;
                              
                              return (
                                <div key={item.id} className={`dropped-item ${isCorrectMatch ? 'correct' : ''} ${isWrongMatch ? 'wrong' : ''}`}>
                                  {item.label}
                                  <button
                                    className="remove-btn"
                                    onClick={() => {
                                      setDragMatches((prev) => {
                                        const newMatches = { ...prev };
                                        delete newMatches[item.id];
                                        return newMatches;
                                      });
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {isHangman && currentHangmanQuestion && (
              <div className="hangman-container">
                <div className="hangman-visual-panel">
                  <div className={`hangman-timer ${hangmanTimeLeft <= 5 && !locked ? 'danger' : ''}`}>
                    {hangmanTimeLeft}s
                  </div>
                  <svg className="hangman-drawing" viewBox="0 0 220 240" role="img" aria-label="Dibujo del ahorcado">
                    <line x1="30" y1="220" x2="190" y2="220" />
                    <line x1="70" y1="220" x2="70" y2="30" />
                    <line x1="70" y1="30" x2="150" y2="30" />
                    <line x1="150" y1="30" x2="150" y2="58" />
                    {hangmanWrongGuesses.length >= 1 && <circle cx="150" cy="78" r="20" />}
                    {hangmanWrongGuesses.length >= 2 && <line x1="150" y1="98" x2="150" y2="150" />}
                    {hangmanWrongGuesses.length >= 3 && <line x1="150" y1="116" x2="118" y2="136" />}
                    {hangmanWrongGuesses.length >= 4 && <line x1="150" y1="116" x2="182" y2="136" />}
                    {hangmanWrongGuesses.length >= 5 && <line x1="150" y1="150" x2="122" y2="188" />}
                    {hangmanWrongGuesses.length >= 6 && <line x1="150" y1="150" x2="178" y2="188" />}
                  </svg>
                  <div className="hangman-errors">
                    Errores: {hangmanWrongGuesses.length} / {HANGMAN_MAX_ERRORS}
                  </div>
                </div>

                <div className="hangman-play-panel">
                  <p className="hangman-hint"><strong>Pista:</strong> {currentHangmanQuestion.hint}</p>
                  <div className="hangman-word" aria-label="Respuesta del ahorcado">
                    {renderHangmanAnswer()}
                  </div>

                  <form
                    className="hangman-input-row"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleHangmanGuess(hangmanInput);
                    }}
                  >
                    <input
                      aria-label="Escribe una letra"
                      autoComplete="off"
                      maxLength={1}
                      value={hangmanInput}
                      disabled={locked}
                      onChange={(e) => setHangmanInput(getGuessLetter(e.target.value))}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && !/[A-Za-zÃ‘Ã±ÃÃ‰ÃÃ“ÃšÃœÃ¡Ã©Ã­Ã³ÃºÃ¼]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <button type="submit" className="hangman-submit" disabled={locked || !hangmanInput}>
                      Probar
                    </button>
                  </form>

                  <div className="hangman-keyboard">
                    {HANGMAN_ALPHABET.map((letter) => {
                      const used = hangmanGuesses.includes(letter);
                      const correctLetter = used && normalizedHangmanAnswer.includes(letter);
                      const wrongLetter = used && !normalizedHangmanAnswer.includes(letter);
                      return (
                        <button
                          key={letter}
                          type="button"
                          className={`hangman-key ${correctLetter ? 'correct' : ''} ${wrongLetter ? 'wrong' : ''}`}
                          disabled={locked || used}
                          onClick={() => handleHangmanGuess(letter)}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>

                  <div className="hangman-feedback">
                    {locked && hangmanIsComplete && <span className="success">Correcto: {currentHangmanQuestion.answer}</span>}
                    {locked && !hangmanIsComplete && <span className="danger">Respuesta: {currentHangmanQuestion.answer}</span>}
                    {!locked && hangmanCorrectGuesses.length > 0 && <span>Letras correctas: {hangmanCorrectGuesses.join(', ')}</span>}
                  </div>
                </div>
              </div>
            )}

            {isCrossword && (
              <>
                <div className="crossword-container">
                  <div className="crossword-board-and-clues">
                    <div
                      className="crossword-board"
                      style={{
                        gridTemplateColumns: `repeat(${crosswordPuzzle.cols}, 36px)`,
                        width: `${crosswordPuzzle.cols * 36}px`,
                      }}
                    >
                      {crosswordPuzzle.cells.reduce((acc: any[], rowCells: any[], rowIndex: number) => {
                        const mapped = rowCells.map((cell: any, colIndex: number) => {
                          const cellKey = `${rowIndex}-${colIndex}`;
                          const inputId = `cell-${cellKey}-input`;
                          if (cell.blocked) {
                            return (
                              <div key={cellKey} className="crossword-cell blocked" />
                            );
                          }

                          const isHighlighted = selectedCells.has(cellKey);
                          const cellStatus = getCrosswordCellStatus(rowIndex, colIndex, cell.solution);

                          const cluesStartingHere = crosswordPuzzle.clues.filter((cl) => cl.row === rowIndex && cl.col === colIndex);
                          const titleText = cluesStartingHere.length > 0
                            ? cluesStartingHere.map((cl) => `${cl.number} ${cl.direction}`).join(', ')
                            : '';

                          return (
                            <div
                              key={cellKey}
                              className={`crossword-cell ${isHighlighted ? 'highlight' : ''} ${cellStatus}`}
                              onClick={() => {
                                const el = document.getElementById(inputId) as HTMLInputElement | null;
                                el?.focus();
                              }}
                              title={titleText}
                            >
                              {cell.number && <div className="cell-number">{cell.number}</div>}
                              <input
                                id={inputId}
                                inputMode="text"
                                autoComplete="off"
                                maxLength={1}
                                tabIndex={0}
                                value={crosswordAnswers[cellKey] || ''}
                                disabled={locked}
                                onChange={(e) => handleCrosswordChange(rowIndex, colIndex, e.target.value)}
                                onFocus={() => setFocusedCellKey(cellKey)}
                                onBlur={() => setFocusedCellKey((prev) => (prev === cellKey ? null : prev))}
                                onKeyDown={(e) => {
                                  const key = e.key;
                                  const letterRegex = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;
                                  if (key.length === 1 && !letterRegex.test(key)) {
                                    e.preventDefault();
                                  }
                                  // allow Backspace and navigation keys
                                }}
                              />
                            </div>
                          );
                        });

                        return acc.concat(mapped);
                      }, [])}
                    </div>

                    <div className="crossword-clues">
                      <h4>Pistas</h4>
                      <div>
                        <h4>Horizontal</h4>
                        <ul className="list">
                              {crosswordPuzzle.clues
                                .filter((c) => c.direction === 'across')
                                .map((c) => (
                                  <li key={c.id} onClick={() => handleClueClick(c)} style={{ cursor: 'pointer' }}>
                                    <strong>{c.number}.</strong> {c.clue}
                                  </li>
                                ))}
                        </ul>
                      </div>

                      <div>
                        <h4>Vertical</h4>
                        <ul className="list">
                          {crosswordPuzzle.clues
                            .filter((c) => c.direction === 'down')
                            .map((c) => (
                              <li key={c.id} onClick={() => handleClueClick(c)} style={{ cursor: 'pointer' }}>
                                <strong>{c.number}.</strong> {c.clue}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="crossword-letters" aria-hidden={false}>
                    {/* Answer bank: clickable syndrome names (shuffled). Only fills the selected clue if length matches. */}
                    <div className="answer-bank">
                      {answerBank.map((ans) => {
                        const canUse = !!selectedClueId && crosswordPuzzle.clues.find((c) => c.id === selectedClueId)?.length === ans.length;
                        return (
                          <button
                            key={ans}
                            type="button"
                            className={`answer-chip ${canUse ? '' : 'disabled'}`}
                            onClick={() => {
                              if (!selectedClueId) return;
                              if (!canUse) return;
                              fillClueWithAnswer(selectedClueId, ans.replace(/\s+/g, ''));
                            }}
                            title={ans}
                          >
                            {ans}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}


          </article>

          <div className="stats-bar">
            <div className="stat-pill">Puntaje: {score}</div>
            <div className="stat-pill">Racha: {streak}</div>
            <div className="stat-pill">Correctas: {correct}</div>
            <div className="stat-pill">Incorrectas: {incorrect}</div>
          </div>

          <div className="practice-action-row">
            <ActionButton variant="ghost" onClick={handleReturnHome}>
              Volver al inicio
            </ActionButton>

            <div className="practice-next-action">
              {isDragDrop ? (
                locked ? (
                  <ActionButton variant="secondary" onClick={goNext}>
                    {questionIndex === getTotalQuestions() - 1 ? 'Finalizar partida' : 'Siguiente pregunta'}
                  </ActionButton>
                ) : (
                  <ActionButton variant="secondary" onClick={onDragDrop} disabled={locked}>
                    Verificar respuesta
                  </ActionButton>
                )
              ) : isVerdaderoFalso ? (
                locked ? (
                  <ActionButton variant="secondary" onClick={goNext}>
                    {questionIndex === getTotalQuestions() - 1 ? 'Finalizar partida' : 'Siguiente pregunta'}
                  </ActionButton>
                ) : (
                  <ActionButton variant="secondary" onClick={onVerdaderoFalso} disabled={locked}>
                    Verificar respuesta
                  </ActionButton>
                )
              ) : isCrossword ? (
                locked ? (
                  <ActionButton variant="secondary" onClick={goNext}>
                    {questionIndex === getTotalQuestions() - 1 ? 'Finalizar partida' : 'Siguiente pregunta'}
                  </ActionButton>
                ) : (
                  <ActionButton variant="secondary" onClick={onCrosswordVerify} disabled={locked}>
                    Verificar respuestas
                  </ActionButton>
                )
              ) : isHangman ? (
                locked ? (
                  <ActionButton variant="secondary" onClick={goNext}>
                    {questionIndex === getTotalQuestions() - 1 ? 'Finalizar partida' : 'Siguiente pregunta'}
                  </ActionButton>
                ) : (
                  <ActionButton variant="secondary" onClick={goNext} disabled>
                    Adivina antes de que termine el tiempo
                  </ActionButton>
                )
              ) : (
                <ActionButton variant="secondary" onClick={goNext} disabled={!locked}>
                  {questionIndex === getTotalQuestions() - 1 ? 'Finalizar partida' : 'Siguiente pregunta'}
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {ended ? (
        <div className="results-container">
          <article className="mini-card">
            <h3>Resultado final</h3>
            <ul className="results-grid">
              <li>Puntaje total: {score} pts</li>
              <li>Respuestas correctas: {correct}</li>
              <li>Respuestas incorrectas: {incorrect}</li>
              <li>Tiempo promedio: {averageTime} s</li>
              <li>Porcentaje de aciertos: {accuracy}%</li>
            </ul>
          </article>

          <article className="mini-card">
            <h3>Historial reciente</h3>
            <ul className="list">
              {stats.recentMatches.map((match) => (
                <li key={match.id}>
                  {new Date(match.date).toLocaleString()} · {match.mode} · {match.score} pts · {match.accuracy}%
                </li>
              ))}
            </ul>
          </article>

          <div className="results-button-container practice-action-row">
            <ActionButton variant="ghost" onClick={handleReturnHome}>
              Volver al inicio
            </ActionButton>
            <ActionButton variant="primary" onClick={handleShowModeSelector}>
              Jugar otra vez
            </ActionButton>
          </div>
        </div>
      ) : null}
  
    </>
  );
}

export default PracticePage;
