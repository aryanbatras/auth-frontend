import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { clerkUserId } = req.query;
    
    if (!clerkUserId || typeof clerkUserId !== 'string') {
      return res.status(400).json({ error: 'Valid Clerk user ID is required' });
    }

    const response = await fetch(`${API_URL}/user/clerk/${clerkUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'Failed to fetch user',
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
