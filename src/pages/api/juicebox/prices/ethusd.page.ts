import { CV_V3 } from 'constants/cv'
import { WAD_DECIMALS } from 'constants/numbers'
import { loadJBPrices } from 'hooks/JBPrices/loadJBPrices'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { fromWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'

const PRICE_REFRESH_INTERVAL_SECONDS = 60 * 5 // 5 minutes

const logger = getLogger('api/juicebox/prices/ethusd')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  try {
    const JBPrices = await loadJBPrices({ cv: CV_V3 })
    // eslint-disable-next-line no-console
    console.log('ethusd.page.ts - 1')
    // eslint-disable-next-line no-console
    console.log('ethusd.page.ts - V2V3_CURRENCY_USD', V2V3_CURRENCY_USD)
    // eslint-disable-next-line no-console
    console.log('ethusd.page.ts - V2V3_CURRENCY_ETH', V2V3_CURRENCY_ETH)
    // eslint-disable-next-line no-console
    console.log('ethusd.page.ts - WAD_DECIMALS', WAD_DECIMALS)
    const priceRaw = await JBPrices?.priceFor(
      V2V3_CURRENCY_USD,
      V2V3_CURRENCY_ETH,
      WAD_DECIMALS,
    )
    // eslint-disable-next-line no-console
    console.log('ethusd.page.ts - 2')

    const price = priceRaw ? fromWad(priceRaw) : 0

    // cache for one hour
    res.setHeader(
      'Cache-Control',
      `s-maxage=${PRICE_REFRESH_INTERVAL_SECONDS}, stale-while-revalidate`,
    )
    return res.status(200).json({ price })
  } catch (err) {
    logger.error('ethusd.page.ts')
    logger.error({ error: err })
    return res.status(500).json({ error: 'failed to fetch price' })
  }
}

export default handler
