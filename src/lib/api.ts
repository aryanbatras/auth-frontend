export interface User {
  id: number;
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  active: boolean;
  phoneNumber?: string;
  username?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
  profileImageUrl?: string;
  emailVerified?: boolean;
}

export interface UserSyncRequest {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  user?: T;
  users?: T[];
  count?: number;
  error?: string;
  message?: string;
}

export const api = {
  syncUser: async (userData: UserSyncRequest): Promise<ApiResponse<User>> => {
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
    
    const data = await response.json();
    return {
      success: data.success,
      user: data.user,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await fetch(`/api/get-user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      user: data.user,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  getUserByClerkId: async (clerkUserId: string): Promise<ApiResponse<User>> => {
    const response = await fetch(`/api/get-user/clerk/${clerkUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      user: data.user,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  getAllUsers: async (): Promise<ApiResponse<User>> => {
    const response = await fetch('/api/get-all-users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      users: data.users,
      count: data.count,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  updateUser: async (id: number, userData: UserUpdateRequest): Promise<ApiResponse<User>> => {
    const response = await fetch(`/api/update-user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      user: data.user,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  updateUserStatus: async (id: number, active: boolean): Promise<ApiResponse<User>> => {
    const response = await fetch(`/api/update-user-status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      user: data.user,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },

  deleteUser: async (id: number): Promise<ApiResponse<null>> => {
    const response = await fetch(`/api/delete-user/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: data.success,
      error: data.success ? undefined : data.error,
      message: data.message
    };
  },
};
