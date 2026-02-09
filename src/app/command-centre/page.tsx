// PLG UK Hub - Command Centre Page
// Governance forms hub for non-client compliance forms

import { CommandCentreClient } from './CommandCentreClient';

export const metadata = {
  title: 'Command Centre | PLG UK Hub',
  description: 'Governance and compliance forms management',
};

export default function CommandCentrePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CommandCentreClient />
    </main>
  );
}
