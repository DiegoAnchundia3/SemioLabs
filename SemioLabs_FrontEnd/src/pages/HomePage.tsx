import { useState } from 'react';
import HeroSection from '../sections/HeroSection';

const psychologyTeam = [
  {
    initials: 'MJ',
    name: 'Psic. Mera Constante Mercedes Jamileth',
  },
  {
    initials: 'DN',
    name: 'Psic. Mero Quijije Danna Nahomy',
  },
  {
    initials: 'NJ',
    name: 'Psic. Iza Montaño Naidelyn Jineth',
  },
  {
    initials: 'WJ',
    name: 'Psic. Basurto Cedeño Wendy Janela',
  },
];

const supportTeam = [
  {
    initials: 'DA',
    name: 'Ing. Anchundia Parraga Diego Ariel',
  },
];

function HomePage() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <button
        type="button"
        className="about-trigger"
        onClick={() => setShowAbout((current) => !current)}
        aria-expanded={showAbout}
        aria-label="Ver informacion del equipo"
      >
        !
      </button>

      {showAbout ? (
        <aside className="about-card" aria-label="Acerca del equipo">
          <div className="about-card-header">
            <span className="about-kicker">Acerca de</span>
            <button type="button" className="about-close" onClick={() => setShowAbout(false)} aria-label="Cerrar">
              x
            </button>
          </div>

          <h2>Equipo del proyecto</h2>

          <section className="about-section">
            <h3>Equipo de psicologia</h3>
            <div className="about-list">
              {psychologyTeam.map((member) => (
                <article className="about-member" key={member.name}>
                  <span className="about-avatar">{member.initials}</span>
                  <div>
                    <strong>{member.name}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="about-section">
            <h3>Soporte / extra</h3>
            <div className="about-list">
              {supportTeam.map((member) => (
                <article className="about-member" key={member.name}>
                  <span className="about-avatar">{member.initials}</span>
                  <div>
                    <strong>{member.name}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      ) : null}

      <HeroSection />
    </>
  );
}

export default HomePage;
