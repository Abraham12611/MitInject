import { NextResponse } from 'next/server';

// GET /api/flows/:id - Get single flow
export async function GET(request, { params }) {
  const { id } = params;

  // Mock data
  const flow = {
    id,
    userId: 'user123',
    name: 'Price Alert & Token Send',
    trigger: {
      service: {
        id: 'token',
        name: 'Token',
        icon: 'Coins',
        color: '#FF6B6B'
      },
      action: {
        id: 'price-below',
        title: 'Price drops below',
        config: {
          token: 'SUI',
          threshold: '0.5',
          timeframe: '1h'
        }
      }
    },
    action: {
      service: {
        id: 'wallet',
        name: 'Wallet',
        icon: 'Wallet',
        color: '#4ECDC4'
      },
      action: {
        id: 'send-token',
        title: 'Send token',
        config: {
          token: 'SUI',
          amount: '10',
          recipient: '0x123...'
        }
      }
    },
    enabled: true,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  };

  return NextResponse.json({ flow });
}

// PUT /api/flows/:id - Update flow
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  // Mock updating a flow
  const updatedFlow = {
    ...body,
    id,
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({ flow: updatedFlow });
}

// DELETE /api/flows/:id - Delete flow
export async function DELETE(request, { params }) {
  const { id } = params;

  // Mock deletion
  return NextResponse.json({ success: true });
} 