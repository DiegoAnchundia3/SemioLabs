import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ViewCard from '../components/ViewCard';
import { studySyndromes } from '../data/studySyndromes';
import type { StudySyndrome } from '../types/gameplay';

function StudyPage() {
  const [selectedSyndrome, setSelectedSyndrome] = useState<StudySyndrome | null>(null);

  useEffect(() => {
    if (!selectedSyndrome) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedSyndrome(null);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedSyndrome]);

  return (
    <ViewCard title="Modo Estudiar" description="Revisa los contenidos antes de entrar a practicar o competir.">
      <div className="syndromes-grid">
        {studySyndromes.map((syndrome) => (
          <button key={syndrome.id} type="button" className="syndrome-card" onClick={() => setSelectedSyndrome(syndrome)}>
            <span className="syndrome-title">{syndrome.name}</span>
          </button>
        ))}
      </div>

      {selectedSyndrome && createPortal(
        <div className="study-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="study-modal-title">
          <article className="study-modal">
            <div className="study-modal-header">
              <h2 id="study-modal-title">{selectedSyndrome.name}</h2>
              <button type="button" className="study-modal-close" onClick={() => setSelectedSyndrome(null)} aria-label="Cerrar">
                x
              </button>
            </div>

            <p className="syndrome-definition">{selectedSyndrome.definition}</p>

            <div className="syndrome-section">
              <h3>Caracteristicas principales</h3>
              <ul className="list">
                {selectedSyndrome.traits.map((item) => (
                  <li key={`${selectedSyndrome.id}-trait-${item}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="syndrome-section">
              <h3>Sintomas asociados</h3>
              <ul className="list">
                {selectedSyndrome.symptoms.map((item) => (
                  <li key={`${selectedSyndrome.id}-symptom-${item}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="syndrome-section">
              <h3>Diferenciacion clinica</h3>
              <ul className="list">
                {selectedSyndrome.differences.map((item) => (
                  <li key={`${selectedSyndrome.id}-diff-${item}`}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>,
        document.body,
      )}
    </ViewCard>
  );
}

export default StudyPage;
