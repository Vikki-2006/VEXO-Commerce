import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';
import { MatteButton } from '../components/ui/MatteButton';

export const Error500Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-40 pb-20 max-w-md mx-auto px-4 text-center min-h-screen flex flex-col justify-center text-ink theme-transition">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4 text-danger">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-ink font-serif uppercase">500 Server Telemetry Error</h1>
      <p className="text-xs text-stone mt-2 mb-6 font-semibold">
        An internal server exception occurred in VEXO Systems telemetry engine.
      </p>
      <MatteButton
        onClick={() => navigate('/')}
        variant="primary"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Return to Index
      </MatteButton>
    </div>
  );
};
