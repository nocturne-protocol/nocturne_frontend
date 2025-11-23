'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAccount, useChainId, useWriteContract, useReadContract, useSwitchChain } from 'wagmi';
import { DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface TradingInterfaceProps {
  ticker: string;
  assetName: string;
  currentPrice: number;
  assetImage: string;
}

const CHAIN_INFO: Record<number, { name: string; color: string; bgColor: string; iconPath: string }> = {
  1: { name: 'Ethereum', color: 'bg-blue-100', bgColor: 'bg-blue-100', iconPath: '/asset/ethereum.png' },
  11155111: { name: 'Sepolia', color: 'bg-gray-100', bgColor: 'bg-gray-100', iconPath: '/asset/ethereum.png' },
  84532: { name: 'Base Sepolia', color: 'bg-blue-100', bgColor: 'bg-blue-50', iconPath: '/asset/base.png' },
  421614: { name: 'Arbitrum Sepolia', color: 'bg-blue-100', bgColor: 'bg-blue-100', iconPath: '/asset/arbitrum.png' },
};

const PRIVATE_ERC20_ADDRESS = '0xFC2146736ee72A1c5057e2b914Ed27339F1fe9c7';
const PLATFORM_WALLET = '0x8F64b8442E110c6DbBA5975EF0b829Ee104f6355';
const ARBITRUM_SEPOLIA_ID = 421614;

const PRIVATE_ERC20_ABI = [
  {"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"},{"internalType":"bytes","name":"_encryptionPublicKey","type":"bytes"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"bytes","name":"newEncryptedBalance","type":"bytes"}],"name":"BalanceUpdate","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"bytes","name":"encryptedAmount","type":"bytes"}],"name":"Mint","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"bytes","name":"encryptedAmount","type":"bytes"}],"name":"TransferRequested","type":"event"},
  {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"encryptedBalances","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"encryptionPublicKey","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"encryptedAmount","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"encryptedAmount","type":"bytes"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes","name":"senderNewBalance","type":"bytes"},{"internalType":"bytes","name":"receiverNewBalance","type":"bytes"}],"name":"updateBalance","outputs":[],"stateMutability":"nonpayable","type":"function"}
] as const;

