const { ethers } = require("ethers");
const EthCrypto = require("eth-crypto");
require("dotenv").config();

// Configuration
const RPC_URL = "https://sepolia-rollup.arbitrum.io/rpc";
const CONTRACT_ADDRESS = "0x3b3C98D7AfF91b7032d81fC25dfe8d8ECFe546CC";
const TARGET_ADDRESS = "0x8F64b8442E110c6DbBA5975EF0b829Ee104f6355";
// 1 Million tokens with 18 decimals
// Ethers v5 syntax: ethers.utils.parseUnits
const AMOUNT_TO_MINT = ethers.utils.parseUnits("1000000", 18).toString(); 

const ABI = [
  "function mint(address to, bytes encryptedAmount)",
  "function encryptionPublicKey() view returns (bytes)"
];

async function main() {
  // 1. Setup Provider and Wallet
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ ERREUR: La variable PRIVATE_KEY est manquante dans le fichier .env");
    process.exit(1);
  }

  // Ethers v5 syntax: ethers.providers.JsonRpcProvider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  console.log(`🔄 Connexion au wallet: ${wallet.address}`);
  console.log(`🎯 Cible du mint: ${TARGET_ADDRESS}`);
  console.log(`💰 Montant: 1,000,000 tokens (${AMOUNT_TO_MINT} wei)`);

  try {
    // 2. Get Encryption Public Key from Contract
    console.log("🔑 Récupération de la clé publique de chiffrement...");
    const pubKeyBytes = await contract.encryptionPublicKey();
    // Remove '0x' prefix for EthCrypto
    const publicKey = pubKeyBytes.slice(2); 

    // 3. Encrypt the Amount
    console.log("🔒 Chiffrement du montant...");
    const encryptedObject = await EthCrypto.encryptWithPublicKey(
      publicKey,
      AMOUNT_TO_MINT
    );
    
    const encryptedString = EthCrypto.cipher.stringify(encryptedObject);
    const encryptedBytes = "0x" + Buffer.from(encryptedString).toString("hex");

    // 4. Execute Mint Transaction
    console.log("🚀 Envoi de la transaction de mint...");
    const tx = await contract.mint(TARGET_ADDRESS, encryptedBytes);
    
    console.log(`✅ Transaction envoyée ! Hash: ${tx.hash}`);
    console.log("⏳ En attente de confirmation...");
    
    await tx.wait();
    console.log("🎉 Mint confirmé avec succès !");

  } catch (error) {
    console.error("❌ Une erreur est survenue:", error);
  }
}

main();
