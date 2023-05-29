import { ethers } from 'ethers'

export class Client {
    private provider: ethers.providers.JsonRpcProvider
    private signer: ethers.Wallet

    constructor(
        signer: ethers.Wallet,
        provider: ethers.providers.JsonRpcProvider
    ) {
        this.signer = signer
        this.provider = provider
    }



    private generatePath(): string[] {
        

        return []
    }

    swapExactErc721ForTokens(
        signer: ethers.Wallet,
        params: {
            amountIn: number,
            amountOutMin: string,
            path: string[2],
            to?: string,
            deadline?: string
        }
    ) {

    }

    swapTokensForExactErc721(
        signer: ethers.Wallet,
        params: {
            amountOut: number,
            amountInMax: string,
            path: string[3],
            to?: string,
            deadline?: string
        }
    ) {
        // https://sepolia.etherscan.io//tx/0x68fb9d40ea96dd41385df3ad32178aabd6034c076925b486429cc1ec29f11922
        /**
         * 1. 检查 tokenIn Approve
         * 2. 发送交易
         */
    }
}