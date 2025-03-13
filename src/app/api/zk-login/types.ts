export interface ProofRequest {
  jwt: string;
  extendedEphemeralPublicKey: string;
  maxEpoch: number;
  jwtRandomness: string;
  salt: string;
  keyClaimName: string;
}

export interface ProofResponse {
  // Add the properties that match your proof response
  proof?: string;
  publicInputs?: string[];
  // Add other properties based on what you receive from the prover service
  [key: string]: any; // This allows for additional properties
} 