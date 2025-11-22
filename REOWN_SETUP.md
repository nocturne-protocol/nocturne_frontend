# 🔗 Configuration Reown (WalletConnect)

## ✅ Ce qui a été configuré

L'intégration Reown (anciennement WalletConnect) est maintenant active ! Le bouton "Connect Wallet" utilise Web3Modal v3 pour se connecter aux wallets.

## 🚀 Configuration rapide

### 1. Obtenir un Project ID

1. Allez sur [cloud.reown.com](https://cloud.reown.com)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez votre **Project ID**

### 2. Configurer les variables d'environnement

Ouvrez `.env.local` et remplacez :

```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

Par votre vrai Project ID :

```bash
NEXT_PUBLIC_REOWN_PROJECT_ID=abc123def456...
```

### 3. Redémarrer le serveur

```bash
npm run dev
```

## 🎯 Fonctionnalités

### Bouton Connect Wallet

Le bouton dans la navbar permet maintenant de :

- ✅ **Se connecter** : Cliquer ouvre le modal Web3Modal
- ✅ **Wallets supportés** : MetaMask, WalletConnect, Coinbase Wallet, etc.
- ✅ **Affichage de l'adresse** : Une fois connecté, affiche l'adresse raccourcie
- ✅ **Déconnexion** : Bouton "Disconnect" visible quand connecté

### Chaînes supportées

Par défaut, les chaînes suivantes sont configurées :

- **Ethereum Mainnet** (chainId: 1)
- **Sepolia Testnet** (chainId: 11155111)
- **Arbitrum** (chainId: 42161)
- **Polygon** (chainId: 137)

## 📁 Fichiers ajoutés/modifiés

### Nouveaux fichiers

1. **`src/config/web3.ts`**
   - Configuration Wagmi
   - Définition des chaînes
   - Métadonnées de l'app

2. **`src/components/Web3Provider.tsx`**
   - Provider React pour Wagmi et Web3Modal
   - QueryClient pour les requêtes

### Fichiers modifiés

1. **`src/app/layout.tsx`**
   - Ajout du `Web3Provider` wrapper

2. **`src/components/Navbar.tsx`**
   - Converti en 'use client'
   - Utilise `useWeb3Modal` hook
   - Affiche l'adresse si connecté
   - Bouton disconnect

3. **`package.json`**
   - Ajout des dépendances :
     - `@web3modal/wagmi`
     - `wagmi`
     - `viem`
     - `@tanstack/react-query`

## 🔧 Personnalisation

### Changer les chaînes supportées

Éditez `src/config/web3.ts` :

```typescript
import { mainnet, sepolia, arbitrum, polygon, base } from 'wagmi/chains'

export const config = defaultWagmiConfig({
  chains: [mainnet, base], // Personnalisez ici
  // ...
})
```

### Personnaliser l'apparence

Web3Modal/Reown supporte la personnalisation des thèmes :

```typescript
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'dark', // 'light' | 'dark'
  themeVariables: {
    '--w3m-accent': '#000000', // Couleur principale
  }
})
```

## 🎨 Usage dans les composants

### Obtenir l'adresse connectée

```typescript
'use client';

import { useAccount } from 'wagmi';

export function MyComponent() {
  const { address, isConnected } = useAccount();
  
  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
}
```

### Ouvrir le modal

```typescript
'use client';

import { useWeb3Modal } from '@web3modal/wagmi/react';

export function MyButton() {
  const { open } = useWeb3Modal();
  
  return (
    <button onClick={() => open()}>
      Connect Wallet
    </button>
  );
}
```

### Lire un smart contract

```typescript
'use client';

import { useReadContract } from 'wagmi';

export function TokenBalance() {
  const { data, isLoading } = useReadContract({
    address: '0x...',
    abi: [...],
    functionName: 'balanceOf',
    args: [address]
  });
  
  return <div>Balance: {data?.toString()}</div>;
}
```

## 🆘 Dépannage

### Le modal ne s'ouvre pas

1. Vérifiez que `NEXT_PUBLIC_REOWN_PROJECT_ID` est bien défini
2. Vérifiez la console pour les erreurs
3. Redémarrez le serveur après avoir modifié `.env.local`

### Erreur "projectId is required"

Le Project ID n'est pas configuré. Suivez l'étape 1 et 2 ci-dessus.

### Les wallets ne se connectent pas

1. Vérifiez que vous avez une extension wallet installée (MetaMask, etc.)
2. Essayez avec WalletConnect pour scanner un QR code
3. Vérifiez que vous êtes sur une chaîne supportée

## 📚 Documentation

- [Reown Docs](https://docs.reown.com/)
- [Web3Modal Docs](https://docs.reown.com/appkit/overview)
- [Wagmi Docs](https://wagmi.sh/)

## 🎉 C'est prêt !

Votre application peut maintenant connecter des wallets Web3 ! 

1. Obtenez votre Project ID sur [cloud.reown.com](https://cloud.reown.com)
2. Ajoutez-le dans `.env.local`
3. Cliquez sur "Connect Wallet" et profitez ! 🚀

