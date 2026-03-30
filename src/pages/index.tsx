import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import Link from 'next/link'

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
          if (syncedUser.success && syncedUser.user) {
            setBackendUser(syncedUser.user)
          }
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <h1 style={{ 
          fontSize: '32px',
          fontWeight: '600',
          color: '#ffffff',
          margin: 0
        }}>
          User Sync
        </h1>
        
        {isSignedIn && (
          <nav style={{ display: 'flex', gap: '16px' }}>
            <Link 
              href="/user-management"
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
              User Management
            </Link>
            <Link 
              href="/api-demo"
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
              API Demo
            </Link>
            <Link 
              href="/database-monitor"
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
              Database Monitor
            </Link>
          </nav>
        )}
      </div>
      
      {!isSignedIn ? (
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
            Please sign in to sync your user data with the backend.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Clerk User Info Section */}
          <div style={{ 
            padding: '24px', 
            border: '1px solid #333333',
            borderRadius: '8px',
            backgroundColor: '#000000'
          }}>
            <h2 style={{ 
              color: '#ffffff', 
              marginBottom: '16px', 
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Clerk User
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>User ID</strong>
                <span style={{ 
                  color: '#888888', 
                  fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                  fontSize: '12px'
                }}>
                  {user?.id?.slice(0, 8)}...
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email</strong>
                <span style={{ color: '#888888' }}>{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <strong style={{ color: '#cccccc', fontWeight: '500' }}>Name</strong>
                <span style={{ color: '#888888' }}>{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div style={{ 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #333333',
            backgroundColor: '#000000'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                background: loading 
                  ? '#666666' 
                  : error 
                  ? '#ff4444'
                  : backendUser 
                  ? '#44ff44'
                  : '#666666',
                color: '#ffffff'
              }}>
                {loading ? '⏳' : error ? '✕' : backendUser ? '✓' : '○'}
              </div>
              <div>
                <h3 style={{ 
                  margin: 0,
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {loading ? 'Syncing' : error ? 'Sync Failed' : backendUser ? 'Synced' : 'Ready'}
                </h3>
                <p style={{ 
                  margin: '2px 0 0 0',
                  color: '#888888',
                  fontSize: '12px'
                }}>
                  {loading ? 'Connecting to backend...' : error ? 'Please try again' : backendUser ? 'Data synchronized' : 'Waiting to sync'}
                </p>
              </div>
            </div>
            {error && (
              <div style={{
                marginTop: '12px',
                padding: '8px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                border: '1px solid #ff4444',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#ff6666'
              }}>
                {error}
              </div>
            )}
          </div>
          
          {/* Backend User Data */}
          {backendUser && (
            <div style={{ 
              padding: '24px', 
              border: '1px solid #333333',
              borderRadius: '8px',
              backgroundColor: '#000000'
            }}>
              <h2 style={{ 
                color: '#ffffff', 
                marginBottom: '16px', 
                fontSize: '16px',
                fontWeight: '500'
              }}>
                Backend Data
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Database ID</strong>
                  <span style={{ 
                    color: '#888888', 
                    fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                    fontSize: '12px'
                  }}>
                    #{backendUser.id}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Clerk ID</strong>
                  <span style={{ 
                    color: '#888888', 
                    fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace', 
                    fontSize: '12px'
                  }}>
                    {backendUser.clerkUserId?.slice(0, 8)}...
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Email</strong>
                  <span style={{ color: '#888888' }}>{backendUser.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Name</strong>
                  <span style={{ color: '#888888' }}>{backendUser.firstName} {backendUser.lastName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #333333' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Status</strong>
                  <span style={{ 
                    color: backendUser.active ? '#44ff44' : '#ff4444',
                    fontWeight: '500',
                    fontSize: '12px'
                  }}>
                    {backendUser.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <strong style={{ color: '#cccccc', fontWeight: '500' }}>Created</strong>
                  <span style={{ color: '#888888', fontSize: '12px' }}>
                    {new Date(backendUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '16px', 
                padding: '12px',
                backgroundColor: 'rgba(68, 68, 68, 0.1)',
                border: '1px solid #333333',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#888888'
              }}>
                Navigate to <Link href="/user-management" style={{ color: '#ffffff', textDecoration: 'underline', margin: '0 4px' }}>
                  User Management
                </Link> to edit your profile or <Link href="/api-demo" style={{ color: '#ffffff', textDecoration: 'underline', margin: '0 4px' }}>
                  API Demo
                </Link> to test endpoints.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
