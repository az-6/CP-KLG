import { describe, expect, it } from 'vitest';
import { validateCompanyProfile, validateProducts } from '../../src/lib/content-validation';
import type { CompanyProfile } from '../../src/types/content';

const validCompany: CompanyProfile = {
  name: 'PT Katalis Lintas Global',
  shortName: 'Katalis Lintas Global',
  slogan: 'Kualitas Terjaga, Spesifikasi Anda.',
  heroTitle: 'Pasokan Ikan Berkualitas Konsisten untuk Bisnis Anda',
  heroDescription: 'Deskripsi',
  about: 'Tentang perusahaan',
  contact: { whatsappNumber: '628123456789' },
  proofs: [{ title: 'Mutu', description: 'Deskripsi', evidence: 'Bukti', icon: 'quality' }],
  process: [],
};

describe('validateCompanyProfile', () => {
  it('accepts verified content', () => {
    expect(validateCompanyProfile(validCompany)).toEqual([]);
  });

  it('rejects a non-numeric WhatsApp number', () => {
    expect(validateCompanyProfile({
      ...validCompany,
      contact: { whatsappNumber: '+62 812' },
    })).toContain('whatsappNumber must contain international digits only');
  });

  it('rejects a non-numeric secondary WhatsApp number', () => {
    expect(validateCompanyProfile({
      ...validCompany,
      contact: { whatsappNumber: '628123456789', secondaryWhatsAppNumber: '+62 815' },
    })).toContain('secondaryWhatsAppNumber must contain international digits only');
  });
});

describe('validateProducts', () => {
  it('rejects duplicate slugs', () => {
    const item = { slug: 'tuna', name: 'Tuna', category: 'tuna' as const, description: 'Tuna' };
    expect(validateProducts([item, item])).toContain('Tuna: slug must be unique');
  });
});
