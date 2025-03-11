import { ProofRequest, ProofResponse } from "./types";

let client: any;

async function initClient() {
  const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
  client = new SuiClient({ url: getFullnodeUrl('devnet') });
}

export async function getExtendedEphemeralPublicKey(publicKeyBase64: string): Promise<string> {
  const { getExtendedEphemeralPublicKey } = require('@mysten/zklogin');
  const { fromB64 } = require('@mysten/sui/utils');
  const { Ed25519PublicKey } = require('@mysten/sui/keypairs/ed25519');
  
  // Convert base64 string to PublicKey object
  const publicKeyBytes = fromB64(publicKeyBase64);
  const publicKey = new Ed25519PublicKey(publicKeyBytes);
  
  return getExtendedEphemeralPublicKey(publicKey);
}

export async function getCurrentEpoch(): Promise<number> {
  if (!client) await initClient();
  const { epoch } = await client.getLatestSuiSystemState();
  return Number(epoch);
}

export async function getProof(
  jwt: string, 
  extendedEphemeralPublicKey: string,
  maxEpoch: number,
  jwtRandomness: string,
  salt: string
): Promise<ProofResponse> {
  try {
    const proofRequest = {
      jwt,
      extendedEphemeralPublicKey,
      maxEpoch,
      jwtRandomness,
      salt,
      keyClaimName: "sub"
    };

    console.log('Sending proof request:', {
      ...proofRequest,
      jwt: jwt.substring(0, 20) + '...'
    });

    const response = await fetch('https://prover-dev.mystenlabs.com/v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proofRequest)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Proof service raw error:', error);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      throw new Error(`Proof service error: ${error}`);
    }

    const proofData = await response.json();
    console.log('Received proof response:', proofData);
    return proofData;
  } catch (error) {
    console.error('Error getting proof:', error);
    throw error;
  }
} 