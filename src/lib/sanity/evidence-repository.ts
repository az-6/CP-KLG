import groq from 'groq';
import { sanityFixtures } from '../../data/sanity-fixtures';
import type {
  CompanyFactDocument,
  CredentialDocument,
  OperationalMediaDocument,
} from '../../types/sanity';
import { sanityClient } from './client';
import type { Locale } from '../../i18n';
import { isSanityFixtureMode } from './config';
import { localizeCredential, localizeFact, localizeMedia } from './localize';

export interface EvidenceDataset {
  facts: CompanyFactDocument[];
  media: OperationalMediaDocument[];
  credentials: CredentialDocument[];
}

export const EVIDENCE_QUERY = groq`{
  "facts": *[_type == "companyFact" && isActive == true] | order(order asc, label asc){
    _id, label, value, description, placement, order, isActive, en
  },
  "media": *[_type == "operationalMedia" && isActive == true] | order(order asc, title asc){
    _id, title, image, documentationType, order, isActive
  },
  "credentials": *[_type == "credential" && isActive == true] | order(order asc, name asc){
    _id, name, description, previewImage, order, isActive, en
  }
}`;

const byOrder = <T extends { order: number }>(left: T, right: T) => left.order - right.order;

export function groupEvidence(dataset: EvidenceDataset) {
  const facts = dataset.facts.filter((item) => item.isActive).sort(byOrder);
  const media = dataset.media.filter((item) => item.isActive).sort(byOrder);
  const credentials = dataset.credentials.filter((item) => item.isActive).sort(byOrder);

  return {
    homeFacts: facts.filter((item) => item.placement === 'home'),
    about: {
      facts: facts.filter((item) => item.placement === 'about'),
      team: media.filter((item) => item.documentationType === 'team'),
      fleet: media.filter((item) => item.documentationType === 'fleet'),
      activities: media.filter((item) => item.documentationType === 'activity'),
      credentials,
    },
    process: {
      process: media.filter((item) => item.documentationType === 'process'),
      facilities: media.filter((item) => item.documentationType === 'facility'),
    },
  };
}

async function getEvidenceDataset(locale: Locale): Promise<EvidenceDataset> {
  const dataset: EvidenceDataset = isSanityFixtureMode(import.meta.env, process.env)
    ? {
      facts: sanityFixtures.companyFacts,
      media: sanityFixtures.operationalMedia,
      credentials: sanityFixtures.credentials,
    }
    : await sanityClient.fetch<EvidenceDataset>(EVIDENCE_QUERY);
  return {
    facts: dataset.facts.map((fact) => localizeFact(fact, locale)),
    media: dataset.media.map((item) => localizeMedia(item, locale)),
    credentials: dataset.credentials.map((credential) => localizeCredential(credential, locale)),
  };
}

export async function getHomeFacts(locale: Locale = 'id') {
  return groupEvidence(await getEvidenceDataset(locale)).homeFacts;
}

export async function getAboutEvidence(locale: Locale = 'id') {
  return groupEvidence(await getEvidenceDataset(locale)).about;
}

export async function getProcessEvidence(locale: Locale = 'id') {
  return groupEvidence(await getEvidenceDataset(locale)).process;
}
