# Ladder-sdk-beta

> version: 0.0.5
> 
> Support Chains: Polygon、Sepolia


## Quick Start

Use `npm` or `yarn` to install `Ladder-sdk-beta`

```shell
npm install ladder-sdk-beta
or
yarn add ladder-sdk-beta
```

🔧 This is a sdk tool written in nodejs, fully compliant with the typescript specification.

🧪 This project is still in the experimental stage, any questions welcome feedback.



## Methods

### Oracle

Price oracle program

You can very easily check the real-time price of your sell or buy NFT

```ts
const sepolia = new ChainNetwork(SupportChain.Sepolia)
const oracle = new Oracle(sepolia)
    
const price =  await oracle.getPrice('0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91', 1, 'Sell')
```



### Client

SDK main program

You can do any major operation you want to do with ladder through Client

- swapExactErc721ForTokens
- swapExactTokensForErc721
- addLiquidity721
- addLiquidityETH721
- swapExactErc1155ForTokens (Coming soon)
- swapExactTokensForErc1155 (Coming soon)



```ts
import { ChainNetwork } from "../src/class/ChainNetwork"
import { SupportChain } from "../src/web3"
import { Client, Oracle } from "../src/class"
import { ethers } from "ethers"

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
```



## Tools

### ChainNetwork

Instantiate your EVM chain, in many cases you can get a default network very quickly and you can use it very easily

```ts
const sepolia = new ChainNetwork(SupportChain.Sepolia)
```



### Checker

Project checker that can be used to check certain check judgments in a project, such as checking whether an address belongs to an Erc20 or NFT

```ts
const sepolia = new ChainNetwork(SupportChain.Sepolia)
const sepoliaChecker = new Checker(sepolia) 

const erc20IsErc721 = await sepoliaChecker.checkIfERC721(expErc20Address)
const erc20IsErc1155 = await sepoliaChecker.checkIfERC1155(expErc20Address)
```



### Currency

Quickly get an instance of native Token or ERC20, fully referenced in the Uniswap-sdk design



## License

MIT License

Copyright (c) 2023 ladder-lab
