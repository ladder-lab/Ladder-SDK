import { ethers, Signer } from 'ethers'
import { ChainNetwork } from './ChainNetwork'
import {
  RouteErc1155__factory,
  RouteErc721__factory,
  UniversalErc20__factory,
  UniversalErc721__factory
} from '../web3/types'
import { Checker } from './Checker'
import { RouteErc1155Address, RouteErc721Address } from '../web3'

export class WebClient {
  private network: ChainNetwork
  private provider: ethers.providers.JsonRpcProvider
  private signer?: Signer
  private checker: Checker

  constructor(network: ChainNetwork, signer?: Signer) {
    this.network = network
    this.provider = network.provider
    this.signer = signer
    this.checker = new Checker(network)
  }

  private generatePath(): string[] {
    return []
  }

  async swapExactErc721ForTokens(
    amountIn: number,
    amountOutMin: string,
    path: string[],
    to?: string,
    deadline?: string
  ) {
    const tarErc721Address = path[0]
    const tarErc20Address = path[path.length - 1]
    if (!(await this.checker.checkIfERC721(tarErc721Address))) {
      throw Error(`${tarErc721Address} is an invalid ERC721 NFT`)
    }

    if (!(await this.checker.checkIfERC20(tarErc20Address))) {
      throw Error(`${tarErc20Address} is an invalid ERC20 NFT`)
    }

    if (!this.signer) {
      throw Error(`Signer not found`)
    }

    const accountAddress = await this.signer.getAddress()

    const erc721Contract = UniversalErc721__factory.connect(tarErc721Address, this.provider)
    if (await erc721Contract.isApprovedForAll(this.signer.getAddress(), RouteErc721Address[this.network.chain])) {
      throw Error(`this NFT is not approved to Route`)
    }

    const _to = to || accountAddress
    const _deadline = deadline || Math.floor(Date.now() / 1000) + 60 * 10
    const erc721NFTIDs: string[] = []

    const erc20Route = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.provider)
    const erc20RouteWithSigner = erc20Route.connect(this.signer)
    console.log(amountIn, amountOutMin, path, erc721NFTIDs, _to, _deadline)
    return erc20RouteWithSigner.swapExactTokensForTokens(amountIn, amountOutMin, path, erc721NFTIDs, _to, _deadline)
  }

  async swapExactTokensForErc721(
    amountOut: number,
    amountInMax: string,
    path: string[],
    to?: string,
    deadline?: string
  ) {
    const tarErc20Address = path[0]
    const tarErc721Address = path[path.length - 1]
    if (!(await this.checker.checkIfERC721(tarErc721Address))) {
      throw Error(`${tarErc721Address} is an invalid ERC721 NFT`)
    }

    if (!(await this.checker.checkIfERC20(tarErc20Address))) {
      throw Error(`${tarErc20Address} is an invalid ERC20 NFT`)
    }

    if (!this.signer) {
      throw Error(`Signer not found`)
    }

    const accountAddress = await this.signer.getAddress()

    const erc20Contract = UniversalErc20__factory.connect(tarErc20Address, this.provider)
    const ret = await erc20Contract.allowance(accountAddress, RouteErc721Address[this.network.chain])
    console.log('fdasfdsa', ret, amountInMax)
    if ((await erc20Contract.allowance(accountAddress, RouteErc721Address[this.network.chain])).lte(amountInMax)) {
      throw Error(`Token allowance limit is not enough for Route`)
    }

    const _to = to || accountAddress
    const _deadline = deadline || Math.floor(Date.now() / 1000) + 60 * 10
    const erc721NFTIDs: string[] = []

    const erc20Route = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.signer)
    const erc20RouteWithSigner = erc20Route.connect(this.signer)

    console.log(amountOut, amountInMax, path, erc721NFTIDs, _to, _deadline)
    return erc20RouteWithSigner.swapTokensForExactTokens(amountOut, amountInMax, path, erc721NFTIDs, _to, _deadline)
  }

  async addLiquidity721(params: {
    token721: string
    nftIds: number[]
    tokenB: `0x${string}`
    amountBDesired: string
    amountBMin: string
  }) {
    if (!this.signer) {
      throw Error(`Signer not found`)
    }

    const accountAddress = await this.signer.getAddress()

    const { token721, nftIds, tokenB, amountBDesired, amountBMin } = params
    const erc721RouteWithSigner = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.signer)

    return erc721RouteWithSigner.addLiquidity721(
      token721,
      nftIds,
      tokenB,
      amountBDesired,
      amountBMin,
      accountAddress,
      Math.floor(Date.now() / 1000 + 3600)
    )
  }

  async addLiquidityETH721(params: { token721: string; nftIds: number[]; amountETHMin: string }) {
    if (!this.signer) {
      throw Error(`Signer not found`)
    }

    const accountAddress = await this.signer.getAddress()

    const { token721, nftIds, amountETHMin } = params
    const erc721RouteWithSigner = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.signer)

    return erc721RouteWithSigner.addLiquidityETH721(
      token721,
      nftIds,
      nftIds.length,
      amountETHMin,
      accountAddress,
      Math.floor(Date.now() / 1000 + 3600),
      { value: amountETHMin }
    )
  }

  async addLiquidity1155(params: {
    token1155: string
    token1155Id: number
    tokenB: `0x${string}`
    amountADesired: string
    amountBDesired: string
    amountAMin: string
    amountBMin: string
  }) {
    console.log('🚀 ~ params:', params)

    // const erc20Route = RouteErc1155__factory.connect(RouteErc1155Address[this.network.chain], this.provider)
    // const erc20RouteWithSigner = erc20Route.connect(this.signer)

    // erc20RouteWithSigner.addLiquidity1155()
  }
}
