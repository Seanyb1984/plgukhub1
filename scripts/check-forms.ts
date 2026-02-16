import { formRegistry } from '../src/lib/forms/registry';

console.log("--- PLG UK FORM DIAGNOSTIC ---");
const allForms = formRegistry.getAll();
console.log(`Total forms registered: ${allForms.length}`);

allForms.forEach(f => {
  console.log(`- Form Found: [${f.id}] Title: ${f.title}`);
});

const tj = formRegistry.get('treatment-journey');
if (tj) {
  console.log("✅ SUCCESS: 'treatment-journey' is correctly registered.");
} else {
  console.log("❌ ERROR: 'treatment-journey' was NOT found in the registry.");
}