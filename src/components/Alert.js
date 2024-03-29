import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { AppState } from '../reducers/AppContext';

export default function TheAlert() {
  const [show, setShow] = useState(true);
  const { alert, setAlert } = AppState();

  function HandleClose() {
    setAlert({ show: false, variant: '', msg: '' });
  }
  alert.show && setTimeout(HandleClose, 3500);

  return (
    <div
      style={{
        left: "20%",
        bottom: "20%",
        position: 'absolute',
        zIndex: 1,
        width: 'auto',
      }}
    >
      <Alert
        className="mx-auto"
        show={alert.show}
        variant={alert.variant}
        onClose={HandleClose}
        dismissible
      >
        {alert.msg}
      </Alert>
    </div>
  );
}
