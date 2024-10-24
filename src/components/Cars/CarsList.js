// src/components/Cars/CarsList.js

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Modal,
  MenuItem,
  Select,
} from '@mui/material';
import CustomDataTable from '../Table/CustomDataTable';
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from '../../services/car.service';
import { getCategories } from '../../services/category.service';

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]); // New state for categories
  const [open, setOpen] = useState(false);
  const [editCarId, setEditCarId] = useState(null);
  const [editCar, setEditCar] = useState({
    model: '',
    make: '',
    color: '',
    category: '',
    registrationNo: '',
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await getCars();
        setCars(response);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getCategories(); // Fetch categories from the API
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCars();
    fetchCategories(); // Fetch categories on mount
  }, []);

  // Updated validation schema to include 'category' and 'registrationNo'
  const validationSchema = Yup.object({
    model: Yup.string().required('Model is required'),
    make: Yup.string().required('Make is required'),
    color: Yup.string().required('Color is required'),
    category: Yup.string().required('Category is required'),
    registrationNo: Yup.string().required('Registration number is required'),
  });

  const handleOpen = () => {
    setOpen(true);
    setEditCarId(null);
    setEditCar({
      model: '',
      make: '',
      color: '',
      category: '',
      registrationNo: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async (values, { resetForm }) => {
    try {
      const createdCar = await createCar(values);
      setCars((prev) => [...prev, createdCar]);
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error creating car:', error);
    }
  };

  const handleEdit = (car) => {
    setEditCarId(car._id);
    setEditCar({
      model: car.model,
      make: car.make,
      color: car.color,
      category: car.category, // Set the category for editing
      registrationNo: car.registrationNo, // Set the registration number for editing
    });
    setOpen(true);
  };

  const handleUpdate = async (values, { resetForm }) => {
    try {
      const updatedCar = await updateCar(editCarId, values);
      setCars((prev) =>
        prev.map((car) => (car._id === editCarId ? updatedCar : car))
      );
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error updating car:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCar(id);
      setCars((prev) => prev.filter((car) => car._id !== id));
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };

  // Defining the columns for the data table
  const columns = [
    {
      name: 'Model',
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: 'Make',
      selector: (row) => row.make,
      sortable: true,
    },
    {
      name: 'Color',
      selector: (row) => row.color,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category.name,
      sortable: true,
    },
    {
      name: 'Registration Number',
      selector: (row) => row.registrationNo,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Button onClick={() => handleEdit(row)}>Edit</Button>
          <Button onClick={() => handleDelete(row._id)} color='error'>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Container component='main' maxWidth='md' sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant='h4' component='h2' align='center' gutterBottom>
          Cars
        </Typography>

        <Button variant='contained' onClick={handleOpen} sx={{ mb: 2 }}>
          Add Car
        </Button>

        {cars.length > 0 ? (
          <CustomDataTable data={cars} columns={columns} />
        ) : (
          <Typography
            variant='body1'
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            No cars available.
          </Typography>
        )}

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant='h6' component='h3' align='center' gutterBottom>
              {editCarId ? 'Edit Car' : 'Add A Car'}
            </Typography>

            <Formik
              initialValues={editCar}
              validationSchema={validationSchema}
              onSubmit={editCarId ? handleUpdate : handleCreate}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Field
                        type='text'
                        name='model'
                        placeholder='Enter model'
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage
                        name='model'
                        component='div'
                        className='text-danger'
                      />
                    </Box>

                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Field
                        type='text'
                        name='make'
                        placeholder='Enter make'
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage
                        name='make'
                        component='div'
                        className='text-danger'
                      />
                    </Box>

                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Field
                        type='text'
                        name='color'
                        placeholder='Enter color'
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage
                        name='color'
                        component='div'
                        className='text-danger'
                      />
                    </Box>

                    {/* Category Dropdown */}
                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Select
                        placeholder='Select Category'
                        name='category'
                        value={values.category}
                        onChange={(e) =>
                          setFieldValue('category', e.target.value)
                        }
                        fullWidth
                      >
                        <MenuItem value='' disabled>
                          Select Category
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <ErrorMessage
                        name='category'
                        component='div'
                        className='text-danger'
                      />
                    </Box>

                    {/* Registration Number */}
                    <Box sx={{ mb: 2, width: '100%' }}>
                      <Field
                        type='text'
                        name='registrationNo'
                        placeholder='Enter registration number'
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage
                        name='registrationNo'
                        component='div'
                        className='text-danger'
                      />
                    </Box>

                    <Button
                      variant='contained'
                      type='submit'
                      disabled={isSubmitting}
                      sx={{ width: '100%' }}
                    >
                      {isSubmitting
                        ? editCarId
                          ? 'Updating...'
                          : 'Adding...'
                        : editCarId
                        ? 'Update Car'
                        : 'Add Car'}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>
      </Paper>
    </Container>
  );
};

export default CarsList;
