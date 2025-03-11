import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from '@mysten/sui/transactions';

import {
    LENDING_MARKET_ID,
    LENDING_MARKET_TYPE,
    Side,
    SuilendClient,
    getFilteredRewards,
    getStakingYieldAprPercent,
    getTotalAprPercent,
    initializeSuilend,
    initializeSuilendRewards,
    createObligationIfNoneExists,
    sendObligationToUser
} from "@suilend/sdk";

const suiClient = new SuiClient({
    url: "https://fullnode.mainnet.sui.io:443",
});

export const deposit = async (privateKey: string, coinType: string, amount: string) => {
    const keyPair = Ed25519Keypair.fromSecretKey(privateKey);
    const suilendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient,
    );
    const {
        lendingMarket,
        reserveMap,
        reserveCoinTypes,
        rewardCoinTypes,
        rewardCoinMetadataMap,
        coinMetadataMap,
        obligationOwnerCaps,
        obligations,
    } = await initializeSuilend(suiClient, suilendClient, keyPair.toSuiAddress());
    
    const obligationOwnerCap = obligationOwnerCaps?.find(e => e.obligationId == obligations?.[0].id);
    const transaction = new Transaction();

    try {
        const { obligationOwnerCapId, didCreate } = createObligationIfNoneExists(
            suilendClient,
            transaction,
            obligationOwnerCap,
        );
        console.log('obligationOwnerCapId:', obligationOwnerCapId);
        console.log('didCreate:', didCreate);
        
        await suilendClient.depositIntoObligation(
            keyPair.toSuiAddress(),
            coinType,
            amount,
            transaction,
            obligationOwnerCapId,
        );
        
        if (didCreate) {
            sendObligationToUser(obligationOwnerCapId, keyPair.toSuiAddress(), transaction);
        }
        
        // Set much higher gas budget (1 SUI = 1,000,000,000 MIST)
        transaction.setGasBudget(1000000000);
        
        const res = await suiClient.signAndExecuteTransaction({
            transaction: transaction,
            signer: keyPair,
            options: {
                showBalanceChanges: true
            }
        });
        console.log('Balance changes:', res.balanceChanges);
        return res;
    } catch (err) {
        console.error('Deposit error:', err);
        throw err;
    }
};

type UserAssets = Array<{ coinType: string, amount: string }>;

export const loadAssetsFromSuilend = async (privateKey: string): Promise<{ userAssets: UserAssets, obligationOwnerCap: string, obligation: string }> => {
    let userAssets: UserAssets = [];
    const keyPair = Ed25519Keypair.fromSecretKey(privateKey);
    const suilendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient,
    );
    
    const {
        obligations,
        obligationOwnerCaps,
    } = await initializeSuilend(suiClient, suilendClient, keyPair.toSuiAddress());
    
    const obligation = obligations?.[0];
    if (!obligation || !obligationOwnerCaps?.length) {
        throw new Error("Obligation not found");
    }
    
    const obligationOwnerCap = obligationOwnerCaps.find(e => e.obligationId === obligation.id);
    if (!obligationOwnerCap) {
        throw new Error("Obligation owner cap not found");
    }
    
    obligation.deposits.forEach(e => {
        console.log(`coinType: ${e.coinType}: amount: ${e.depositedCtokenAmount} ($ ${e.depositedAmountUsd})`);
        userAssets.push({ 
            amount: e.depositedCtokenAmount.toString(), 
            coinType: e.coinType 
        });
    });
    
    return {
        userAssets,
        obligation: obligation.id,
        obligationOwnerCap: obligationOwnerCap.id
    };
};

export const withdraw = async (
    privateKey: string, 
    userAssets: UserAssets, 
    enterUserAsset: string, 
    enterUserAmount: string, 
    obligation: string, 
    obligationOwnerCap: string
) => {
    const keyPair = Ed25519Keypair.fromSecretKey(privateKey);
    const suilendClient = await SuilendClient.initialize(
        LENDING_MARKET_ID,
        LENDING_MARKET_TYPE,
        suiClient,
    );
    
    const transaction = new Transaction();
    await suilendClient.withdrawAndSendToUser(
        keyPair.toSuiAddress(),
        obligationOwnerCap,
        obligation,
        enterUserAsset,
        enterUserAmount,
        transaction,
    );
    
    // Set much higher gas budget for withdrawals too
    transaction.setGasBudget(1000000000);
    const res = await suiClient.signAndExecuteTransaction({
        transaction: transaction,
        signer: keyPair,
        options: {
            showBalanceChanges: true
        }
    });
    return res;
};
