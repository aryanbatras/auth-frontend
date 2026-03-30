import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { api, User, UserUpdateRequest } from '../lib/api'
import Link from 'next/link'

export default function UserManagement() {
  const { isSignedIn, user } = useUser()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UserUpdateRequest>({})

  useEffect(() => {
    if (isSignedIn && user) {
      loadCurrentUser()
      loadAllUsers()
    }
  }, [isSignedIn, user])

  const loadCurrentUser = async () => {
    try {
      setLoading(true)
      const response = await api.getUserByClerkId(user?.id || '')
      if (response.success && response.user) {
        setCurrentUser(response.user)
        setEditForm({
          firstName: response.user.firstName || '',
          lastName: response.user.lastName || '',
          email: response.user.email,
          phoneNumber: response.user.phoneNumber || '',
          username: response.user.username || '',
          profileImageUrl: response.user.profileImageUrl || '',
          emailVerified: response.user.emailVerified
        })
      }
    } catch (err) {
      setError('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const loadAllUsers = async () => {
    try {
      const response = await api.getAllUsers()
      if (response.success && response.users) {
        setAllUsers(response.users)
      }
    } catch (err) {
      console.error('Failed to load all users:', err)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (!currentUser) return

      const response = await api.updateUser(currentUser.id, editForm)
      if (response.success && response.user) {
        setCurrentUser(response.user)
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        loadAllUsers()
      } else {
        setError(response.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An error occurred while updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await api.updateUserStatus(userId, !currentStatus)
      if (response.success) {
        setSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`)
        loadAllUsers()
        if (currentUser && currentUser.id === userId) {
          loadCurrentUser()
        }
      } else {
        setError(response.error || 'Failed to update user status')
      }
    } catch (err) {
      setError('An error occurred while updating user status')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await api.deleteUser(userId)
      if (response.success) {
        setSuccess('User deleted successfully!')
        loadAllUsers()
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(null)
        }
      } else {
        setError(response.error || 'Failed to delete user')
      }
    } catch (err) {
      setError('An error occurred while deleting user')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(null), 2000)
  }

  if (!isSignedIn) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif', 
        maxWidth: '900px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 64px)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          border: '1px solid #333333',
          borderRadius: '8px',
          backgroundColor: '#000000'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginBottom: '16px', 
            fontSize: '20px',
            fontWeight: '500'
          }}>
            Sign In Required
          </h2>
          <p style={{ 
            color: '#888888', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Please sign in to access user management features.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px)',
      color: '#ffffff'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <Link 
          href="/"
          style={{
            padding: '8px 16px',
            backgroundColor: '#000000',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '400',
            border: '1px solid #333333'
          }}
        >
          ← Back
        </Link>
        <h1 style={{ 
          fontSize: '24px',
          fontWeight: '600',
          color: '#ffffff',
          margin: 0
        }}>
          User Management
        </h1>
        <div style={{ width: '80px' }}></div>
      </div>

      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: 'rgba(255, 68, 68, 0.1)',
          border: '1px solid #ff4444',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#ff6666'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: 'rgba(68, 255, 68, 0.1)',
          border: '1px solid #44ff44',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#44ff44'
        }}>
          {success}
        </div>
      )}

      {currentUser && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            padding: '24px', 
            border: '1px solid #333333',
            borderRadius: '8px',
            backgroundColor: '#000000',
            marginBottom: '20px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '16px',
                fontWeight: '500',
                margin: 0
              }}>
                My Profile
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: isEditing ? '#ff4444' : '#000000',
                  color: '#ffffff',
                  border: '1px solid #333333',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.firstName || ''}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#000000',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.lastName || ''}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#000000',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#000000',
                      border: '1px solid #333333',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#000000',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phoneNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: '#000000',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', color: '#cccccc', fontSize: '12px' }}>
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={editForm.profileImageUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, profileImageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: '100%',
                      padding: '8px',
                      backgroundColor: '#000000',
                      border: '1px solid #333333',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={editForm.emailVerified || false}
                    onChange={(e) => setEditForm({ ...editForm, emailVerified: e.target.checked })}
                    style={{ width: '12px', height: '12px' }}
                  />
                  <label style={{ color: '#cccccc', fontSize: '12px' }}>
                    Email Verified
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: loading ? '#666666' : '#000000',
                      color: '#ffffff',
                      border: '1px solid #333333',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '400',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: '1px solid #333333',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '400',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Database ID</strong>
                  <span 
                    style={{ 
                      color: '#888888', 
                      fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => copyToClipboard(currentUser.id.toString())}
                  >
                    #{currentUser.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Name</strong>
                  <span style={{ color: '#888888' }}>{currentUser.firstName} {currentUser.lastName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email</strong>
                  <span style={{ color: '#888888' }}>{currentUser.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Username</strong>
                  <span style={{ color: '#888888' }}>{currentUser.username || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Phone</strong>
                  <span style={{ color: '#888888' }}>{currentUser.phoneNumber || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Status</strong>
                  <span style={{ 
                    color: currentUser.active ? '#44ff44' : '#ff4444',
                    fontWeight: '500',
                    fontSize: '12px'
                  }}>
                    {currentUser.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email Verified</strong>
                  <span style={{ 
                    color: currentUser.emailVerified ? '#44ff44' : '#ff4444',
                    fontWeight: '500',
                    fontSize: '12px'
                  }}>
                    {currentUser.emailVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Member Since</strong>
                  <span style={{ color: '#888888', fontSize: '12px' }}>
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ 
        padding: '24px', 
        border: '1px solid #333333',
        borderRadius: '8px',
        backgroundColor: '#000000'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          marginBottom: '20px', 
          fontSize: '16px',
          fontWeight: '500',
          margin: 0
        }}>
          All Users ({allUsers.length})
        </h2>

        {allUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888888' }}>
            No users found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333333' }}>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>ID</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Name</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Email</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Username</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Status</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Verified</th>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #333333' }}>
                    <td style={{ padding: '8px', color: '#888888', fontSize: '12px' }}>
                      #{user.id}
                    </td>
                    <td style={{ padding: '8px', color: '#ffffff', fontSize: '12px' }}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={{ padding: '8px', color: '#888888', fontSize: '12px' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '8px', color: '#888888', fontSize: '12px' }}>
                      {user.username || '-'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ 
                        color: user.active ? '#44ff44' : '#ff4444',
                        fontWeight: '500',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        backgroundColor: user.active ? 'rgba(68, 255, 68, 0.1)' : 'rgba(255, 68, 68, 0.1)'
                      }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ 
                        color: user.emailVerified ? '#44ff44' : '#ff4444',
                        fontWeight: '500',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        backgroundColor: user.emailVerified ? 'rgba(68, 255, 68, 0.1)' : 'rgba(255, 68, 68, 0.1)'
                      }}>
                        {user.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleToggleUserStatus(user.id, user.active)}
                          style={{
                            padding: '2px 6px',
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '10px',
                            fontWeight: '400',
                            cursor: 'pointer'
                          }}
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                        {user.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              padding: '2px 6px',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '2px',
                              fontSize: '10px',
                              fontWeight: '400',
                              cursor: 'pointer',
                              backgroundColor: '#000000',
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
