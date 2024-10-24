// src/components/Auth/SignUp.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signUp } from '../../services/auth.service';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Form as BootstrapForm,
  Alert,
} from 'react-bootstrap';

const SignUp = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');

  const initialValues = {
    name: '',
    email: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .max(50, 'Name cannot exceed 50 characters'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await signUp(values);
      setSuccessMessage(
        'Sign-up successful! Please check your email for login details.'
      );
      resetForm();
      // Redirect to Sign-In after a short delay
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Sign-up failed');
    }
    setSubmitting(false);
  };

  const handleSigninClick = () => navigate('/signin');

  return (
    <Container className='mt-5' style={{ maxWidth: '500px' }}>
      <h2 className='mb-4'>Sign Up</h2>
      {serverError && <Alert variant='danger'>{serverError}</Alert>}
      {successMessage && <Alert variant='success'>{successMessage}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <BootstrapForm.Group className='mb-3' controlId='formName'>
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <Field
                type='text'
                name='name'
                placeholder='Enter your name'
                className='form-control'
              />
              <ErrorMessage
                name='name'
                component='div'
                className='text-danger'
              />
            </BootstrapForm.Group>

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

            <div className='d-flex justify-content-between mt-4'>
              <button
                variant='primary'
                type='submit'
                disabled={isSubmitting}
                className='btn btn-primary'
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
              <button type='button' className='btn' onClick={handleSigninClick}>
                Sign In
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignUp;
