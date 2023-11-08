import { ChainNetwork } from '../src/class/ChainNetwork'
import { SupportChain } from '../src/web3'
import { Client, Oracle } from '../src/class'
import { ethers } from 'ethers'

const testClient = async () => {
  const sepolia = new ChainNetwork(SupportChain.Sepolia)
  const signer = new ethers.Wallet('xxx')
  const oracle = new Oracle(sepolia)
  const client = new Client(signer, sepolia)

  const tokenErc20 = '0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B'
  const tokenErc721 = '0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91'

  // const amountInMax = await oracle.getPrice(tokenErc721, 1, 'Buy')
  // const transaction = await client.swapExactTokensForErc721(1, amountInMax, [tokenErc20, tokenErc721])

  const amountOutMin = await oracle.getPrice(tokenErc721, 1, 'Sell')
  const transaction = await client.swapExactErc721ForTokens(1, amountOutMin, [tokenErc721, tokenErc20])

  console.log(transaction.hash)
  await transaction.wait()
}

testClient()
