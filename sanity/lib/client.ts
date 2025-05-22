import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token:'skmCcw9KOB6ViynMEYJG4UKTSyT7UQLWPZYgYlzRc40BUGpOfvbJCgz1bOvWvjb4mb1MSRfdHDV5EqBLk4ID2PROPNtW1SVv8L4YCA5MVV9gIn2TnDP1BAOfW1U9sw3362uWUrFEWnr98XgaRr48OmBBSRGTTwrfDdmDIhDZT55p2u5fnMeT'
})
