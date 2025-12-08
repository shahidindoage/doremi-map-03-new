'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminMenu({ adminRole }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showDeleteChildModal, setShowDeleteChildModal] = useState(false);
  const [username, setUsername] = useState(''); 
  const menuRef = useRef(null);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  // Child admin states
  const [childAdmins, setChildAdmins] = useState([]);
  const [newChildUsername, setNewChildUsername] = useState('');
  const [newChildPassword, setNewChildPassword] = useState('');
  const [loadingChild, setLoadingChild] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch child admins
  const fetchChildAdmins = async () => {
    try {
      const res = await fetch('/api/admin/child-admins');
      const json = await res.json();
      if (res.ok) setChildAdmins(json.managers);
    } catch {}
  };

  // Add child admin
  // const handleAddChildAdmin = async () => {
  //   if (!newChildUsername || !newChildPassword) return alert('Fill all fields');
  //   setLoadingChild(true);
  //   try {
  //     const res = await fetch('/api/admin/child-admins', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username: newChildUsername, password: newChildPassword }),
  //     });
  //     const json = await res.json();
  //     if (res.ok) {
  //       alert('✅ Manager added');
  //       setNewChildUsername('');
  //       setNewChildPassword('');
  //       fetchChildAdmins();
  //     } else {
  //       alert(`❌ ${json.error}`);
  //     }
  //   } catch {
  //     alert('Server error');
  //   } finally {
  //     setLoadingChild(false);
  //   }
  // };

  // Delete child admin
  // const handleDeleteChildAdmin = async (id) => {
  //   if (!confirm('⚠️ Delete this Manager?')) return;
  //   try {
  //     const res = await fetch(`/api/admin/child-admins?id=${id}`, { method: 'DELETE' });
  //     const json = await res.json();
  //     if (res.ok || json.success) {
  //       alert('✅ Deleted successfully');
  //       fetchChildAdmins();
  //     } else {
  //       alert('❌ Failed to delete');
  //     }
  //   } catch {
  //     alert('Server error');
  //   }
  // };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      alert('Logout failed');
    }
  };

  // Reset Password
  // Example assuming adminUsername is passed as prop
const handleResetPassword = async (username, currentPass, newPass, confirmPass) => {
  if (!username || !currentPass || !newPass || !confirmPass) return alert('Fill all fields.');
  if (newPass !== confirmPass) return alert('New passwords do not match.');
  setLoading(true);

  try {
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, currentPass, newPass }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Password reset successfully!');
      setShowResetModal(false);
      setUsername('');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      alert(`❌ ${data.error}`);
    }
  } catch {
    alert('Server error.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Admin menu"
        style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#d6af66' }}
      >
        ⋮
      </button>

      {open && (
        <div style={dropdownStyle}>
          <DropdownItem icon="⭐" text="Event Page" as={Link} href="/event/grand-music-night-2025" onClick={() => setOpen(false)} />
          <DropdownItem icon="💰" text="Bookings" as={Link} href="/admin/bookings" onClick={() => setOpen(false)} />

          {adminRole === 'OWNER' && (
            <>
              <DropdownItem icon="🔑" text="Reset Password" onClick={() => setShowResetModal(true)} />
              {/* <DropdownItem icon="➕" text="Add Managers" onClick={() => { setShowAddChildModal(true); }} />
              <DropdownItem icon="❌" text="Delete Managers" onClick={() => { setShowDeleteChildModal(true); fetchChildAdmins(); }} /> */}
            </>
          )}

          <div style={dividerStyle}></div>
          <DropdownItem icon="🚪" text="Logout" onClick={handleLogout} />
        </div>
      )}

      {/* Reset Password Modal */}
    {showResetModal && (
  <ResetPasswordModal
    {...{
      username,
      setUsername,
      currentPass,
      setCurrentPass,
      newPass,
      setNewPass,
      confirmPass,
      setConfirmPass,
      handleResetPassword,
      loading,
      setShowResetModal
    }}
  />
)}

      {/* Add Child Admin Modal */}
      {showAddChildModal && (
        <ChildAdminAddModal
          {...{ newChildUsername, setNewChildUsername, newChildPassword, setNewChildPassword, handleAddChildAdmin, loadingChild, setShowAddChildModal }}
        />
      )}

      {/* Delete Child Admin Modal */}
      {showDeleteChildModal && (
        <ChildAdminDeleteModal
          {...{ childAdmins, handleDeleteChildAdmin, setShowDeleteChildModal }}
        />
      )}
    </div>
  );
}

