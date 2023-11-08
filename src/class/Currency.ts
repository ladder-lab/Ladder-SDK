import { ContractTransaction, Wallet, ethers } from 'ethers'
import { SupportChainType } from '../web3'
import {
  Multicall__factory,
  UniversalErc20,
  UniversalErc20__factory,
  UniversalErc721,
  UniversalErc721__factory
} from '../web3/types'
import { ChainNetwork } from './ChainNetwork'
import invariant from 'tiny-invariant'
import { bn_fromWei } from '../utils'
import { ZERO_ADDRESS } from '../constants'

type CurrencyType = 'Native' | 'Erc20' | 'Erc721'
class CurrencyBase {
  protected provider: ethers.providers.Provider
  readonly chainNetwork: ChainNetwork
  readonly chain: SupportChainType | 'OtherChain'
  readonly type: CurrencyType

  readonly address: string
  public name: string | undefined
  public symbol: string | undefined
  public decimals: number | undefined

  constructor(
    chainNetwork: ChainNetwork,
    type: CurrencyType,
    address: string,
    decimals?: number,
    symbol?: string,
    name?: string
  ) {
    this.provider = chainNetwork.provider
    this.chainNetwork = chainNetwork
    this.chain = chainNetwork.chain
    this.type = type
    this.address = address
    this.decimals = decimals
    this.symbol = symbol
    this.name = name || 'Unknow Token'
  }

  public equals(other: CurrencyErc20): boolean {
    return this.chain === other.chain && this.address.toLowerCase() === other.address.toLowerCase()
  }
}

export class CurrencyNative extends CurrencyBase {
  constructor(chainNetwork: ChainNetwork) {
    const name = chainNetwork.state.nativeCurrency.name
    const symbol = chainNetwork.state.nativeCurrency.symbol
    const decimals = chainNetwork.state.nativeCurrency.decimals
    super(chainNetwork, 'Native', ZERO_ADDRESS, decimals, symbol, name)
  }
}

export class CurrencyErc20 extends CurrencyBase {
  public contract: UniversalErc20

  constructor(chainNetwork: ChainNetwork, address: string, decimals?: number, symbol?: string, name?: string) {
    super(chainNetwork, 'Erc20', address, decimals, symbol, name)
    this.contract = UniversalErc20__factory.connect(address, this.provider)
  }

  async initialize(): Promise<this> {
    this.symbol = this.symbol || (await this.contract.symbol())
    this.decimals = this.decimals || (await this.contract.decimals())
    this.name = this.name || (await this.contract.name())
    return this
  }
}

export class CurrencyErc721 extends CurrencyBase {
  public contract: UniversalErc721

  constructor(chainNetwork: ChainNetwork, address: string, symbol?: string, name?: string) {
    super(chainNetwork, 'Erc721', address, 1, symbol, name)
    this.contract = UniversalErc721__factory.connect(address, this.provider)
  }

  async initialize(): Promise<this> {
    this.name = this.name || (await this.contract.name())
    this.symbol = this.symbol || (await this.contract.symbol())
    return this
  }
}
