import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { sepolia, baseSepolia, arbitrumSepolia } from 'wagmi/chains'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ''

if (!projectId) {
  console.warn('NEXT_PUBLIC_REOWN_PROJECT_ID is not set. Get one at https://cloud.reown.com')
}

const metadata = {
  name: 'Nocturne',
  description: 'Nocturne - Tokenized Assets Trading Platform',
  url: 'https://nocturne-rwa.vercel.app', // Replace with your actual URL
  icons: ['https://nocturne-rwa.vercel.app/nocturne.jpg'] // Replace with your actual icon
}

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [sepolia, arbitrumSepolia, baseSepolia],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})

