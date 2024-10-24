// src/components/Auth/SignIn.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { login } from '../../services/auth.service';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Form as BootstrapForm,
  Alert,
} from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SignIn = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [serverError, setServerError] = React.useState('');

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const data = await login(values);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (error) {
      console.log('err', error);
      setServerError(error.response?.data?.message || 'Login failed');
    }
    setSubmitting(false);
  };

  const handleSignupClick = () => navigate('/signup');

  return (
    <Container className='mt-5' style={{ maxWidth: '500px' }}>
      <h2 className='mb-4'>Sign In</h2>
      {serverError && <Alert variant='danger'>{serverError}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <BootstrapForm.Group className='mb-3' controlId='formEmail'>
              <BootstrapForm.Label>Email address</BootstrapForm.Label>
              <Field
                type='email'
                name='email'
                placeholder='Enter email'
                className='form-control'
              />
              <ErrorMessage
                name='email'
                component='div'
                className='text-danger'
              />
            </BootstrapForm.Group>

            <BootstrapForm.Group className='mb-3' controlId='formPassword'>
              <BootstrapForm.Label>Password</BootstrapForm.Label>
              <Field
                type='password'
                name='password'
                placeholder='Password'
                className='form-control'
              />
              <ErrorMessage
                name='password'
                component='div'
                className='text-danger'
              />
            </BootstrapForm.Group>

            <div className='d-flex justify-content-between mt-4'>
              <button
                variant='primary'
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary'
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
              <button type='submit' className='btn' onClick={handleSignupClick}>
                Sign Up
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignIn;
