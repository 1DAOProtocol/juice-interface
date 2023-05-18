import { updateDBProjects } from 'lib/api/supabase/projects'
import { NextApiHandler } from 'next'

// Synchronizes projects in the database with the latest Juicebox Subgraph/IPFS data
const handler: NextApiHandler = async (_, res) => {
  // eslint-disable-next-line no-console
  console.log('update.page.ts')
  await updateDBProjects(res, false)
}

export default handler