export default function TradingInterface({ ticker, assetName, currentPrice, assetImage }: TradingInterfaceProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [decryptedBalance, setDecryptedBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [payAmount, setPayAmount] = useState<string>('0');
  const [receiveAmount, setReceiveAmount] = useState<string>('0');

  // Contract Hooks
  const { writeContractAsync } = useWriteContract();

  // Read encrypted balance from contract
  const { data: encryptedBalance, refetch: refetchBalance } = useReadContract({
    address: PRIVATE_ERC20_ADDRESS,
    abi: PRIVATE_ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: ARBITRUM_SEPOLIA_ID,
  });

  const chainInfo = CHAIN_INFO[chainId] || { name: 'Unknown', color: 'bg-gray-100', bgColor: 'bg-gray-100', iconPath: '/asset/ethereum.png' };

  // Helper function to convert hex to Uint8Array
  const hexToUint8Array = (hex: string): Uint8Array => {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }
    return bytes;
  };

  // Function to decrypt balance
  const decryptBalance = async (encryptedHex: string) => {
    try {
      setIsLoadingBalance(true);
      
      // Get private key from environment
      const privateKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_PRIVATE_KEY;
      if (!privateKeyHex) {
        console.error('Private key not configured');
        return null;
      }

      // Dynamically import eciesjs
      const { decrypt, PrivateKey } = await import('eciesjs');

      // Create private key
      const privateKey = PrivateKey.fromHex(privateKeyHex);

      // Convert encrypted hex to Uint8Array
      const encryptedBytes = hexToUint8Array(encryptedHex);

      // Decrypt
      const decryptedBytes = decrypt(privateKey.secret, encryptedBytes);

      // Decode to string
      const decrypted = new TextDecoder().decode(decryptedBytes);

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Effect to decrypt balance when it changes
  useEffect(() => {
    if (encryptedBalance && typeof encryptedBalance === 'string' && encryptedBalance !== '0x') {
      decryptBalance(encryptedBalance as string).then(balance => {
        if (balance) {
          setDecryptedBalance(balance);
        } else {
          setDecryptedBalance('0');
        }
      });
    } else {
      setDecryptedBalance('0');
    }
  }, [encryptedBalance]);

  // Refetch balance on mount and after transactions
  useEffect(() => {
    if (isConnected && address) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);

  const handlePayAmountChange = (value: string) => {
    setPayAmount(value);
    const numValue = parseFloat(value) || 0;
    const calculated = activeTab === 'buy' 
      ? numValue / currentPrice 
      : numValue * currentPrice;
    
    setReceiveAmount(activeTab === 'buy' ? calculated.toFixed(6) : calculated.toFixed(2));
  };

  const handleReceiveAmountChange = (value: string) => {
    setReceiveAmount(value);
    const numValue = parseFloat(value) || 0;
    const calculated = activeTab === 'buy'
      ? numValue * currentPrice
      : numValue / currentPrice;
      
    setPayAmount(activeTab === 'buy' ? calculated.toFixed(2) : calculated.toFixed(6));
  };

  const handleTabChange = (tab: 'buy' | 'sell') => {
    setActiveTab(tab);
    setPayAmount('0');
    setReceiveAmount('0');
  };

  // Calculate shares for button text
  const getButtonText = () => {
    const numPay = parseFloat(payAmount) || 0;
    
    if (isProcessing) return 'Processing...';
    if (numPay === 0) return 'Enter an amount';

    if (activeTab === 'buy') {
      const shares = parseFloat(receiveAmount);
      return `Buy ${shares} Shares`;
    } else {
      const shares = parseFloat(payAmount);
      return `Sell ${shares} Shares`;
    }
  };

  // Function to update balances on-chain after a transfer
  const updateBalancesOnChain = async (
    senderAddress: string,
    receiverAddress: string,
    transferAmount: number
  ) => {
    try {
      console.log('Updating balances on-chain...');
      
      // Dynamically import eciesjs and ethers
      const { encrypt, decrypt, PublicKey, PrivateKey } = await import('eciesjs');
      const ethers = await import('ethers');

      // Get public and private keys for encryption/decryption
      const publicKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY;
      const privateKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_PRIVATE_KEY;
      
      if (!publicKeyHex || !privateKeyHex) {
        console.error('Encryption keys not configured');
        return;
      }

      const publicKey = PublicKey.fromHex(publicKeyHex);
      const privateKey = PrivateKey.fromHex(privateKeyHex);

      // Create provider and wallet with encryption private key (has rights to call updateBalance)
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC
      );
      
      // The wallet that has rights to call updateBalance is derived from ENCRYPTION_PRIVATE_KEY
      const updateBalanceWallet = new ethers.Wallet(privateKeyHex, provider);

      // Create contract instance with the wallet that has updateBalance rights
      const contract = new ethers.Contract(
        PRIVATE_ERC20_ADDRESS,
        PRIVATE_ERC20_ABI,
        updateBalanceWallet
      );

      // Read current encrypted balances from contract
      const senderEncryptedBalance = await contract.balanceOf(senderAddress);
      const receiverEncryptedBalance = await contract.balanceOf(receiverAddress);

      // Decrypt current balances
      let senderCurrentBalance = 0;
      let receiverCurrentBalance = 0;

      if (senderEncryptedBalance && senderEncryptedBalance !== '0x') {
        const senderBytes = hexToUint8Array(senderEncryptedBalance);
        const senderDecryptedBytes = decrypt(privateKey.secret, senderBytes);
        senderCurrentBalance = parseFloat(new TextDecoder().decode(senderDecryptedBytes));
      }

      if (receiverEncryptedBalance && receiverEncryptedBalance !== '0x') {
        const receiverBytes = hexToUint8Array(receiverEncryptedBalance);
        const receiverDecryptedBytes = decrypt(privateKey.secret, receiverBytes);
        receiverCurrentBalance = parseFloat(new TextDecoder().decode(receiverDecryptedBytes));
      }

      console.log('Current balances:', {
        sender: senderCurrentBalance,
        receiver: receiverCurrentBalance,
        transfer: transferAmount
      });

      // Calculate new balances
      const senderNewBalance = Math.max(0, senderCurrentBalance - transferAmount);
      const receiverNewBalance = receiverCurrentBalance + transferAmount;

      console.log('New balances:', {
        sender: senderNewBalance,
        receiver: receiverNewBalance
      });

      // Encrypt new balances
      const encoder = new TextEncoder();
      
      const senderNewBalanceBytes = encoder.encode(senderNewBalance.toString());
      const senderEncrypted = encrypt(publicKey.uncompressed, senderNewBalanceBytes);
      const senderEncryptedHex = '0x' + Array.from(senderEncrypted)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const receiverNewBalanceBytes = encoder.encode(receiverNewBalance.toString());
      const receiverEncrypted = encrypt(publicKey.uncompressed, receiverNewBalanceBytes);
      const receiverEncryptedHex = '0x' + Array.from(receiverEncrypted)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Call updateBalance on the contract
      console.log('Calling updateBalance on contract...');
      const tx = await contract.updateBalance(
        senderAddress,
        receiverAddress,
        senderEncryptedHex,
        receiverEncryptedHex
      );

      console.log('UpdateBalance transaction sent:', tx.hash);
      await tx.wait();
      console.log('UpdateBalance transaction confirmed!');

      toast.success('Balances updated on-chain!');

    } catch (error: any) {
      console.error('Failed to update balances on-chain:', error);
      toast.error(`Failed to update balances: ${error.message}`);
    }
  };

  const handleTransaction = async () => {
    // Add validation here since we removed it from the button disabled state
    const sharesAmount = activeTab === 'buy' ? parseFloat(receiveAmount) : parseFloat(payAmount);
    if (isNaN(sharesAmount) || sharesAmount <= 0) {
      // Optionally focus input or shake animation
      return;
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (chainId !== ARBITRUM_SEPOLIA_ID) {
      try {
        await switchChain({ chainId: ARBITRUM_SEPOLIA_ID });
      } catch (error) {
        console.error('Failed to switch network:', error);
        return;
      }
    }

    // Get public key from environment variable
    const publicKeyHex = process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY;
    if (!publicKeyHex) {
      toast.error('Encryption public key not configured.');
      return;
    }

    setIsProcessing(true);

    try {
      // Dynamically import eciesjs to avoid SSR issues
      const { encrypt, PublicKey } = await import('eciesjs');

      // 1. Convert public key from hex to PublicKey object
      const publicKey = PublicKey.fromHex(publicKeyHex);

      // 2. Encode the amount as bytes
      const encoder = new TextEncoder();
      const amountBytes = encoder.encode(sharesAmount.toString());

      // 3. Encrypt the amount with the public key
      const encrypted = encrypt(publicKey.uncompressed, amountBytes);

      // 4. Convert encrypted bytes to hex string for the contract
      const encryptedHex = '0x' + Array.from(encrypted)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      let txHash: string;

      if (activeTab === 'buy') {
        // --- BUY LOGIC ---
        // Transfer from platform wallet to user
        // Using platform private key (same method as SELL but with platform key)
        console.log('Initiating BUY transaction from Platform Wallet (Transfer)...');
        console.log('Encrypted amount:', encryptedHex);

        // Get platform private key from environment
        const platformPrivateKey = process.env.NEXT_PUBLIC_PLATFORM_PRIVATE_KEY;
        if (!platformPrivateKey) {
          throw new Error('Platform private key not configured');
        }

        // Dynamically import ethers (v5 syntax)
        const ethers = await import('ethers');

        // Create provider and wallet with platform private key
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC
        );
        const platformWallet = new ethers.Wallet(platformPrivateKey, provider);

        // Create contract instance with platform wallet
        const contract = new ethers.Contract(
          PRIVATE_ERC20_ADDRESS,
          PRIVATE_ERC20_ABI,
          platformWallet
        );

        // Execute transfer from platform wallet to user
        const tx = await contract.transfer(address, encryptedHex);
        console.log('Transaction sent:', tx.hash);

        // Wait for confirmation
        await tx.wait();
        txHash = tx.hash;
        
      } else {
        // --- SELL LOGIC ---
        // Sender: User Wallet (via Wagmi)
        // Function: transfer (to: platform, amount: encrypted)
        console.log('Initiating SELL transaction from User Wallet (Transfer)...');
        console.log('Encrypted amount:', encryptedHex);

        const destinationAddress = PLATFORM_WALLET;

        txHash = await writeContractAsync({
          address: PRIVATE_ERC20_ADDRESS,
          abi: PRIVATE_ERC20_ABI,
          functionName: 'transfer',
          args: [destinationAddress, encryptedHex as `0x${string}`],
          chainId: ARBITRUM_SEPOLIA_ID,
        });
      }

      console.log('Transaction confirmed:', txHash);
      toast.success(`${activeTab === 'buy' ? 'Buy' : 'Sell'} transaction successful!`, {
        description: `Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`
      });

      // Call updateBalance to update on-chain balances
      await updateBalancesOnChain(
        activeTab === 'buy' ? PLATFORM_WALLET : address!,
        activeTab === 'buy' ? address! : PLATFORM_WALLET,
        sharesAmount
      );

      // Refetch balance after successful transaction
      setTimeout(() => {
        refetchBalance();
      }, 2000);

    } catch (error: any) {
      console.error('Transaction failed:', error);
      const msg = error?.reason || error?.message || 'Unknown error';
      toast.error(`Transaction failed: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-6 mb-4 transition-colors">
        {/* Buy/Sell Tabs */}
        <div className="flex mb-6">
          <div className="bg-gray-200 dark:bg-gray-800 p-1 rounded-xl inline-flex">
            <button
              onClick={() => handleTabChange('buy')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'buy'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleTabChange('sell')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition-colors ${
                activeTab === 'sell'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Sell
            </button>
          </div>
          
          {/* Network Badge */}
          {mounted && isConnected && (
            <div className={`ml-auto flex items-center gap-2 ${chainInfo.bgColor} dark:bg-gray-800 px-3 py-2 rounded-xl`}>
              <div className={`w-5 h-5 ${chainInfo.color} dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden relative`}>
                <Image
                  src={chainInfo.iconPath}
                  alt={chainInfo.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{chainInfo.name}</span>
            </div>
          )}
        </div>

        {/* Pay Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-2 shadow-sm relative z-0 transition-colors">
          <label className="text-gray-400 dark:text-gray-500 text-xs font-medium mb-1 block">Pay</label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={payAmount}
              onChange={(e) => handlePayAmountChange(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-gray-100 text-3xl font-bold outline-none w-full placeholder:text-gray-300 dark:placeholder:text-gray-600"
              placeholder="0"
            />
            {activeTab === 'buy' ? (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-white stroke-[3px]" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">USD</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 relative rounded-full overflow-hidden">
                  <Image
                    src={assetImage}
                    alt={ticker}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{ticker}</span>
              </div>
            )}
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center -my-4 relative z-10">
          <div className="bg-gray-100 dark:bg-gray-900 border-[3px] border-gray-100 dark:border-gray-900 rounded-full p-1">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-sm">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Receive Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm pt-6 transition-colors">
          <label className="text-gray-400 dark:text-gray-500 text-xs font-medium mb-1 block">Receive</label>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={receiveAmount}
              onChange={(e) => handleReceiveAmountChange(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-gray-100 text-3xl font-bold outline-none w-full placeholder:text-gray-300 dark:placeholder:text-gray-600"
              placeholder="0"
            />
            {activeTab === 'buy' ? (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 relative rounded-full overflow-hidden">
                  <Image
                    src={assetImage}
                    alt={ticker}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">{ticker}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full flex-shrink-0">
                <div className="w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-white stroke-[3px]" />
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">USD</span>
              </div>
            )}
          </div>
        </div>

        {/* Balance Display */}
        {mounted && isConnected && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Your Balance</span>
              {isLoadingBalance ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100 font-bold text-lg">
                    {decryptedBalance || '0'} {ticker}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rate Info */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Rate</span>
            <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
              1 {ticker} = {currentPrice.toFixed(2)} USD (${currentPrice.toFixed(2)})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Shares Per Token</span>
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-400 font-bold">?</div>
            </div>
            <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">1 {ticker} = 1.00 {ticker.replace('on', '')}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTransaction}
          disabled={isProcessing || parseFloat(payAmount) === 0}
          className={`w-full font-bold py-4 rounded-xl transition-colors shadow-lg mb-6 ${
            isProcessing || parseFloat(payAmount) === 0
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 cursor-not-allowed' // Keep it black/white but disabled cursor
              : 'bg-gray-900 dark:bg-gray-100 hover:bg-black dark:hover:bg-white text-white dark:text-gray-900'
          }`}
        >
          {getButtonText()}
        </button>

        {/* Disclaimer */}
        <p className="text-gray-400 dark:text-gray-500 text-[10px] leading-relaxed text-justify">
          Global Markets tokens have not been registered under the US Securities Act of 1933, as amended, 
          or the securities or other laws of any other jurisdiction, and may not be offered or sold in the 
          US or to US persons unless registered under the Act or exempt therefrom. The tokens are offered 
          and sold in the EEA and UK solely to qualified investors, and in Switzerland solely to professional 
          clients. Other prohibitions and restrictions apply. See additional information below.*
        </p>
      </div>
    </div>
  );
}
