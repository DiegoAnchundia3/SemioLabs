import ActionButton from '../components/ActionButton';
import { useAppConfig } from '../hooks/useAppConfig';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const config = useAppConfig();
  const navigate = useNavigate();

  return (
    <section className="hero hero-single card">
      <div>
        <p className="eyebrow">{config.appName}</p>
        <h1>{config.heroTitle}</h1>
        <p className="hero-copy">{config.heroDescription}</p>
        <p className="subtle-note">{config.anonymousUserBadge}</p>
        <div className="cta-row">
          <ActionButton variant="primary" onClick={() => navigate('/estudiar')}>
            Estudiar
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => navigate('/practicar')}>
            Jugar
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
