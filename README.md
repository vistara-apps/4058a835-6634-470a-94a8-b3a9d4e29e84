# Crypto Combat Arena 🎮⚔️

A competitive battle game for solo players where they can use their NFTs as characters against AI opponents and other players, with a progression system and matchmaking.

## 🚀 Features

### Core Features
- **AI-Powered Opponent Battles**: Engage in strategic combat against sophisticated AI opponents that adapt to your playstyle
- **Matchmaking & Ranking System**: Robust matchmaking system with public ranking boards
- **NFT Stat/Ability Integration**: Use your existing NFTs as playable characters with unique attributes
- **Battle Pass & Progression Rewards**: Dynamic battle pass system with exclusive rewards

### Technical Features
- **Base MiniApp Integration**: Built with Base Minikit for seamless wallet integration
- **Farcaster Frame Support**: Interactive frames for social sharing and engagement
- **Real-time Battle System**: Turn-based combat with energy management and abilities
- **Responsive Design**: Mobile-first design with glass morphism UI
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base network integration via OnchainKit
- **Wallet**: Base Minikit for wallet connections
- **Animations**: Framer Motion for smooth transitions
- **UI Components**: Custom component library with variants
- **State Management**: React hooks with local state

## 🎨 Design System

### Colors
- **Background**: `hsl(220 20% 10%)`
- **Surface**: `hsl(220 20% 15%)`
- **Primary**: `hsl(230 70% 50%)`
- **Accent**: `hsl(35 90% 60%)`
- **Text Primary**: `hsl(0 0% 95%)`
- **Text Secondary**: `hsl(0 0% 70%)`
- **Neon Colors**: Blue (`#00d4ff`), Purple (`#8000ff`), Pink (`#ff0080`)

### Typography
- **Display**: `text-xl font-bold`
- **Heading**: `text-lg font-semibold`
- **Body**: `text-base font-normal`
- **Caption**: `text-sm font-light`

### Spacing
- **Small**: `8px`
- **Medium**: `16px`
- **Large**: `24px`

## 🏗️ Architecture

### Components
```
components/
├── ActionButton.tsx       # Reusable button component with variants
├── BattleArena.tsx       # Main battle interface
├── BattlePassTracker.tsx # Progress tracking component
├── FrameHeader.tsx       # App header with branding
├── GameLobby.tsx         # NFT selection and game modes
├── Leaderboard.tsx       # Competitive rankings
├── NFTAvatar.tsx         # NFT display component
└── OnboardingFlow.tsx    # Multi-step user onboarding
```

### Core Systems
```
lib/
├── api.ts               # API service classes
├── battle-engine.ts     # Combat mechanics and AI
├── constants.ts         # Game configuration
├── types.ts            # TypeScript definitions
└── utils.ts            # Utility functions
```

### API Routes
```
app/api/
└── frame/
    └── route.ts         # Farcaster Frame integration
```

## 🎮 Game Mechanics

### Battle System
- **Turn-based Combat**: Players select actions each turn
- **Energy Management**: Actions consume energy, regenerates over time
- **Status Effects**: Buffs, debuffs, and special conditions
- **Ability Cooldowns**: Strategic timing for special abilities

### NFT Integration
- **Stats Mapping**: NFT attributes translate to combat stats
- **Unique Abilities**: Each NFT has special abilities based on traits
- **Visual Representation**: NFT images used as character avatars

### Progression System
- **XP Rewards**: Gain experience from battles
- **Battle Pass Levels**: Unlock rewards through progression
- **Ranking Points**: Competitive ladder system
- **Achievement Tracking**: Various milestones and rewards

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Base wallet for testing

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd crypto-combat-arena

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys and configuration

# Run development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_URL=http://localhost:3000
NEYNAR_API_KEY=your_neynar_api_key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 User Flows

### New User Onboarding
1. **Welcome Screen**: Introduction to the game
2. **Wallet Connection**: Connect Base wallet via Minikit
3. **Farcaster Integration**: Optional social features
4. **Tutorial**: Learn battle mechanics
5. **Arena Entry**: Start playing

### Battle Flow
1. **NFT Selection**: Choose your fighter
2. **Mode Selection**: AI battle or PvP matchmaking
3. **Battle Execution**: Turn-based combat
4. **Results**: XP rewards and progression
5. **Return to Lobby**: Continue playing

### Progression Flow
1. **Battle Completion**: Earn XP and ranking points
2. **Level Up**: Unlock new Battle Pass tiers
3. **Reward Claims**: Collect exclusive items
4. **Leaderboard Climb**: Compete for top positions

## 🔮 Future Enhancements

### Planned Features
- **Tournament System**: Organized competitive events
- **Guild System**: Team-based gameplay
- **NFT Marketplace**: Trade battle-ready NFTs
- **Advanced AI**: Machine learning opponents
- **Mobile App**: Native iOS/Android versions

### Technical Improvements
- **Real-time Multiplayer**: WebSocket-based PvP
- **Blockchain Integration**: On-chain battle results
- **Analytics Dashboard**: Player behavior insights
- **Performance Optimization**: Faster load times

## 📱 Farcaster Integration

### Frame Features
- **Interactive Battles**: Start battles directly from frames
- **Leaderboard Sharing**: Show rankings in social feeds
- **Battle Results**: Share victories and achievements
- **Community Engagement**: Connect with other players

### Frame Actions
- Start Battle
- View Leaderboard
- Check Battle Pass
- Open Full App

## 🎨 UI/UX Features

### Visual Design
- **Glass Morphism**: Modern translucent cards
- **Neon Accents**: Gaming-inspired color scheme
- **Smooth Animations**: Framer Motion transitions
- **Responsive Layout**: Mobile-first approach

### User Experience
- **Intuitive Navigation**: Clear information hierarchy
- **Real-time Feedback**: Toast notifications
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: Graceful error recovery

## 🔒 Security & Best Practices

### Wallet Security
- **Secure Connections**: HTTPS only
- **Minimal Permissions**: Request only necessary access
- **User Consent**: Clear permission requests

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Sanitize all user inputs

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Lazy load components
- **Image Optimization**: Next.js Image component
- **Caching**: API response caching
- **Bundle Analysis**: Monitor bundle size

### Metrics
- **Core Web Vitals**: Optimized for performance
- **Lighthouse Score**: 90+ across all categories
- **Mobile Performance**: Fast loading on mobile devices

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write descriptive commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Base Team**: For the excellent Minikit and OnchainKit
- **Farcaster**: For the Frame protocol
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Lucide Icons**: For the beautiful icon set

---

**Built with ❤️ for the Base ecosystem**

Ready to battle? Connect your wallet and enter the arena! ⚔️🏆
