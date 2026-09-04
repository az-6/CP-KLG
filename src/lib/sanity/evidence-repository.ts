import groq from 'groq';
import { sanityFixtures } from '../../data/sanity-fixtures';
import type {
  CompanyFactDocument,
  CredentialDocument,
  OperationalMediaDocument,
} from '../../types/sanity';
import { sanityClient } from './client';
import { isSanityFixtureMode } from './config';

export interface EvidenceDataset {
  facts: CompanyFactDocument[];
  media: OperationalMediaDocument[];
  credentials: CredentialDocument[];
}

export const EVIDENCE_QUERY = groq`{
  "facts": *[_type == "companyFact" && isActive == true] | order(order asc, label asc){
    _id, label, value, description, placement, order, isActive
  },
  "media": *[_type == "operationalMedia" && isActive == true] | order(order asc, title asc){
    _id, title, image, documentationType, order, isActive
  },
  "credentials": *[_type == "credential" && isActive == true] | order(order asc, name asc){
    _id, name, description, previewImage, order, isActive
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

async function getEvidenceDataset(): Promise<EvidenceDataset> {
  if (isSanityFixtureMode(import.meta.env, process.env)) {
    return {
      facts: sanityFixtures.companyFacts,
      media: sanityFixtures.operationalMedia,
      credentials: sanityFixtures.credentials,
    };
  }
  return sanityClient.fetch<EvidenceDataset>(EVIDENCE_QUERY);
}

export async function getHomeFacts() {
  return groupEvidence(await getEvidenceDataset()).homeFacts;
}

export async function getAboutEvidence() {
  return groupEvidence(await getEvidenceDataset()).about;
}

export async function getProcessEvidence() {
  return groupEvidence(await getEvidenceDataset()).process;
}
