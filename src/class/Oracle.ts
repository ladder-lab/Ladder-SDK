import { ethers } from "ethers";
import { ChainNetwork } from "./ChainNetwork";
import { RouteErc1155Address, RouteErc721Address, SupportChain } from "../web3";
import { Checker } from "./Checker";
import { RouteErc1155__factory, RouteErc721__factory } from "../web3/types";
import { getAddress, keccak256, solidityPack } from "ethers/lib/utils";

type AssetType = 'Erc721' | 'Erc1155' | 'Unknow'

export class Oracle {
    private network: ChainNetwork
    private provider: ethers.providers.JsonRpcProvider
    // const sepolia = new ChainNetwork(SupportChain.Sepolia)
    // const sepoliaChecker = new Checker(sepolia.provider)

    constructor(network: ChainNetwork) {
        this.network = network
        this.provider = network.provider
    }

    private getHashAddress(token: string, id: number): string {
        return getAddress(`0x${keccak256(solidityPack(['address', 'uint256'], [token, id])).slice(-40)}`)
    }

    private async getAddressType(address: string): Promise<AssetType> {
        const targetChainChecker = new Checker(this.network)
        const nftType = await targetChainChecker.checkIfERC721(address) ? 'Erc721' :
            await targetChainChecker.checkIfERC1155(address) ? 'Erc1155' : 'Unknow';

        return nftType
    }

    async getPrice(nftAddress: string, amount: number, direction: 'Sell' | 'Buy') {
        /**
         * 1. isNft(nftAddress) 判断是否是 NFT地址 / 721,1155
         * 2. 查询返回价格
         */
        const nftType = await this.getAddressType(nftAddress)

        if (nftType === 'Erc721') {
            const erc721Route = RouteErc721__factory.connect(RouteErc721Address[SupportChain.Sepolia], this.provider)
            const price = await erc721Route.getAmountsOut(amount, [
                nftAddress,
                '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B'
            ])

            console.log(price[1].toString())
        } else if (nftType === 'Erc1155') {
            const erc1155Route = RouteErc1155__factory.connect(RouteErc1155Address[SupportChain.Sepolia], this.provider)
            const price = await erc1155Route.getAmountsOut(amount, [
                this.getHashAddress(nftAddress, 1),
                '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B'
            ])

            console.log(price[1].toString())
        } else if (nftType === 'Unknow') {
            throw Error('Invalid NFT address')
        }
    }
}