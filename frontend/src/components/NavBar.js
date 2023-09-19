import React, { useState, useContext } from 'react';
import './NavBar.css';
import logo from '../static/images/logo.png';
import { SourceContext } from '../contexts/SourceContext';

function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const { setSources } = useContext(SourceContext);

    const addSource = () => {
        if (inputValue.trim()) {
            setSources(prev => [...prev, inputValue.trim()]);
            setInputValue(''); // Clear the input after adding
            setModalOpen(false); // Close the modal after adding
        }
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar-logo">
                <img src={logo} alt="SourceSift Logo" height={30} />
            </div>

            {/* New Button */}
            <div className="navbar-items">
            </div>

            {/* User Section */}
            <div className="navbar-user">
            <button className="new-button" onClick={() => setModalOpen(true)}>
                    + New
                </button>
                <div className="user-icon">
                    🚹
                </div>
                <div className="user-dropdown">
                    <div className="dropdown-item">Profile</div>
                    <div className="dropdown-item">Logout</div>
                </div>
            </div>

        {/* Modal */}
        {modalOpen && (
            <div className="modal" onClick={() => setModalOpen(false)}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Add New Source</h2>
                    </div>
                    <div className="modal-body">
                        <input 
                            className="modal-input"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Add RSS Source URL"
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="modal-button" onClick={() => setModalOpen(false)}>Cancel</button>
                        <button className="modal-button" onClick={addSource}>Add</button>
                    </div>
                </div>
            </div>
        )}
        </nav>
    );
}

export default Navbar;