// Dropdown Item
function DropdownItem({ icon, text, onClick, href, as: Component = 'button', danger = false }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: danger ? '#ff6b6b' : '#fff',
    background: 'transparent',
    border: 'none',
    textDecoration: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'playfair-display-v2',
    fontWeight: '100',
  };
  const hoverStyle = { background: 'rgba(255,255,255,0.08)', transform: 'translateX(3px)' };
  const [hover, setHover] = React.useState(false);

  return (
    <Component
      href={href}
      onClick={onClick}
      style={{ ...baseStyle, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span style={{ width: 20, textAlign: 'center' }}>{icon}</span>
      <span>{text}</span>
    </Component>
  );
}

// Modals
function ResetPasswordModal({
  username, setUsername,
  currentPass, setCurrentPass,
  newPass, setNewPass,
  confirmPass, setConfirmPass,
  handleResetPassword,
  loading, setShowResetModal
}) {
  // Wrapper to include username in reset
  const onSubmit = () => {
    if (!username) return alert('Username is required');
    handleResetPassword(username, currentPass, newPass, confirmPass);
  };

  return (
    <div style={modalOverlay}>
      <div style={modalStyle}>
        <h3>Reset Password</h3>

        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Current Password"
          value={currentPass}
          onChange={e => setCurrentPass(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPass}
          onChange={e => setConfirmPass(e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
          <button onClick={() => setShowResetModal(false)} style={buttonStyleSecondary}>Cancel</button>
          <button onClick={onSubmit} style={buttonStylePrimary} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}


function ChildAdminAddModal({ newChildUsername, setNewChildUsername, newChildPassword, setNewChildPassword, handleAddChildAdmin, loadingChild, setShowAddChildModal }) {
  return (
    <div style={modalOverlay}>
      <div style={{ ...modalStyle, width: 400 }}>
        <h3>Add Managers</h3>
        <input style={inputStyle} placeholder="Username" value={newChildUsername} onChange={e => setNewChildUsername(e.target.value)} />
        <input style={{ ...inputStyle, marginTop: 6 }} placeholder="Password" type="password" value={newChildPassword} onChange={e => setNewChildPassword(e.target.value)} />
        <button style={{ ...buttonStylePrimary, marginTop: 6 }} onClick={handleAddChildAdmin} disabled={loadingChild}>
          {loadingChild ? 'Adding...' : 'Add'}
        </button>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button style={buttonStyleSecondary} onClick={() => setShowAddChildModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}

function ChildAdminDeleteModal({ childAdmins, handleDeleteChildAdmin, setShowDeleteChildModal }) {
  return (
    <div style={modalOverlay}>
      <div style={{ ...modalStyle, width: 400 }}>
        <h3>Delete Managers</h3>
        <div style={{ maxHeight: 250, overflowY: 'auto' }}>
          {childAdmins.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span>{c.username}</span>
              <button style={buttonStyleSecondary} onClick={() => handleDeleteChildAdmin(c.id)}>Delete</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <button style={buttonStyleSecondary} onClick={() => setShowDeleteChildModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const dropdownStyle = {
  position: 'absolute', right: 0, top: '110%', background: '#1e1e1e',
  border: '1px solid #333', borderRadius: 10, width: 190, overflow: 'hidden',
  boxShadow: '0 8px 18px rgba(0,0,0,0.45)', zIndex: 1000, fontFamily: 'playfair-display-v2',
};
const dividerStyle = { height: 1, background: '#333', margin: '4px 0' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 };
const modalStyle = { background: '#222', padding: 20, borderRadius: 10, width: 320, display: 'flex', flexDirection: 'column', gap: 8 };
const inputStyle = { padding: '8px 10px', borderRadius: 6, border: '1px solid #555', background: '#111', color: '#fff' };
const buttonStylePrimary = { padding: '6px 12px', borderRadius: 6, border: 'none', background: '#d6af66', color: '#000', cursor: 'pointer' };
const buttonStyleSecondary = { padding: '6px 12px', borderRadius: 6, border: '1px solid #555', background: '#222', color: '#fff', cursor: 'pointer' };
