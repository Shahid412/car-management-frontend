// src/components/Dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const Dashboard = () => {
  const [carCount, setCarCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCarCount = async () => {
    try {
      const response = await api.get('/cars');
      setCarCount(response.data.length);
    } catch (err) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCarCount();
  }, []);

  return (
    <Container className='mt-5'>
      <h2>Dashboard</h2>
      {loading ? (
        <Spinner animation='border' />
      ) : error ? (
        <Alert variant='danger'>Failed to fetch car data.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Card.Title>Total Registered Cars</Card.Title>
            <Card.Text style={{ fontSize: '2rem' }}>{carCount}</Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
