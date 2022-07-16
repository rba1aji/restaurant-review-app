import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import { AppState } from '../../reducers/AppContext';
import { auth } from '../../configs/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const regEx = '^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$';
  const { setAlert, setLoading } = AppState();
  const navigate = useNavigate();

  function HandleSignUp(e) {
    setLoading(true);
    e.preventDefault();

    if (!password.match(regEx)) {
      setAlert({
        show: true,
        variant: 'danger',
        msg: 'Enter a strong password',
      });
      setLoading(false);
    } else if (password !== confirmPassword) {
      setAlert({
        show: true,
        variant: 'danger',
        msg: 'Password !== Confirm password',
      });
      setLoading(false);
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setAlert({
            show: true,
            variant: 'success',
            msg: `SignUp successful! Welcome ${user.email}`,
          });
          setLoading(false);
          navigate(-1);
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
  }

  return (
    <div style={{ minHeight: '60vh' }} className="modal-dialog-centered">
      <Form
        className="d-flex-inline mx-auto"
        style={{ width: '18rem' }}
        onSubmit={HandleSignUp}
      >
        <h1>Sign Up</h1>
        <Link to="/auth/login">
          <p className="text-center">Login here</p>
        </Link>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            className="border-dark"
            type="email"
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="border-dark"
            type="password"
            placeholder="^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            className="border-dark"
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
}
