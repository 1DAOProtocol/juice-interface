import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import { getLatestNftDelegateStoreContractAddress } from 'utils/nftRewards'

export const loadJBTiered721DelegateStoreContract = async () => {
  if (!featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)) return

  const JBTiered721DelegateStoreContractAddress =
    await getLatestNftDelegateStoreContractAddress()

  const nftDeployerContractJson = {
    address: JBTiered721DelegateStoreContractAddress,
    abi: (
      await import(
        `@jbx-protocol/juice-nft-rewards/out/IJBTiered721DelegateStore.sol/IJBTiered721DelegateStore.json`
      )
    ).abi,
  }

  return nftDeployerContractJson
}