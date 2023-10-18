import { ChainNetwork } from "../src/class/ChainNetwork"
import { Oracle } from "../src/class/Oracle"
import { SupportChain } from "../src/web3"

const oracleExample = async () => {
    const sepolia = new ChainNetwork(SupportChain.Polygon)
    const oracle = new Oracle(sepolia)

    // const expErc20Address = '0x85edb7a0cbacf5bd641e0ff5d6270bef9c72bd6b'
    // const expErc721Address = '0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91'
    // const expErc1155Address = '0xe31fc5cfe8618f599cf50b954e46cdad82e9fe01'
    
    // const expErc20Address = '0x670fd103b1a08628e9557cD66B87DeD841115190'
    const expErc721Address = '0x2D1A88E87df5282BCcF43D26F4ff0601e33011F2'
    

    // try {
    //     await oracle.getPrice(expErc20Address, 1, 'Sell')
    // } catch (error) {
    //     console.log(error)
    // }

    try {
        await oracle.getPrice(expErc721Address, 1, 'Sell')
    } catch (error) {
        console.log(error)
    }

    // try {
    //     await oracle.getPrice(expErc1155Address, 1, 'Sell')
    // } catch (error) {
    //     console.log(error)
    // }
}

oracleExample()