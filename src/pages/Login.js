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
                                                Sign in
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

export default Login;

// const Login = () => {
//     const [login, { data, loading, error }] = useMutation(LOGIN);

//     return (
//         <>
//             {data && <ProcessLogin loginData={data} />}

//             <section className='w-full sm:w-1/2 h-screen m-auto p-8 sm:pt-10'>
//                 <Card>
//                     <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
//                         <div className='max-w-md w-full'>
//                             <div>
//                                 <div className='w-32 m-auto mb-6'>
//                                     <img src={logo} alt='Logo' />
//                                 </div>
//                                 <h2 className='mb-2 text-center text-3xl leading-9 font-extrabold text-gray-900'>
//                                     Log in to your account
//                                 </h2>
//                                 <p className='text-gray-600 text-center'>
//                                     <Link to='/signup'></Link>
//                                 </p>
//                             </div>
//                             <Formik
//                                 initialValues={{
//                                     email: '',
//                                     password: '',
//                                 }}
//                                 onSubmit={(values) =>
//                                     login({
//                                         variables: { ...values },
//                                     })
//                                 }
//                                 validationSchema={LoginSchema}
//                             >
//                                 {() => (
//                                     <Form className='mt-8'>
//                                         {data && <FormSuccess text={data.login.message} />}
//                                         {error && <FormError text={error.message} />}
//                                         <div>
//                                             <div className='mb-2'>
//                                                 <div className='mb-1'>
//                                                     <Label text='Email' />
//                                                 </div>
//                                                 <FormInput
//                                                     ariaLabel='Email'
//                                                     name='email'
//                                                     type='text'
//                                                     placeholder='Email'
//                                                 />
//                                             </div>
//                                             <div>
//                                                 <div className='mb-1'>
//                                                     <Label text='Password' />
//                                                 </div>
//                                                 <FormInput
//                                                     ariaLabel='Password'
//                                                     name='password'
//                                                     type='password'
//                                                     placeholder='Password'
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className='mt-6'>
//                                             <GradientButton type='submit' text='Log In' loading={loading} />
//                                         </div>
//                                     </Form>
//                                 )}
//                             </Formik>
//                         </div>
//                     </div>
//                 </Card>
//             </section>
//         </>
//     );
// };

// export default Login;
