export const api = {
  syncUser: async (userData: { clerkUserId: string; email: string; firstName?: string; lastName?: string; emailVerified?: boolean }) => {
    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to sync user: ${response.status}`);
    }
    
    return await response.json();
  },
};
