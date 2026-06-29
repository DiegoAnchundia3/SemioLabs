import type { PropsWithChildren } from 'react';
import ActionButton from './ActionButton';
import { useNavigate } from 'react-router-dom';

interface ViewCardProps {
  title: string;
  description?: string;
}

function ViewCard({ title, description, children }: PropsWithChildren<ViewCardProps>) {
  const navigate = useNavigate();

  return (
    <section className="hero hero-single card page-card">
      <div>
        <p className="eyebrow">SemioLabs</p>
        <h1 className="page-title">{title}</h1>
        {description ? <p className="hero-copy">{description}</p> : null}
        {children}
        <div className="cta-row page-actions">
          <ActionButton variant="ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </ActionButton>
        </div>
      </div>
    </section>
  );
}

export default ViewCard;