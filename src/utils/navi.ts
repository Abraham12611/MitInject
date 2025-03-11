import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient } from "@mysten/sui/client";
import { NAVISDKClient } from 'navi-sdk'
import { Sui, USDT, WETH, vSui, haSui, CETUS, NAVX, WBTC, AUSD, wUSDC, nUSDC, ETH, USDY, NS, LorenzoBTC, DEEP, FDUSD, BLUE, BUCK, suiUSDT, stSUI, suiBTC, } from 'navi-sdk'


type UserAssets = Array<{ coinType: string, amount: string }>


const suiClient = new SuiClient({
    url: "https://fullnode.mainnet.sui.io:443",
});

const supportWithNavi = [
    Sui, USDT, WETH, vSui, haSui, CETUS, NAVX, WBTC, AUSD, wUSDC, nUSDC, ETH, USDY, NS, LorenzoBTC, DEEP, FDUSD, BLUE, BUCK, suiUSDT, stSUI, suiBTC
]

// first need loading user assets from sui network.
export const LoadingUserAssetsFromSuiNetwork = async (privateKey: string): Promise<{ userAssets: Array<{ coinType: string, amount: string }> }> => {
    let userAssets: Array<{ coinType: string, amount: string }> = []
    const keyPair = Ed25519Keypair.fromSecretKey(privateKey)
    const assets = await suiClient.getAllBalances({ owner: keyPair.toSuiAddress() })
    console.log('\n🪙 Loading your assets from Suinetwork...\n');
    assets.forEach(e => {
        if (supportWithNavi.find(_e => _e.address === e.coinType)) {
            console.log(`${e.coinType}: ${e.totalBalance}`);
            userAssets.push({
                coinType: e.coinType,
                amount: e.totalBalance
            })
        }
    })
    return {
        userAssets
    }
}

export const depositToNavi = async (privateKey: string, coinType: string, coinAmount: string) => {
    try {
        const client = new NAVISDKClient({
            networkType: "mainnet",
            numberOfAccounts: 1,
            privateKeyList: [privateKey]
        });
        const account = client.accounts[0]
        const Coin = supportWithNavi.find(e => e.address === coinType)
        if (!Coin) throw new Error(`You enter coinType is not support with Navi !`);
        else {
            await account.depositToNavi(Coin, Number(coinAmount))
        }
    } catch (error) {
        console.log(error as string);
        return 0
    }
}

// before withdraw from Navi need load assets from Navi.
export const loadAssetsFromNavi = async (privateKey: string): Promise<{ userAssets: UserAssets }> => {
    let userAssets: UserAssets = []
    const client = new NAVISDKClient({
        networkType: "mainnet",
        numberOfAccounts: 1,
        privateKeyList: [privateKey]
    });
    const account = client.accounts[0]
    const res = await account.getNAVIPortfolio()
    res.forEach((item, key) => {
        userAssets.push({
            coinType: supportWithNavi.find(e => e.symbol.toUpperCase() === key.toUpperCase())?.address ?? "Unknow asset",
            amount: item.supplyBalance.toFixed()
        })
    })
    return {
        userAssets
    }
}

export const withdrawFromNavi = async (privateKey: string, userAssets: UserAssets, enterUserAsset: string, enterUserAmount: string) => {
    const userAssetsList = userAssets.map(e => e.coinType)
    if (userAssetsList.includes(enterUserAsset)) {
        const client = new NAVISDKClient({
            networkType: "mainnet",
            numberOfAccounts: 1,
            privateKeyList: [privateKey]
        });
        const account = client.accounts[0]
        const Coin = supportWithNavi.find(e => e.address === enterUserAsset)
        if (Coin && Coin === Sui) {
            // Be sure Navi withdraw success need keep some token in Navi. (for sui need keep 1e6)
            await account.withdraw(Coin, Math.round(Number(enterUserAmount)) - 1e6)
        } else if (Coin) {
            // Be sure Navi withdraw success need keep some token in Navi.(for other coins need keep 2e2)
            await account.withdraw(Coin, Math.round(Number(enterUserAmount)) - 2e2)
        } else {
            throw new Error(`You don't have this assets in Navi: ${enterUserAsset}`);
        }
    } else {
        throw new Error(`You don't have this assets in Navi: ${enterUserAsset}`);
    }
}
