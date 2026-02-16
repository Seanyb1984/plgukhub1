import { FormDefinition, Brand } from './types';
import { plgUkForms } from './definitions/plg-uk';
import { menhancementsForms } from './definitions/menhancements';
import { waxForMenForms } from './definitions/wax-for-men';
import { waxForWomenForms } from './definitions/wax-for-women';

// ============================================
// FORM REGISTRY - THE SYSTEM BRAIN
// ============================================

class FormRegistry {
  private forms: Map<string, FormDefinition> = new Map();

  // Registers a single form into the system
  register(form: FormDefinition): void {
    this.forms.set(form.id, form);
  }

  // Registers lists of forms
  registerAll(forms: FormDefinition[]): void {
    forms.forEach((form) => this.register(form));
  }

  // Find a specific form by its ID
  get(formId: string): FormDefinition | undefined {
    return this.forms.get(formId);
  }

  // List every single form available in the Hub
  getAll(): FormDefinition[] {
    return Array.from(this.forms.values());
  }

  // Filter forms by a specific brand
  getByBrand(brand: Brand | 'ALL'): FormDefinition[] {
    return this.getAll().filter((form) => {
      return form.brand === 'ALL' || form.brand === brand;
    });
  }

  // Group forms by Category
  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAll().forEach((form) => {
      if (form.category) categories.add(form.category);
    });
    return Array.from(categories).sort();
  }
}

// Create the single instance used by the whole app
export const formRegistry = new FormRegistry();

// ============================================
// AUTO-INITIALIZATION - THE FIX
// This ensures forms are loaded immediately upon import
// ============================================
formRegistry.registerAll(plgUkForms);
formRegistry.registerAll(menhancementsForms);
formRegistry.registerAll(waxForMenForms);
formRegistry.registerAll(waxForWomenForms);

// ============================================
// PUBLIC HELPER FUNCTIONS
// ============================================

export function getFormDefinition(formId: string) {
  return formRegistry.get(formId);
}

export function getAllForms() {
  return formRegistry.getAll();
}
