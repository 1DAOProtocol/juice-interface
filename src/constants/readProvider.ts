import { providers } from 'ethers'
import { NETWORKS, readNetwork } from './networks'

export const readProvider = new providers.JsonRpcBatchProvider(
  readNetwork.rpcUrl,
)
export const ensReadProvider = new providers.JsonRpcBatchProvider(
  NETWORKS[5].rpcUrl,
)
