import type { NextApiRequest, NextApiResponse } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { clerkUserId, email, firstName, lastName, emailVerified } = req.body;
    
    if (!clerkUserId || !email) {
      return res.status(400).json({ error: 'clerkUserId and email are required' });
    }

    const response = await fetch(`${API_URL}/user/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkUserId,
        email,
        firstName,
        lastName,
        emailVerified
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: 'Failed to sync user with backend',
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
