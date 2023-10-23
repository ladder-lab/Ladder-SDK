import { SupportChain } from "./type"

export const RouteErc721Address: Record<string, string> = {
    [SupportChain.Sepolia]: "0x146ADA3E3A615CAdEBC06C1b02cBE3D040DcC3A0",
    [SupportChain.Polygon]: "0xf434274C78CF5567D47D765420CDbf552d1C1067",
    [SupportChain.Binance]: "0xb59a8c714515793bDB6Ae7614499ee33b2F2802d"
}

export const RouteErc1155Address: Record<string, string> = {
    [SupportChain.Sepolia]: "0x6e2c879382520c7B15927902eEf1c0FbC1F8de91",
    [SupportChain.Polygon]: "0x3c36a8F43c583c3b4d54E3170cCE7D04EfD41a49"
}

export const USDT: Record<string, string> = {
    [SupportChain.Sepolia]: "0x85eDB7A0cbAcf5BD641e0FF5D6270bEf9C72Bd6B",
    [SupportChain.Polygon]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    [SupportChain.Binance]: "0x55d398326f99059fF775485246999027B3197955"
}