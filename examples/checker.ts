import { SupportChain } from '../src/web3'
import { Checker } from '../src/class/Checker'
import { ChainNetwork } from '../src/class/ChainNetwork'

const checkerExample = async () => {
    const sepolia = new ChainNetwork(SupportChain.Sepolia)
    const sepoliaChecker = new Checker(sepolia)

    const expErc20Address = '0x85edb7a0cbacf5bd641e0ff5d6270bef9c72bd6b'
    const expErc721Address = '0xdCF53E67375DaD97A273f0Ae49E5EBf2fEf44D91'
    const expErc1155Address = '0xe31fc5cfe8618f599cf50b954e46cdad82e9fe01'

    const erc20IsErc721 = await sepoliaChecker.checkIfERC721(expErc20Address)
    const erc20IsErc1155 = await sepoliaChecker.checkIfERC1155(expErc20Address)
    console.log('erc20IsErc721', erc20IsErc721)
    console.log('erc20IsErc1155', erc20IsErc1155)

    const erc721IsErc721 = await sepoliaChecker.checkIfERC721(expErc721Address)
    const erc721IsErc1155 = await sepoliaChecker.checkIfERC1155(expErc721Address)
    console.log('erc721IsErc721', erc721IsErc721)
    console.log('erc721IsErc1155', erc721IsErc1155)

    const erc1155IsErc721 = await sepoliaChecker.checkIfERC721(expErc1155Address)
    const erc1155IsErc1155 = await sepoliaChecker.checkIfERC1155(expErc1155Address)

    console.log('erc1155IsErc721', erc1155IsErc721)
    console.log('erc1155IsErc1155', erc1155IsErc1155)
}

checkerExample()

/**
 * $ ts-node ./examples
    erc20IsErc721 false
    erc20IsErc1155 false
    erc721IsErc721 true
    erc721IsErc1155 false
    erc1155IsErc721 false
    erc1155IsErc1155 true
 */