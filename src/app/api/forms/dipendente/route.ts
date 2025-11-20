import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://accelera-crm-production.up.railway.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'nome', 'cognome', 'mail', 'telefono', 
      'meseNascita', 'annoNascita',
      'amount', 'salary', 'tipo', 'contratto'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Forward to external API
    const response = await fetch(`${EXTERNAL_API_BASE}/api/forms/dipendente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Error forwarding request to external API' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error processing DIPENDENTE form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

