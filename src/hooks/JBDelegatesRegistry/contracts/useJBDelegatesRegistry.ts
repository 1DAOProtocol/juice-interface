import { readNetwork } from 'constants/networks'
import { Contract } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { ForgeDeploy } from 'models/contracts'
import { useEffect, useState } from 'react'
import JBDelegatesRegistryJson from './IJBDelegatesRegistry.json'

async function loadJBDelegatesRegistryDeployment() {
  const deployment = (await import(
    `@1-dao-protocol/juice-delegates-registry/broadcast/Deploy.s.sol/${readNetwork.chainId}/run-latest.json`
  )) as ForgeDeploy

  return deployment
}

export function useJBDelegatesRegistry(): Contract | undefined {
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    loadJBDelegatesRegistryDeployment().then(deployments => {
      const address = deployments.transactions.find(
        tx => tx.contractName === 'JBDelegatesRegistry',
      )?.contractAddress

      setAddress(address)
    })
  }, [])

  return useLoadContractFromAddress({
    address,
    abi: JBDelegatesRegistryJson.abi,
  })
}