import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import TooltipLabel from 'components/TooltipLabel'
import { CurrencyName } from 'constants/currency'
import { formatWad } from 'utils/format/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export default function SpendingStats({
  currency,
  targetAmount,
  distributedAmount,
  distributableAmount,
  feePercentage,
  hasFundingTarget,
}: {
  currency: CurrencyName | undefined
  targetAmount: BigNumber
  distributedAmount: BigNumber
  distributableAmount: BigNumber | undefined
  ownerAddress: string | undefined
  feePercentage: string | undefined
  hasFundingTarget: boolean | undefined
}) {
  const formattedDistributionLimit = !targetAmount.eq(MAX_DISTRIBUTION_LIMIT)
    ? formatWad(targetAmount, { precision: 4 })
    : t`NO LIMIT`

  return (
    <div>
      <div className="mb-1">
        <Tooltip
          title={
            currency === 'ETH' && distributableAmount?.gt(0) ? (
              <ETHToUSD ethAmount={distributableAmount} />
            ) : undefined
          }
        >
          <span className="text-primary font-medium">
            <CurrencySymbol currency={currency} />
            {formatWad(distributableAmount, { precision: 4 }) || '0'}{' '}
          </span>
        </Tooltip>
        <TooltipLabel
          className="cursor-default text-xs font-medium text-grey-500 dark:text-slate-100"
          label={<Trans>AVAILABLE</Trans>}
          tip={
            <Trans>
              Funds available to distribute in this funding cycle (before the{' '}
              {feePercentage}% JBX fee). This amount won't roll over to the next
              funding cycle, so funds should be distributed before this funding
              cycle ends.
            </Trans>
          }
        />
      </div>

      <div className="cursor-default text-xs font-medium text-grey-500 dark:text-slate-100">
        <Trans>
          <CurrencySymbol currency={currency} />
          {formatWad(distributedAmount, { precision: 4 }) || '0'}
          {hasFundingTarget ? (
            <span>/{formattedDistributionLimit} </span>
          ) : null}{' '}
          distributed
        </Trans>
      </div>
    </div>
  )
}
