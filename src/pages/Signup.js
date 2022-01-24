import React, { useContext, useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

import { Form, Formik } from 'formik';
import { Navigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';

import { AuthContext } from '../context/AuthContext';

const SignupSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const initialValues = {
    email: '',
    password: '',
};

const SIGNUP = gql`
    mutation Login($email: String!, $password: String!) {
        signup(email: $email, password: $password) {
            user {
                id
                email
            }
            token
        }
    }
`;

const ProcessSignup = ({ signupData }) => {
    const authContext = useContext(AuthContext);
    const [redirectOnSignup, setRedirectOnSignup] = useState(false);

    useEffect(() => {
        const { signup } = signupData;
        authContext.setAuthState(signup);
        setRedirectOnSignup(true);
    }, [authContext, signupData]);

    return <>{redirectOnSignup && <Navigate to='/' />}</>;
};

const Signup = () => {
    const [signup, { data, loading, error }] = useMutation(SIGNUP);
    const toast = useToast();

    const onSubmit = (values) => {
        signup({ variables: { ...values } });
    };

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    }, [error, toast]);

    return (
        <>
            {data && <ProcessSignup signupData={data} />}

            <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Signup to your account</Heading>
                    </Stack>
                    <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                        <Stack spacing={4}>
                            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={SignupSchema}>
                                {({ handleChange, handleSubmit }) => (
                                    <>
                                        <Form>
                                            <FormControl id='email'>
                                                <FormLabel>Email address</FormLabel>
                                                <Input
                                                    type='email'
                                                    name='email'
                                                    onChange={handleChange('email')}
                                                    isRequired
                                                />
                                            </FormControl>
                                            <FormControl id='password'>
                                                <FormLabel>Password</FormLabel>
                                                <Input
                                                    type='password'
                                                    name='password'
                                                    onChange={handleChange('password')}
                                                    isRequired
                                                />
                                            </FormControl>
                                        </Form>
                                        <Stack spacing={10}>
                                            <Stack
                                                direction={{ base: 'column', sm: 'row' }}
                                                align={'start'}
                                                justify={'space-between'}
                                            ></Stack>
                                            <Button
                                                onClick={handleSubmit}
                                                type='submit'
                                                isLoading={loading}
                                                bg={'blue.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}
                                            >
                                                Sign up
                                            </Button>
                                        </Stack>
                                    </>
                                )}
                            </Formik>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    );
};

export default Signup;
