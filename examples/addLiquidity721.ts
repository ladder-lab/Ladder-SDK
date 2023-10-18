import { Wallet } from "ethers"
import { ChainNetwork, Client, CurrencyErc20, CurrencyErc721, Oracle } from "../src/class"
import { bn_parseWei, bn_wrapperBn } from "../src/utils"
import { RouteErc721Address, SupportChain } from "../src/web3"

const tUSDC_V2 = '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B'
const Genso_NFT_V2 = '0xf904B6C5aBa72dD44fBc840Be139c100F291d5FA'

const sepolia = new ChainNetwork(SupportChain.Sepolia)

const addLiquidity721 = async () => {
    const oracle = new Oracle(sepolia)
    const sellPrice = await oracle.getPrice(Genso_NFT_V2, 1, 'Sell')
    console.log("🚀 ~ sellPrice:", sellPrice)
    const buyPrice = await oracle.getPrice(Genso_NFT_V2, 1, 'Buy')
    console.log("🚀 ~ buyPrice:", buyPrice)
    const middlePrice = bn_wrapperBn(sellPrice).plus(buyPrice).div(2).toString()
    console.log("🚀 ~ middlePrice:", middlePrice)

    const signer = new Wallet('xxx', sepolia.provider)
    const client = new Client(signer, sepolia)

    const token_Genso_NFT_V2 = new CurrencyErc721(sepolia, Genso_NFT_V2)
    const token721Contract = token_Genso_NFT_V2.contract.connect(signer)
    // console.log("🚀 ~ token721Contract:", token721Contract)
    console.log(RouteErc721Address[SupportChain.Sepolia])
    const token721HasAllowance = await token721Contract.isApprovedForAll(signer.address, RouteErc721Address[SupportChain.Sepolia])
    console.log("🚀 ~ token721HasAllowance:", token721HasAllowance)
    if (!token721HasAllowance) {
        const approve721Transaction = await token721Contract.setApprovalForAll(RouteErc721Address[SupportChain.Sepolia], true)
        console.log('approve721Transaction hash is ' + approve721Transaction.hash)
        await approve721Transaction.wait()
    }

    const token_tUSDC_V2 = new CurrencyErc20(sepolia, tUSDC_V2)
    const token20Contract = token_tUSDC_V2.contract.connect(signer)
    const token20Allowance = await token20Contract.allowance(signer.address, RouteErc721Address[SupportChain.Sepolia])
    console.log("🚀 ~ token20Allowance:", token20Allowance)
    if (bn_wrapperBn(token20Allowance).lt(buyPrice)) {
        const approve20Transaction = await token20Contract.approve(RouteErc721Address[SupportChain.Sepolia], bn_parseWei(9999999999).toString())
        console.log('approve20Transaction hash is ' + approve20Transaction.hash)
        await approve20Transaction.wait()
    }

    const addLiquidity721Transaction = await client.addLiquidity721({
        token721: Genso_NFT_V2,
        nftIds: [5000],
        tokenB: tUSDC_V2,
        amountBDesired: buyPrice,
        amountBMin: sellPrice
    })
    console.log('addLiquidity721Transaction hash is ' + addLiquidity721Transaction.hash)
    addLiquidity721Transaction.wait()
}

addLiquidity721()