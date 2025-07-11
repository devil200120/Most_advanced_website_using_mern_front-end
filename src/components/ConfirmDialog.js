// frontend/src/components/ConfirmDialog.js
import React from 'react';
import Modal from './Modal';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default" // default, danger, warning
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-dialog">
        <div className={`confirm-icon ${type}`}>
          {type === 'danger' && <i className="fas fa-exclamation-triangle"></i>}
          {type === 'warning' && <i className="fas fa-exclamation-circle"></i>}
          {type === 'default' && <i className="fas fa-question-circle"></i>}
        </div>
        
        <div className="confirm-message">
          {message}
        </div>
        
        <div className="confirm-actions">
          <button 
            className="btn-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm ${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;