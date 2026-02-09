// PLG UK Hub - Treatment Journey Page
// Main page for the 4-Phase Treatment Stepper

import { TreatmentJourneyClient } from './TreatmentJourneyClient';
import { fetchPrescribersAction } from '@/lib/actions/treatment-journey';

export const metadata = {
  title: 'Treatment Journey | PLG UK Hub',
  description: 'Multi-phase treatment journey with CQC compliance',
};

export default async function TreatmentJourneyPage() {
  // Fetch prescribers server-side (data that doesn't change often)
  const prescribers = await fetchPrescribersAction();

  return (
    <main className="min-h-screen bg-gray-50">
      <TreatmentJourneyClient prescribers={prescribers} />
    </main>
  );
}
