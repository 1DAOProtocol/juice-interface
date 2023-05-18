import {
  JB721DELAGATE_V3_1_PAY_METADATA,
  JB721DELAGATE_V3_PAY_METADATA,
} from 'components/Project/PayProjectForm/hooks/usePayProjectForm'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
} from 'constants/delegateVersions'
import { DEFAULT_ALLOW_OVERSPENDING } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'
import {
  encodeJB721DelegateV3PayMetadata,
  encodeJB721DelegateV3_1PayMetadata,
} from 'utils/nftRewards'

export function useDelegateMetadata() {
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const { form: payProjectForm } = useContext(PayProjectFormContext)

  return JB721DelegateVersion === JB721_DELEGATE_V3
    ? encodeJB721DelegateV3PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V3_PAY_METADATA),
      })
    : JB721DelegateVersion === JB721_DELEGATE_V3_1 ||
      JB721DelegateVersion === JB721_DELEGATE_V3_2
    ? encodeJB721DelegateV3_1PayMetadata({
        ...(payProjectForm?.payMetadata as JB721DELAGATE_V3_1_PAY_METADATA),
        allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
      })
    : undefined
}
