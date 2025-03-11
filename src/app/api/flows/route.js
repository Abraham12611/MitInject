import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This tells Next.js to handle all HTTP methods dynamically
export const dynamic = 'auto';
// Optionally set revalidation time if needed
export const revalidate = 0;

const flowsPath = path.join(process.cwd(), 'data', 'flows.json');

// GET /api/flows - List flows
export async function GET() {
  try {
    // Read existing flows
    let flows = [];
    try {
      if (fs.existsSync(flowsPath)) {
        const fileData = fs.readFileSync(flowsPath, 'utf8');
        flows = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('Error reading flows.json:', err);
      // Continue with empty flows array if file doesn't exist or is corrupt
    }

    return NextResponse.json({ flows }, { status: 200 });
  } catch (error) {
    console.error('GET /api/flows error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flows' }, 
      { status: 500 }
    );
  }
}

// POST /api/flows - Create flow
export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received flow data:', body);
    
    if (!body.trigger || !body.action) {
      console.error('Missing trigger or action in request');
      return NextResponse.json(
        { error: 'Missing trigger or action' },
        { status: 400 }
      );
    }

    // Read existing flows
    let flows = [];
    try {
      if (fs.existsSync(flowsPath)) {
        console.log('Reading existing flows from:', flowsPath);
        const fileData = fs.readFileSync(flowsPath, 'utf8');
        flows = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('Error reading flows.json:', err);
      // Continue with empty flows array if file doesn't exist or is corrupt
    }

    // Create new flow
    const newFlow = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Created new flow:', newFlow);

    // Add to flows array and save
    flows.push(newFlow);
    
    try {
      console.log('Writing flows to file:', flowsPath);
      fs.writeFileSync(flowsPath, JSON.stringify(flows, null, 2));
      console.log('Successfully wrote flows to file');
    } catch (err) {
      console.error('Error writing flows.json:', err);
      return NextResponse.json(
        { error: 'Failed to save flow to file: ' + err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ flow: newFlow }, { status: 201 });
  } catch (error) {
    console.error('POST /api/flows error:', error);
    return NextResponse.json(
      { error: 'Failed to create flow: ' + error.message },
      { status: 500 }
    );
  }
}