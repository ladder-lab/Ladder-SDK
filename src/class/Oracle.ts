import { ethers } from 'ethers'
import { ChainNetwork } from './ChainNetwork'
import { RouteErc1155Address, RouteErc721Address, SupportChain, USDT } from '../web3'
import { Checker } from './Checker'
import { RouteErc1155__factory, RouteErc721__factory } from '../web3/types'
import { getAddress, keccak256, solidityPack } from 'ethers/lib/utils'

type AssetType = 'Erc20' | 'Erc721' | 'Erc1155' | 'Unknow'

export class Oracle {
  private network: ChainNetwork
  private provider: ethers.providers.JsonRpcProvider

  constructor(network: ChainNetwork) {
    this.network = network
    this.provider = network.provider
  }

  private getHashAddress(token: string, id: number): string {
    return getAddress(`0x${keccak256(solidityPack(['address', 'uint256'], [token, id])).slice(-40)}`)
  }

  private async getAddressType(address: string): Promise<AssetType> {
    const targetChainChecker = new Checker(this.network)
    const nftType = (await targetChainChecker.checkIfERC721(address))
      ? 'Erc721'
      : (await targetChainChecker.checkIfERC1155(address))
      ? 'Erc1155'
      : (await targetChainChecker.checkIfERC20(address))
      ? 'Erc20'
      : 'Unknow'

    return nftType
  }

  async getPrice(
    nftAddress: string,
    amount: number,
    direction: 'Sell' | 'Buy',
    currency: string = USDT[this.network.chain]
  ) {
    /**
     * 1. isNft(nftAddress) 判断是否是 NFT地址 / 721,1155
     * 2. 查询返回价格
     */
    const nftType = await this.getAddressType(nftAddress)
    console.log('🚀 ~ nftType:', nftType)
    const currencyAddress = currency

    if (nftType === 'Erc721') {
      const erc721Route = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.provider)

      const queryMethod = direction === 'Buy' ? erc721Route.getAmountsIn : erc721Route.getAmountsOut
      const route = direction === 'Buy' ? [currencyAddress, nftAddress] : [nftAddress, currencyAddress]
      const price = await queryMethod(amount, route)

      console.log(price[direction === 'Buy' ? 0 : 1].toString())

      return price[direction === 'Buy' ? 0 : 1].toString()
    } else if (nftType === 'Erc1155') {
      const erc1155Route = RouteErc1155__factory.connect(RouteErc1155Address[this.network.chain], this.provider)

      const queryMethod = direction === 'Buy' ? erc1155Route.getAmountsIn : erc1155Route.getAmountsOut
      const route =
        direction === 'Buy'
          ? [currencyAddress, this.getHashAddress(nftAddress, 1)]
          : [this.getHashAddress(nftAddress, 1), currencyAddress]
      const price = await queryMethod(amount, route)

      // console.log(price[direction === 'Buy' ? 0 : 1].toString())

      return price[direction === 'Buy' ? 0 : 1].toString()
    } else {
      throw Error('Invalid NFT address')
    }
  }
}
