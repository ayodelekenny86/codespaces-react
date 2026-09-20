import { useCallback } from 'react';

export const buildReport = (kind, region) => ({
  report: kind,
  generatedAt: new Date().toISOString(),
  region,
  demand: [
    { area: 'East Legon', share: '31%', peak: '07:00–10:00', recommendation: 'Stage 6 trucks' },
    { area: 'Osu', share: '24%', peak: '07:00–10:00', recommendation: 'Stage 4 trucks' },
    { area: 'Low demand zones', share: '18%', peak: 'After 14:00', recommendation: 'Reduce idle capacity' },
  ],
  paymentsPending: 'GH₵4,820',
  revenueAtRisk: 'GH₵1,240',
  interventions: 'Redeploy drivers, review escrow, contact dissatisfied buyers',
});

const downloadJson = (filename, payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

/**
 * Owns the ops reporting flow: building a region-scoped demand report and
 * triggering the browser download.
 */
export function useReports({ region, onNotice }) {
  const downloadReport = useCallback((kind) => {
    const report = buildReport(kind, region);
    const filename = `aqualink-${kind.toLowerCase().replaceAll(' ', '-')}-${region.toLowerCase()}.json`;
    downloadJson(filename, report);
    onNotice(`${kind} report downloaded for ${region}.`);
  }, [region, onNotice]);

  return { downloadReport };
}

export default useReports;
