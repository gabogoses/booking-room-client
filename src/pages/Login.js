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
    Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';

const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const initialValues = {
    email: '',
    password: '',
};

const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            user {
                id
                email
            }
            token
        }
    }
`;

const ProcessLogin = ({ loginData }) => {
    const authContext = useContext(AuthContext);
    const [redirectOnLogin, setRedirectOnLogin] = useState(false);

    useEffect(() => {
        const { login } = loginData;
        authContext.setAuthState(login);
        setRedirectOnLogin(true);
    }, [authContext, loginData]);

    return <>{redirectOnLogin && <Navigate to='/' />}</>;
};

const Login = () => {
    const [login, { data, loading, error }] = useMutation(LOGIN);
    const toast = useToast();

    const onSubmit = (values) => {
        login({ variables: { ...values } });
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
            <Layout />
            {data && <ProcessLogin loginData={data} />}

            <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    </Stack>
                    <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                        <Stack spacing={4}>
                            <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={LoginSchema}>
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
                                        <Stack>
                                            <Stack
                                                direction={{ base: 'column', sm: 'row' }}
                                                align={'start'}
                                                justify={'space-between'}
                                            ></Stack>
                                            <Button
                                                onClick={handleSubmit}
                                                type='submit'
                                                isLoading={loading}
                                                bg={'red.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'red.500',
                                                }}
                                            >
                                                Sign in
                                            </Button>
                                            <Text align={'center'}>
                                                Don't have an account yet?{' '}
                                                <Link to='/signup'>
                                                    {' '}
                                                    <Text color={'blue.400'}>Signup</Text>
                                                </Link>
                                            </Text>
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

export default Login;
