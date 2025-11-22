# Nocturne - Tokenized Real-World Assets Platform

A modern web platform for exploring and investing in tokenized real-world assets on the blockchain.

## Features

- 🏦 **Asset Dashboard** - View top gainers, trending assets, and newly added tokens
- 📊 **Market Ticker** - Real-time market data for major indices
- 🔍 **Asset Explorer** - Browse and search through available tokenized assets
- 📈 **Price Charts** - Interactive sparkline charts for asset price trends
- 🎨 **Modern UI** - Clean, responsive design built with Tailwind CSS

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI**: [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd front
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
front/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── AssetCard.tsx
│   │   ├── AssetList.tsx
│   │   ├── DashboardSummary.tsx
│   │   ├── ExploreAssets.tsx
│   │   ├── MarketTicker.tsx
│   │   ├── Navbar.tsx
│   │   └── Sparkline.tsx
│   └── lib/              # Utility functions
├── public/
│   ├── asset/            # Asset logos and images
│   └── nocturne.jpg      # Platform logo
└── ...config files
```

## Deploy on Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

Or manually:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

## Environment Variables

Currently, this project doesn't require any environment variables. If you add API integrations, create a `.env.local` file:

```bash
# Example
NEXT_PUBLIC_API_URL=your-api-url
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.
