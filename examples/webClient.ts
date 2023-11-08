import { WebClient, ChainNetwork, Oracle, SupportChain } from '../src'
import { ethers } from 'ethers'

// wallet signer
const testClient = async (signer: ethers.Signer | undefined) => {
  const sepolia = new ChainNetwork(SupportChain.Sepolia)
  const oracle = new Oracle(sepolia)
  const client = new WebClient(sepolia, signer)

  const tokenErc20 = '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B'
  const tokenErc721 = '0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91'

  // buy 721
  const amountInMax = await oracle.getPrice(tokenErc721, 1, 'Buy')
  const transaction = await client.swapExactTokensForErc721(1, amountInMax, [tokenErc20, tokenErc721])

  // sell 721
  // const amountOutMin = await oracle.getPrice(tokenErc721, 1, 'Sell')
  // const transaction = await client.swapExactErc721ForTokens(1, amountOutMin, [tokenErc721, tokenErc20])

  console.log(transaction.hash)
  await transaction.wait()
}

// wallet signer
testClient(undefined)
