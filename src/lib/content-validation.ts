import type { CompanyProfile, Product } from '../types/content';

const phonePattern = /^\d{8,15}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCompanyProfile(profile: CompanyProfile): string[] {
  const errors: string[] = [];

  if (!profile.name.trim()) errors.push('name is required');
  if (!phonePattern.test(profile.contact.whatsappNumber)) {
    errors.push('whatsappNumber must contain international digits only');
  }
  if (profile.contact.secondaryWhatsAppNumber && !phonePattern.test(profile.contact.secondaryWhatsAppNumber)) {
    errors.push('secondaryWhatsAppNumber must contain international digits only');
  }
  if (profile.contact.email && !emailPattern.test(profile.contact.email)) {
    errors.push('email must be valid');
  }
  if (profile.proofs.some((proof) => !proof.title.trim() || !proof.evidence.trim())) {
    errors.push('proof items require a title and evidence');
  }

  return errors;
}

export function validateProducts(items: Product[]): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const item of items) {
    if (!/^[a-z0-9-]+$/.test(item.slug)) errors.push(`${item.name}: slug is invalid`);
    if (slugs.has(item.slug)) errors.push(`${item.name}: slug must be unique`);
    if (!item.name.trim() || !item.description.trim()) errors.push(`${item.slug}: name and description are required`);
    slugs.add(item.slug);
  }

  return errors;
}
