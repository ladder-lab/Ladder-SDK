import { ethers } from 'ethers'
import { ChainStateInterface, SupportChain, chainStateList } from '../web3'

import invariant from 'tiny-invariant'

export class ChainNetwork {
  public provider: ethers.providers.JsonRpcProvider
  public readonly state: ChainStateInterface
  public readonly chain: SupportChain | 'OtherChain'
  public readonly chainId: number
  public readonly multicallAddr?: string

  constructor(chain: SupportChain) {
    this.chain = chain
    this.state = chainStateList[chain]
    this.provider = new ethers.providers.JsonRpcProvider(this.state.rpcUrls[0])
    this.chainId = this.state.chainId
  }

  updateProviderRpc(rpc: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpc)
  }
}
