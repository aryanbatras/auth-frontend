import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function Home() {
  const { isSignedIn, user } = useUser()
  const [backendUser, setBackendUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn) {
      const syncUserWithBackend = async () => {
        setLoading(true)
        setError(null)
        try {
          const userData = {
            clerkUserId: user?.id || '',
            email: user?.primaryEmailAddress?.emailAddress || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            emailVerified: true
          }
          
          const syncedUser = await api.syncUser(userData)
          setBackendUser(syncedUser.user)
        } catch (err) {
          setError(`Error syncing user: ${err instanceof Error ? err.message : 'Unknown error'}`)
        } finally {
          setLoading(false)
        }
      }
      syncUserWithBackend()
    }
  }, [isSignedIn, user])

  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif', 
      maxWidth: '900px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 64px)',
      color: '#ffffff'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '60px', 
        fontSize: '48px',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(to right, #ffffff, #a0a0a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        User Sync
      </h1>
      
      {!isSignedIn ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px', 
          border: '1px solid #333333',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
        }}>
          <h2 style={{ 
            color: '#ffffff', 
            marginBottom: '16px', 
            fontSize: '24px',
            fontWeight: '500'
          }}>
            Welcome
          </h2>
          <p style={{ 
            color: '#888888', 
            marginBottom: '32px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Sign in to sync your user data with the backend.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Clerk User Info Section */}
          <div style={{ 
            padding: '32px', 
            border: '1px solid #333333',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
          }}>
            <h2 style={{ 
              color: '#ffffff', 
              marginBottom: '24px', 
              fontSize: '20px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '24px' }}>🔐</span>
              Clerk User
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>User ID</strong>
                <span style={{ 
                  color: '#888888', 
                  fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                  fontSize: '14px',
                  backgroundColor: '#1a1a1a',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {user?.id?.slice(0, 8)}...
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email</strong>
                <span style={{ color: '#888888' }}>{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>Name</strong>
                <span style={{ color: '#888888' }}>{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div style={{ 
            padding: '28px', 
            borderRadius: '16px',
            border: '1px solid #333333',
            background: loading 
              ? 'linear-gradient(135deg, #1a1a00 0%, #2a2a00 100%)' 
              : error 
              ? 'linear-gradient(135deg, #1a0000 0%, #2a0000 100%)'
              : backendUser 
              ? 'linear-gradient(135deg, #001a00 0%, #002a00 100%)'
              : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {loading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                background: loading 
                  ? 'rgba(255, 204, 0, 0.2)' 
                  : error 
                  ? 'rgba(255, 68, 68, 0.2)'
                  : backendUser 
                  ? 'rgba(68, 255, 68, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: loading 
                  ? '1px solid #ffcc00' 
                  : error 
                  ? '1px solid #ff4444'
                  : backendUser 
                  ? '1px solid #44ff44'
                  : '1px solid #666666'
              }}>
                {loading ? '⏳' : error ? '✕' : backendUser ? '✓' : '○'}
              </div>
              <div>
                <h3 style={{ 
                  margin: 0,
                  color: loading ? '#ffcc00' : error ? '#ff4444' : backendUser ? '#44ff44' : '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  letterSpacing: '-0.01em'
                }}>
                  {loading ? 'Syncing' : error ? 'Sync Failed' : backendUser ? 'Synced' : 'Ready'}
                </h3>
                <p style={{ 
                  margin: '4px 0 0 0',
                  color: loading ? '#ffcc00' : error ? '#ff4444' : backendUser ? '#44ff44' : '#888888',
                  fontSize: '14px',
                  opacity: 0.8
                }}>
                  {loading ? 'Connecting to backend...' : error ? 'Please try again' : backendUser ? 'Data synchronized' : 'Waiting to sync'}
                </p>
              </div>
            </div>
            {error && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#ff6666'
              }}>
                {error}
              </div>
            )}
            {backendUser && (
              <div style={{
                marginTop: '16px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(68, 255, 68, 0.1)',
                  border: '1px solid rgba(68, 255, 68, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#44ff44',
                  fontWeight: '500'
                }}>
                  ✓ User created
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(68, 255, 68, 0.1)',
                  border: '1px solid rgba(68, 255, 68, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#44ff44',
                  fontWeight: '500'
                }}>
                  ✓ Data stored
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: 'rgba(68, 255, 68, 0.1)',
                  border: '1px solid rgba(68, 255, 68, 0.3)',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  color: '#44ff44',
                  fontWeight: '500'
                }}>
                  ✓ Backend connected
                </span>
              </div>
            )}
          </div>
          
          {/* Backend User Data */}
          {backendUser && (
            <div style={{ 
              padding: '32px', 
              border: '1px solid #333333',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
            }}>
              <h2 style={{ 
                color: '#ffffff', 
                marginBottom: '24px', 
                fontSize: '20px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>🗄️</span>
                Backend Data
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Database ID</strong>
                  <span style={{ 
                    color: '#888888', 
                    fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                    fontSize: '14px',
                    backgroundColor: '#1a1a1a',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    #{backendUser.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Clerk ID</strong>
                  <span style={{ 
                    color: '#888888', 
                    fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                    fontSize: '14px',
                    backgroundColor: '#1a1a1a',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {backendUser.clerkUserId?.slice(0, 8)}...
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email</strong>
                  <span style={{ color: '#888888' }}>{backendUser.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Name</strong>
                  <span style={{ color: '#888888' }}>{backendUser.firstName} {backendUser.lastName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Verified</strong>
                  <span style={{ 
                    color: backendUser.emailVerified ? '#44ff44' : '#ff4444',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {backendUser.emailVerified ? '✓ Verified' : '✗ Unverified'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Status</strong>
                  <span style={{ 
                    color: backendUser.active ? '#44ff44' : '#ff4444',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}>
                    {backendUser.active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Created</strong>
                  <span style={{ color: '#888888', fontSize: '14px' }}>
                    {new Date(backendUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Updated</strong>
                  <span style={{ color: '#888888', fontSize: '14px' }}>
                    {new Date(backendUser.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
