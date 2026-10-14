import { ArrowDown, LoaderCircle } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';

const reloadPage = () => window.location.reload();

export function PullToRefresh() {
  const { distance, refreshing, ready } = usePullToRefresh(reloadPage);
  return <div
    className="ptr-indicator"
    data-visible={distance > 0 || refreshing}
    data-state={refreshing ? 'refreshing' : ready ? 'ready' : 'pulling'}
    role="status"
    aria-live="polite"
    aria-label={refreshing ? 'Aggiornamento in corso' : ready ? 'Rilascia per aggiornare' : distance > 0 ? 'Tira per aggiornare' : undefined}
  >
    {refreshing ? <LoaderCircle className="ptr-spinner" aria-hidden="true" /> : <ArrowDown className="ptr-arrow" aria-hidden="true" />}
  </div>;
}