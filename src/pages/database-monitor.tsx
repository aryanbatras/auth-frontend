import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import Link from 'next/link'

export default function DatabaseMonitor() {
  const [users, setUsers] = useState<any[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)])
  }

  const fetchData = async () => {
    try {
      const response = await api.getAllUsers()
      if (response.success && response.users) {
        const newUsers = response.users
        
        // Check for changes
        if (users.length > 0) {
          const changes = newUsers.filter(newUser => {
            const oldUser = users.find(u => u.id === newUser.id)
            return oldUser && oldUser.updatedAt !== newUser.updatedAt
          })
          
          changes.forEach(user => {
            addLog(`📝 User #${user.id} (${user.firstName} ${user.lastName}) updated`)
          })
        }
        
        setUsers(newUsers)
        setLastUpdate(new Date())
      }
    } catch (err) {
      addLog(`❌ Error fetching data: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  useEffect(() => {
    if (isMonitoring) {
      fetchData()
      const interval = setInterval(fetchData, 3000)
      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const toggleMonitoring = () => {
    if (!isMonitoring) {
      addLog('🚀 Started monitoring database changes')
    } else {
      addLog('⏹️ Stopped monitoring')
    }
    setIsMonitoring(!isMonitoring)
  }

  const testDatabaseWrite = async () => {
    try {
      addLog('🧪 Testing database write...')
      
      // Find first user to update
      if (users.length > 0) {
        const testUser = users[0]
        const originalName = testUser.firstName
        
        // Update with temporary change
        const response = await api.updateUser(testUser.id, {
          firstName: `${originalName}_test`,
          lastName: testUser.lastName
        })
        
        if (response.success) {
          addLog(`✅ Updated user #${testUser.id} name to "${originalName}_test"`)
          
          // Revert after 2 seconds
          setTimeout(async () => {
            try {
              await api.updateUser(testUser.id, {
                firstName: originalName,
                lastName: testUser.lastName
              })
              addLog(`🔄 Reverted user #${testUser.id} name back to "${originalName}"`)
            } catch (err) {
              addLog(`❌ Failed to revert: ${err instanceof Error ? err.message : 'Unknown'}`)
            }
          }, 2000)
        } else {
          addLog(`❌ Failed to update: ${response.error}`)
        }
      } else {
        addLog('⚠️ No users available for testing')
      }
    } catch (err) {
      addLog(`❌ Test failed: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif', 
      maxWidth: '1400px', 
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
          Database Monitor
        </h1>
        <div style={{ width: '80px' }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Control Panel */}
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
            fontWeight: '500'
          }}>
            Control Panel
          </h2>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={toggleMonitoring}
              style={{
                padding: '8px 16px',
                backgroundColor: isMonitoring ? '#ff4444' : '#44ff44',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
            </button>
            
            <button
              onClick={testDatabaseWrite}
              disabled={!isMonitoring}
              style={{
                padding: '8px 16px',
                backgroundColor: isMonitoring ? '#4444ff' : '#666666',
                color: isMonitoring ? '#ffffff' : '#888888',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: isMonitoring ? 'pointer' : 'not-allowed'
              }}
            >
              🧪 Test Write
            </button>
          </div>
          
          <div style={{ fontSize: '12px', color: '#888888' }}>
            <div>Status: <span style={{ color: isMonitoring ? '#44ff44' : '#ff4444' }}>
              {isMonitoring ? '🟢 Active' : '🔴 Inactive'}
            </span></div>
            <div>Update Interval: 3 seconds</div>
            <div>Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}</div>
            <div>Users Tracked: {users.length}</div>
          </div>
        </div>

        {/* Statistics */}
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
            fontWeight: '500'
          }}>
            Quick Statistics
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #333333', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#44ff44' }}>
                {users.length}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>Total Users</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #333333', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#44ff44' }}>
                {users.filter(u => u.active).length}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>Active Users</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #333333', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#44ff44' }}>
                {users.filter(u => u.emailVerified).length}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>Verified Emails</div>
            </div>
            
            <div style={{ textAlign: 'center', padding: '16px', border: '1px solid #333333', borderRadius: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#ff4444' }}>
                {logs.length}
              </div>
              <div style={{ fontSize: '12px', color: '#888888' }}>Log Entries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div style={{ 
        padding: '24px', 
        border: '1px solid #333333',
        borderRadius: '8px',
        backgroundColor: '#000000',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#ffffff', 
          marginBottom: '20px', 
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Activity Log
        </h2>
        
        <div style={{ 
          backgroundColor: '#000000',
          border: '1px solid #333333',
          borderRadius: '4px',
          padding: '16px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#888888', fontSize: '12px', textAlign: 'center' }}>
              No activity yet. Start monitoring to see changes.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ 
                color: '#cccccc', 
                fontSize: '11px', 
                fontFamily: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                marginBottom: '4px',
                opacity: 1 - (index * 0.05)
              }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Users Table */}
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
          fontWeight: '500'
        }}>
          Live Users Data
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333333' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Name</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Email</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#cccccc', fontSize: '12px' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
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
                  <td style={{ padding: '8px', color: '#888888', fontSize: '12px' }}>
                    {new Date(user.updatedAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '16px',
        backgroundColor: 'rgba(68, 68, 68, 0.1)',
        border: '1px solid #333333',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#888888'
      }}>
        <strong>💡 How to verify MySQL changes:</strong><br/>
        1. Start monitoring above<br/>
        2. Go to User Management and edit a profile<br/>
        3. Watch the activity log for real-time updates<br/>
        4. Or check MySQL directly: <code style={{ color: '#44ff44' }}>mysql -u app_user -p project1_db</code>
      </div>
    </div>
  )
}
