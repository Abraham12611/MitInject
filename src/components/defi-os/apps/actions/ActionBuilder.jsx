'use client'

import React, { useState } from 'react';
import { ArrowLeft, Search, Waves, Wallet, Twitter, BarChart2, PiggyBank, Send, Repeat, Plus, Minus, MessageSquare, Share2, Globe, Zap, ArrowRight } from 'lucide-react';
import { useSpring, animated, useTransition } from '@react-spring/web';
import ActionList from './ActionList';

// Action services available
const actionServices = [
  {
    id: 'wallet',
    name: 'Wallet',
    description: 'Send tokens and manage wallet operations',
    icon: Wallet,
    color: '#4ECDC4',
    actions: [
      {
        id: 'send-token',
        title: 'Send token',
        description: 'Send a specific token to a wallet address',
        isPro: false,
        icon: Send
      },
      {
        id: 'distribute-tokens',
        title: 'Distribute tokens',
        description: 'Send tokens to multiple wallet addresses',
        isPro: true,
        icon: Share2
      }
    ]
  },
  {
    id: 'helix',
    name: 'Helix',
    description: 'Trade and provide liquidity on Injective\'s premier DEX',
    icon: Waves,
    color: '#6C5CE7',
    actions: [
      {
        id: 'swap',
        title: 'Swap tokens',
        description: 'Swap one token for another on Helix',
        isPro: false,
        icon: Repeat
      },
      {
        id: 'add-liquidity',
        title: 'Add liquidity',
        description: 'Add liquidity to a pool on Helix',
        isPro: true,
        icon: Plus
      },
      {
        id: 'remove-liquidity',
        title: 'Remove liquidity',
        description: 'Remove liquidity from a pool on Helix',
        isPro: true,
        icon: Minus
      },
      {
        id: 'trade-perpetuals',
        title: 'Trade perpetuals',
        description: 'Open positions in perpetual markets on Helix',
        isPro: true,
        icon: BarChart2
      }
    ]
  },
  {
    id: 'astroport',
    name: 'Astroport',
    description: 'Multi-chain DEX with advanced features on Injective',
    icon: Globe,
    color: '#0984E3',
    actions: [
      {
        id: 'swap',
        title: 'Swap tokens',
        description: 'Swap tokens on Astroport',
        isPro: false,
        icon: Repeat
      },
      {
        id: 'add-liquidity',
        title: 'Add liquidity',
        description: 'Add liquidity to a pool on Astroport',
        isPro: true,
        icon: Plus
      },
      {
        id: 'remove-liquidity',
        title: 'Remove liquidity',
        description: 'Remove liquidity from a pool on Astroport',
        isPro: true,
        icon: Minus
      },
      {
        id: 'cross-chain',
        title: 'Cross-chain swap',
        description: 'Swap tokens across different chains',
        isPro: true,
        icon: ArrowRight
      }
    ]
  },
  {
    id: 'gryphon',
    name: 'Gryphon',
    description: 'Liquid staking platform on Injective',
    icon: Zap,
    color: '#1E90FF',
    actions: [
      {
        id: 'stake',
        title: 'Stake INJ',
        description: 'Stake INJ tokens for liquid staking derivatives',
        isPro: true,
        icon: Plus
      },
      {
        id: 'unstake',
        title: 'Unstake INJ',
        description: 'Unstake INJ from the liquid staking protocol',
        isPro: true,
        icon: Minus
      }
    ]
  },
  {
    id: 'ninjagarden',
    name: 'Ninja Garden',
    description: 'Social-Fi engage-to-earn platform on Injective',
    icon: PiggyBank,
    color: '#00B894',
    actions: [
      {
        id: 'join-faction',
        title: 'Join Faction',
        description: 'Join a faction by purchasing creator keys',
        isPro: true,
        icon: Plus
      },
      {
        id: 'engage-mission',
        title: 'Engage Mission',
        description: 'Engage with posts to earn points',
        isPro: true,
        icon: Twitter
      }
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'Post tweets and interact on Twitter',
    icon: Twitter,
    color: '#1DA1F2',
    actions: [
      {
        id: 'post-tweet',
        title: 'Post a tweet',
        description: 'Post a new tweet with customizable text',
        isPro: true,
        icon: MessageSquare
      },
      {
        id: 'post-thread',
        title: 'Post a thread',
        description: 'Post a thread of tweets',
        isPro: true,
        icon: MessageSquare
      }
    ]
  }
];

const ActionBuilder = ({ theme, onBack, onSaveAction, isExpanded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const filteredServices = actionServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Service box with animations
  const ServiceBox = ({ service }) => {
    if (!service) return null;

    const [pressed, setPressed] = useState(false);

    const pressAnimation = useSpring({
      transform: pressed ? 'scale(0.95)' : 'scale(1)',
      config: { tension: 300, friction: 10 }
    });

    const ServiceIcon = service.icon || Wallet;

    return (
      <animated.button
        className="flex flex-col items-center justify-center p-4 rounded-xl transition-colors hover:scale-105"
        style={{
          ...pressAnimation,
          backgroundColor: theme.colors.secondary,
          backgroundImage: 'none',
          width: '100%',
          aspectRatio: '1',
          maxWidth: '160px',
          border: `1px solid ${theme.colors.border}`
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onClick={() => setSelectedService(service)}
      >
        <ServiceIcon className="w-8 h-8 mb-2" style={{ color: service.color }} />
        <div className="text-sm font-medium text-center" style={{ color: theme.colors.text.primary }}>
          {service.name || 'Unknown Service'}
        </div>
      </animated.button>
    );
  };

  // Transitions for filtered services
  const transitions = useTransition(filteredServices, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    keys: service => service.id,
    config: { tension: 300, friction: 20 }
  });

  // If a service is selected, show its actions
  if (selectedService) {
    return (
      <ActionList
        theme={theme}
        service={selectedService}
        onBack={onBack}
        onSaveAction={(action, config) => {
          console.log('ActionBuilder saving:', { action, config });
          onSaveAction(action, config);
        }}
        isExpanded={isExpanded}
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: theme.colors.border }}>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.colors.text.primary }} />
        </button>
        <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
          Choose an action service
        </h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                 style={{ color: theme.colors.text.secondary }} />
          <input
            type="text"
            placeholder="Search services"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.border}`
            }}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="grid gap-3 mx-auto relative"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            maxWidth: isExpanded ? '1200px' : '800px'
          }}
        >
          {transitions((style, service) => (
            <animated.div style={style} key={service.id} className="flex justify-center">
              <ServiceBox service={service} />
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionBuilder;