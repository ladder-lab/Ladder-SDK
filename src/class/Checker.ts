import { ethers } from "ethers";
import { UniversalErc721__factory, UniversalErc1155__factory } from "../web3/types";
import { ChainNetwork } from "./ChainNetwork";


export class Checker {
    private provider: ethers.providers.JsonRpcProvider

    constructor(network: ChainNetwork) {
        this.provider = network.provider
    }

    // 检查地址是否是 ERC-721 NFT 地址
    async checkIfERC721(address: string) {
        try {
            const erc721Contract = UniversalErc721__factory.connect(address, this.provider)
            const supportsInterface = await erc721Contract.supportsInterface('0x80ac58cd'); // ERC-721 的支持接口方法标识为 0x80ac58cd
            return supportsInterface;
        } catch (error) {
            console.error('Error checking ERC-721:', error);
            return false;
        }
    }

    // 检查地址是否是 ERC-721 NFT 地址
    async checkIfERC1155(address: string) {
        try {
            const erc721Contract = UniversalErc1155__factory.connect(address, this.provider)
            const supportsInterface = await erc721Contract.supportsInterface('0xd9b67a26'); // ERC-721 的支持接口方法标识为 0x80ac58cd
            return supportsInterface;
        } catch (error) {
            console.error('Error checking ERC-1155:', error);
            return false;
        }
    }
}