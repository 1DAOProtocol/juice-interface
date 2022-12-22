import { t } from '@lingui/macro'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { getUnsafeV2V3FundingCycleProperties } from 'utils/v2v3/fundingCycle'
import {
  HOLD_FEES_EXPLAINATION,
  OWNER_MINTING_EXPLAINATION,
  RECONFIG_RULES_EXPLAINATION,
  TERMINAL_CONFIG_EXPLAINATION,
} from '../../settingExplanations'
import { FundingCycleListItem } from '../FundingCycleListItem'
import { AllowMintingValue } from './AllowMintingValue'
import { AllowSetTerminalsValue } from './AllowSetTerminalsValue'
import { HoldFeesValue } from './HoldFeesValue'
import { PausePayValue } from './PausePayValue'
import { ReconfigStratValue } from './ReconfigStratValue'

export function RulesListItems({
  fundingCycle,
  fundingCycleMetadata,
  showDiffs,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
  showDiffs?: boolean
}) {
  const {
    fundingCycle: oldFundingCycle,
    fundingCycleMetadata: oldFundingCycleMetadata,
  } = useContext(V2V3ProjectContext)

  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)
  const oldBallotStrategy = oldFundingCycle
    ? getBallotStrategyByAddress(oldFundingCycle.ballot)
    : undefined

  const ballotWarningText = unsafeFundingCycleProperties.noBallot
    ? riskWarningText.noBallot
    : unsafeFundingCycleProperties.customBallot
    ? riskWarningText.customBallot
    : undefined

  const pausePayHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.pausePay !== fundingCycleMetadata.pausePay
  const allowMintingHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.allowMinting !== fundingCycleMetadata.allowMinting
  const allowSetTerminalsHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.global.allowSetTerminals !==
      fundingCycleMetadata.global.allowSetTerminals
  const ballotHasDiff =
    oldFundingCycle && oldFundingCycle.ballot !== fundingCycle.ballot
  const holdFeesHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.holdFees !== fundingCycleMetadata.holdFees

  return (
    <>
      <FundingCycleListItem
        name={t`Payments`}
        value={<PausePayValue pausePay={fundingCycleMetadata.pausePay} />}
        oldValue={
          showDiffs && pausePayHasDiff ? (
            <PausePayValue pausePay={oldFundingCycleMetadata.pausePay} />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Owner token minting`}
        value={
          <AllowMintingValue allowMinting={fundingCycleMetadata.allowMinting} />
        }
        oldValue={
          showDiffs && allowMintingHasDiff ? (
            <AllowMintingValue
              allowMinting={oldFundingCycleMetadata.allowMinting}
            />
          ) : undefined
        }
        helperText={OWNER_MINTING_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Terminal configuration`}
        value={
          <AllowSetTerminalsValue
            allowSetTerminals={fundingCycleMetadata?.global.allowSetTerminals}
          />
        }
        oldValue={
          showDiffs && allowSetTerminalsHasDiff ? (
            <AllowSetTerminalsValue
              allowSetTerminals={
                oldFundingCycleMetadata?.global.allowSetTerminals
              }
            />
          ) : undefined
        }
        helperText={TERMINAL_CONFIG_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Reconfiguration strategy`}
        value={
          <ReconfigStratValue
            ballotStrategy={ballotStrategy}
            warningText={ballotWarningText}
          />
        }
        oldValue={
          showDiffs && oldBallotStrategy && ballotHasDiff ? (
            <ReconfigStratValue
              ballotStrategy={oldBallotStrategy}
              warningText={undefined}
            />
          ) : undefined
        }
        helperText={RECONFIG_RULES_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Hold fees`}
        value={<HoldFeesValue holdFees={fundingCycleMetadata.holdFees} />}
        oldValue={
          showDiffs && holdFeesHasDiff ? (
            <HoldFeesValue holdFees={oldFundingCycleMetadata.holdFees} />
          ) : undefined
        }
        helperText={HOLD_FEES_EXPLAINATION}
      />
    </>
  )
}