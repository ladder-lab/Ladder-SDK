import { ethers } from 'ethers'
import { ChainNetwork } from './ChainNetwork'
import { RouteErc721__factory, UniversalErc20__factory, UniversalErc721__factory } from '../web3/types'
import { Checker } from './Checker'
import { RouteErc721Address } from '../web3'

export class Client {
    private network: ChainNetwork
    private provider: ethers.providers.JsonRpcProvider
    private signer: ethers.Wallet
    private checker: Checker

    constructor(
        signer: ethers.Wallet,
        network: ChainNetwork
    ) {
        this.network = network
        this.provider = network.provider
        this.signer = signer.connect(network.provider)

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
        if (!await this.checker.checkIfERC721(tarErc721Address)) {
            throw Error(`${tarErc721Address} is an invalid ERC721 NFT`)
        }

        if (!await this.checker.checkIfERC20(tarErc20Address)) {
            throw Error(`${tarErc20Address} is an invalid ERC20 NFT`)
        }

        const erc721Contract = UniversalErc721__factory.connect(tarErc721Address, this.provider)
        if (await erc721Contract.isApprovedForAll(this.signer.address, RouteErc721Address[this.network.chain])) {
            throw Error(`this NFT is not approved to Route`)
        }

        const _to = to || this.signer.address
        const _deadline = deadline || Math.floor(Date.now() / 1000) + 60 * 10
        const erc721NFTIDs: string[] = []

        const erc20Route = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.provider)
        const erc20RouteWithSigner = erc20Route.connect(this.signer)
        console.log(amountIn, amountOutMin, path, erc721NFTIDs, _to, _deadline)
        return erc20RouteWithSigner.swapExactTokensForTokens(
            amountIn, amountOutMin, path, erc721NFTIDs, _to, _deadline
        )
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
        if (!await this.checker.checkIfERC721(tarErc721Address)) {
            throw Error(`${tarErc721Address} is an invalid ERC721 NFT`)
        }

        if (!await this.checker.checkIfERC20(tarErc20Address)) {
            throw Error(`${tarErc20Address} is an invalid ERC20 NFT`)
        }


        const erc20Contract = UniversalErc20__factory.connect(tarErc20Address, this.provider)
        if ((await erc20Contract.allowance(this.signer.address, RouteErc721Address[this.network.chain])).lte(amountInMax)) {
            throw Error(`Token allowance limit is not enough for Route`)
        }


        const _to = to || this.signer.address
        const _deadline = deadline || Math.floor(Date.now() / 1000) + 60 * 10
        const erc721NFTIDs: string[] = []

        const erc20Route = RouteErc721__factory.connect(RouteErc721Address[this.network.chain], this.provider)
        const erc20RouteWithSigner = erc20Route.connect(this.signer)
        console.log(amountOut, amountInMax, path, erc721NFTIDs, _to, _deadline)
        return erc20RouteWithSigner.swapTokensForExactTokens(
            amountOut, amountInMax, path, erc721NFTIDs, _to, _deadline
        )
    }
}