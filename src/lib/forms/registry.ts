import { FormDefinition, Brand } from './types';

// Import all form definitions
import { plgUkForms } from './definitions/plg-uk';
import { menhancementsForms } from './definitions/menhancements';
import { waxForMenForms } from './definitions/wax-for-men';
import { waxForWomenForms } from './definitions/wax-for-women';

// ============================================
// FORM REGISTRY
// ============================================

class FormRegistry {
  private forms: Map<string, FormDefinition> = new Map();

  register(form: FormDefinition): void {
    if (this.forms.has(form.id)) {
      console.warn(`Form "${form.id}" is already registered. Overwriting.`);
    }
    this.forms.set(form.id, form);
  }

  registerAll(forms: FormDefinition[]): void {
    forms.forEach((form) => this.register(form));
  }

  get(formId: string): FormDefinition | undefined {
    return this.forms.get(formId);
  }

  getAll(): FormDefinition[] {
    return Array.from(this.forms.values());
  }

  getByBrand(brand: Brand): FormDefinition[] {
    return this.getAll().filter((form) => {
      if (form.brand === 'ALL') return true;
      if (Array.isArray(form.brand)) return form.brand.includes(brand);
      return form.brand === brand;
    });
  }

  getByCategory(category: string): FormDefinition[] {
    return this.getAll().filter((form) => form.category === category);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.getAll().forEach((form) => categories.add(form.category));
    return Array.from(categories).sort();
  }

  getCategoriesByBrand(brand: Brand): string[] {
    const categories = new Set<string>();
    this.getByBrand(brand).forEach((form) => categories.add(form.category));
    return Array.from(categories).sort();
  }

  search(query: string): FormDefinition[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (form) =>
        form.name.toLowerCase().includes(lowerQuery) ||
        form.description?.toLowerCase().includes(lowerQuery) ||
        form.category.toLowerCase().includes(lowerQuery)
    );
  }
}

// Create singleton instance
export const formRegistry = new FormRegistry();

// Register all forms on module load
export function initializeFormRegistry(): void {
  formRegistry.registerAll(plgUkForms);
  formRegistry.registerAll(menhancementsForms);
  formRegistry.registerAll(waxForMenForms);
  formRegistry.registerAll(waxForWomenForms);
}

// Initialize immediately
initializeFormRegistry();

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getFormDefinition(formId: string): FormDefinition | undefined {
  return formRegistry.get(formId);
}

export function getAllForms(): FormDefinition[] {
  return formRegistry.getAll();
}

export function getFormsByBrand(brand: Brand): FormDefinition[] {
  return formRegistry.getByBrand(brand);
}

export function getFormCategories(brand?: Brand): string[] {
  if (brand) {
    return formRegistry.getCategoriesByBrand(brand);
  }
  return formRegistry.getCategories();
}
