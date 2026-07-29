import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { MatteButton } from '../components/ui/MatteButton';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-20 max-w-md mx-auto px-4 text-center min-h-screen flex flex-col justify-center text-ink">
      <span className="text-2xl font-black tracking-[0.15em] text-ink font-serif uppercase block">
        VEXO
      </span>
      <h1 className="text-6xl font-black text-ink font-serif mt-2">404</h1>
      <h2 className="text-base font-bold text-ink mt-2">Coordinate Not Found</h2>
      <p className="text-xs text-stone mt-2 mb-8 font-semibold">
        The requested URL index coordinate does not exist in VEXO Systems topology.
      </p>
      <MatteButton
        onClick={() => navigate('/')}
        variant="primary"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Return to VEXO Index
      </MatteButton>
    </div>
  );
};
