import { createClient } from '@sanity/client';

const SANITY_PROJECT_ID = import.meta.env.SANITY_PROJECT_ID;
const SANITY_DATASET = import.meta.env.SANITY_DATASET;
const SANITY_TOKEN = import.meta.env.SANITY_TOKEN;

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true,
  apiVersion: "2023-11-24",
  token: SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});

export default client;
