      import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { auth } from '../../configs/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AppState } from '../../reducers/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAlert, setLoading } = AppState();
  const navigate = useNavigate();
  // const histoy=useHistory();

  const Back = useCallback(() => {
    navigate(-1);
  }, []);

  function HandleLogin(e) {
    setLoading(true);
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setAlert({
          show: true,
          variant: 'success',
          msg: `Welcome back ${user.displayName}`,
        });
        setLoading(false);
        Back();
      })
      .catch((error) => {
        setAlert({
          show: true,
          variant: 'danger',
          msg: error.message,
        });
        setLoading(false);
      });
  }

  return (
    <div
      style={{ minHeight: '60vh', zIndex: 0 }}
      className="modal-dialog-centered"
    >
      <Form
        className="d-flex-inline mx-auto justify-content-center"
        style={{ width: '18.5rem' }}
        onSubmit={HandleLogin}
      >
        <h1>Login</h1>
        <Link to="/auth/signup">
          <p className="text-center">Sign Up here</p>
        </Link>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            className="border-dark"
            type="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="border-dark"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className="text-center">
          <Button
            style={{ width: '100%' }}
            className="px-5 my-4"
            variant="dark"
            type="submit"
          >
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
