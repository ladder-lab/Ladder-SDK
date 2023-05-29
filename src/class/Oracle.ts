import { ethers } from "ethers";

export class Oracle {
    private provider: ethers.providers.JsonRpcProvider

    constructor(provider: ethers.providers.JsonRpcProvider) {
        this.provider = provider
    }

    private isNft(address: string): boolean{
        // TODO 判断一个地址是否是 NFT

        return true
    }

    getPrice(nftAddress: string, amount: number, direction: 'Sell' | 'Buy') {
        /**
         * 1. isNft(nftAddress) 判断是否是 NFT地址
         * 2. 查询返回价格
         */
    }
}