import { Contract } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { loadJBProjectHandlesContract } from 'hooks/JBProjectHandles/contracts/loadJBProjectHandles'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'

const logger = getLogger('api/juicebox/projectHandle/[projectId]')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.info('++++++++++++++++++ - 1');
  if (req.method !== 'GET') {
    return res.status(404)
  }
  console.info('++++++++++++++++++ - 2');

  try {
    console.info('++++++++++++++++++ - 3');
    const { projectId } = req.query
    console.info('++++++++++++++++++ - 4:', projectId);

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' })
    }
    console.info('++++++++++++++++++ - 5');

    const JBProjectHandlesJson = await loadJBProjectHandlesContract(
      readNetwork.name,
    )
    console.info('++++++++++++++++++ - 6');
    const JBProjectHandles = new Contract(
      JBProjectHandlesJson.address,
      JBProjectHandlesJson.abi,
      readProvider,
    )
    console.info('++++++++++++++++++ - 7');

    console.info('*******************************');

    const handle = await JBProjectHandles.handleOf(projectId)
    console.info('*******************************');

    // cache for a day if project handle found
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
    logger.info({ data: { handle, projectId } })
    return res.status(200).json({ handle, projectId })
  } catch (err) {
    logger.error({ error: err })
    console.info('++++++++++++++++++ - 8:', err);
    return res.status(500).json({ error: 'failed to resolve project handle' })
  }
}

export default handler
