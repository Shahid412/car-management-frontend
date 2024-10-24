// src/components/CategoriesList.js
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
} from '@mui/material';
import CustomDataTable from '../Table/CustomDataTable';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../../services/category.service';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: '' });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        // Ensure the response is an array
        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          console.error('Expected an array but received:', response);
          setCategories([response]); // Convert to array if it's a single object
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
  });

  const handleOpen = () => {
    setOpen(true);
    setEditCategoryId(null);
    setEditCategory({ name: '' });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async (values, { resetForm }) => {
    try {
      const createdCategory = await createCategory(values);
      setCategories((prev) => [...prev, createdCategory]);
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditCategoryId(category._id);
    setEditCategory({ name: category.name });
    setOpen(true);
  };

  const handleUpdate = async (values, { resetForm }) => {
    try {
      const updatedCategory = await updateCategory(editCategoryId, values);
      setCategories((prev) =>
        prev.map((category) =>
          category._id === editCategoryId ? updatedCategory : category
        )
      );
      resetForm();
      handleClose();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category._id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const columns = [
    {
      name: 'Category Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div>
          <Button
            onClick={() => handleEdit(row)}
            variant='outlined'
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(row._id)}
            variant='outlined'
            color='error'
          >
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
          Categories
        </Typography>

        <Button variant='contained' onClick={handleOpen} sx={{ mb: 2 }}>
          Add Category
        </Button>

        {categories.length > 0 ? (
          <CustomDataTable data={categories} columns={columns} />
        ) : (
          <Typography variant='body1'>No categories available.</Typography>
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
              {editCategoryId ? 'Edit Category' : 'Add A Category'}
            </Typography>

            <Formik
              initialValues={editCategoryId ? editCategory : { name: '' }}
              validationSchema={validationSchema}
              onSubmit={editCategoryId ? handleUpdate : handleCreate}
            >
              {({ isSubmitting }) => (
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
                        name='name'
                        placeholder='Enter category name'
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                        }}
                      />
                      <ErrorMessage
                        name='name'
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
                        ? editCategoryId
                          ? 'Updating...'
                          : 'Adding...'
                        : editCategoryId
                        ? 'Update Category'
                        : 'Add Category'}
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

export default CategoriesList;
