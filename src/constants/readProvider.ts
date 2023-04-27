import { JsonRpcBatchProvider } from '@ethersproject/providers'
import { NETWORKS, readNetwork } from './networks'

export const readProvider = new JsonRpcBatchProvider(readNetwork.rpcUrl)
export const ensReadProvider = new JsonRpcBatchProvider(NETWORKS[5].rpcUrl)
