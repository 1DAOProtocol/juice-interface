import { updateDBProjects } from 'lib/api/supabase/projects'
import { NextApiHandler } from 'next'

// Synchronizes the Sepana engine with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (_, res) => {
  // eslint-disable-next-line no-console
  console.log('update-retry-ipfs.page.ts')
  await updateDBProjects(res, true)
}

export default handler
