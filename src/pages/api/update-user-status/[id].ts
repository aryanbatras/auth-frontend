import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { active } = req.body;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Valid user ID is required' });
    }

    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'Active status (boolean) is required' });
    }

    const response = await fetch(`${API_URL}/user/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'Failed to update user status',
        message: errorText
      });
    }

    const userData = await response.json();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
