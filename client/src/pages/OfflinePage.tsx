import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { MatteButton } from '../components/ui/MatteButton';

export const OfflinePage: React.FC = () => {
  return (
    <div className="pt-40 pb-20 max-w-md mx-auto px-4 text-center min-h-screen flex flex-col justify-center text-ink theme-transition">
      <div className="w-16 h-16 rounded-2xl bg-warm border border-sand flex items-center justify-center mx-auto mb-4 text-stone">
        <WifiOff className="w-8 h-8 text-gold" />
      </div>
      <h1 className="text-2xl font-black text-ink font-serif uppercase">Offline Network Telemetry</h1>
      <p className="text-xs text-stone mt-2 mb-6 font-semibold">
        Your internet connection is currently unreachable. Reconnect to access VEXO hardware services.
      </p>
      <MatteButton
        onClick={() => window.location.reload()}
        variant="primary"
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Retry Network Connection
      </MatteButton>
    </div>
  );
};
