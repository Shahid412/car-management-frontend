// src/components/Layout/Navbar.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const NavigationBar = () => {
  const { auth, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          Car Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          {auth.token && (
            <Nav className='me-auto'>
              <Nav.Link as={Link} to='/dashboard'>
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to='/categories'>
                Categories
              </Nav.Link>
              <Nav.Link as={Link} to='/cars'>
                Cars
              </Nav.Link>
            </Nav>
          )}
          <Nav>
            {auth.token ? (
              <Button variant='outline-light' onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to='/signin'>
                  Sign In
                </Nav.Link>
                <Nav.Link as={Link} to='/signup'>
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
