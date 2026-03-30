import { useState } from 'react'
import { api, User, UserUpdateRequest } from '../lib/api'
import Link from 'next/link'

export default function ApiDemo() {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endpoints = [
    {
      id: 'sync',
      method: 'POST',
      path: '/api/user/sync',
      description: 'Sync user data from Clerk to backend',
      curl: `curl -X POST http://localhost:8080/api/user/sync \\
  -H "Content-Type: application/json" \\
  -d '{
    "clerkUserId": "user_2abcdef123456789",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true
  }'`,
      handler: async () => {
        const response = await api.syncUser({
          clerkUserId: "user_2abcdef123456789",
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          emailVerified: true
        })
        return response
      }
    },
    {
      id: 'get-user-id',
      method: 'GET',
      path: '/api/user/{id}',
      description: 'Get user by database ID',
      curl: `curl -X GET http://localhost:8080/api/user/1 \\
  -H "Content-Type: application/json"`,
      handler: async () => {
        const response = await api.getUserById(1)
        return response
      }
    },
    {
      id: 'get-all-users',
      method: 'GET',
      path: '/api/user',
      description: 'Get all users',
      curl: `curl -X GET http://localhost:8080/api/user \\
  -H "Content-Type: application/json"`,
      handler: async () => {
        const response = await api.getAllUsers()
        return response
      }
    },
    {
      id: 'update-user',
      method: 'PUT',
      path: '/api/user/{id}',
      description: 'Update user profile',
      curl: `curl -X PUT http://localhost:8080/api/user/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "phoneNumber": "+1234567890",
    "username": "johndoe",
    "profileImageUrl": "https://example.com/avatar.jpg"
  }'`,
      handler: async () => {
        const response = await api.updateUser(1, {
          firstName: "John Updated",
          lastName: "Doe Updated",
          phoneNumber: "+1234567890",
          username: "johndoe",
          profileImageUrl: "https://example.com/avatar.jpg"
        })
        return response
      }
    },
    {
      id: 'update-status',
      method: 'PATCH',
      path: '/api/user/{id}/status',
      description: 'Update user active status',
      curl: `curl -X PATCH http://localhost:8080/api/user/1/status \\
  -H "Content-Type: application/json" \\
  -d '{"active": false}'`,
      handler: async () => {
        const response = await api.updateUserStatus(1, false)
        return response
      }
    },
    {
      id: 'delete-user',
      method: 'DELETE',
      path: '/api/user/{id}',
      description: 'Delete user',
      curl: `curl -X DELETE http://localhost:8080/api/user/1 \\
  -H "Content-Type: application/json"`,
      handler: async () => {
        const response = await api.deleteUser(1)
        return response
      }
    }
  ]

  const testEndpoint = async (endpoint: typeof endpoints[0]) => {
    try {
      setLoading(true)
      setError(null)
      setApiResponse(null)
      
      const response = await endpoint.handler()
      setApiResponse(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('Copied to clipboard!')
    setTimeout(() => setSuccess(null), 2000)
  }

  const [success, setSuccess] = useState<string | null>(null)

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#44ff44'
      case 'POST': return '#4444ff'
      case 'PUT': return '#ffaa44'
      case 'PATCH': return '#ff44ff'
      case 'DELETE': return '#ff4444'
      default: return '#888888'
    }
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
          API Demo
        </h1>
        <div style={{ width: '80px' }}></div>
      </div>

      <div style={{ marginBottom: '40px' }}>
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
            User Management API
          </h2>
          <p style={{ 
            color: '#888888', 
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            Interactive API documentation with live testing capabilities.
          </p>
          
          <div style={{ 
            padding: '12px',
            backgroundColor: 'rgba(68, 68, 68, 0.1)',
            border: '1px solid #333333',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#888888'
          }}>
            <strong>Backend URL:</strong> http://localhost:8080 | <strong>Frontend API Routes:</strong> /api/*
          </div>
        </div>
      </div>

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

      <div style={{ display: 'grid', gap: '16px' }}>
        {endpoints.map((endpoint) => (
          <div key={endpoint.id} style={{ 
            border: '1px solid #333333',
            borderRadius: '8px',
            backgroundColor: '#000000',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveEndpoint(activeEndpoint === endpoint.id ? null : endpoint.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderBottom: activeEndpoint === endpoint.id ? '1px solid #333333' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: getMethodColor(endpoint.method),
                  color: '#000000',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {endpoint.method}
                </span>
                <code style={{ 
                  color: '#44ff44', 
                  fontSize: '14px',
                  fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
                }}>
                  {endpoint.path}
                </code>
                <span style={{ 
                  color: '#888888', 
                  fontSize: '12px',
                  marginLeft: 'auto'
                }}>
                  {activeEndpoint === endpoint.id ? '▼' : '▶'}
                </span>
              </div>
              <p style={{ 
                color: '#cccccc', 
                fontSize: '12px',
                margin: 0
              }}>
                {endpoint.description}
              </p>
            </div>

            {activeEndpoint === endpoint.id && (
              <div style={{ padding: '20px', borderTop: '1px solid #333333' }}>
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    color: '#ffffff', 
                    marginBottom: '12px', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Backend Curl Command
                  </h3>
                  <div style={{ 
                    position: 'relative',
                    backgroundColor: '#000000',
                    border: '1px solid #333333',
                    borderRadius: '4px',
                    padding: '12px'
                  }}>
                    <pre style={{ 
                      margin: 0,
                      color: '#ffffff',
                      fontSize: '11px',
                      fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto'
                    }}>
                      {endpoint.curl}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(endpoint.curl)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#333333',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    color: '#ffffff', 
                    marginBottom: '12px', 
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Live Test (via Next.js API Routes)
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => testEndpoint(endpoint)}
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
                      {loading ? 'Testing...' : 'Test Endpoint'}
                    </button>
                    <button
                      onClick={() => {
                        setApiResponse(null)
                        setError(null)
                      }}
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
                      Clear Response
                    </button>
                  </div>
                </div>

                {error && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '12px',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    border: '1px solid #ff4444',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#ff6666'
                  }}>
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {apiResponse && (
                  <div>
                    <h3 style={{ 
                      color: '#ffffff', 
                      marginBottom: '12px', 
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      API Response
                    </h3>
                    <div style={{ 
                      backgroundColor: '#000000',
                      border: '1px solid #333333',
                      borderRadius: '4px',
                      padding: '12px'
                    }}>
                      <pre style={{ 
                        margin: 0,
                        color: '#ffffff',
                        fontSize: '11px',
                        fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto'
                      }}>
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '24px', border: '1px solid #333333', borderRadius: '8px', backgroundColor: '#000000' }}>
        <h2 style={{ color: '#ffffff', marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>
          Architecture Note
        </h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <h3 style={{ color: '#cccccc', marginBottom: '4px', fontSize: '14px' }}>Next.js API Routes</h3>
            <p style={{ color: '#888888', fontSize: '12px', lineHeight: '1.5' }}>
              Frontend calls internal Next.js API routes (<code style={{ color: '#44ff44' }}>/api/*</code>), which then proxy requests to the Spring Boot backend.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#cccccc', marginBottom: '4px', fontSize: '14px' }}>Direct Backend Access</h3>
            <p style={{ color: '#888888', fontSize: '12px', lineHeight: '1.5' }}>
              The curl commands show direct backend access for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
