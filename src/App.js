import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

console.log(process.env.GRAPHQL_API_URL);

const client = new ApolloClient({
    uri: 'https://booking-room-app-server.herokuapp.com/',
    cache: new InMemoryCache(),
    request: (operation) => {
        const token = localStorage.getItem('token');
        if (token) {
            operation.setContext({
                headers: { Authorization: `${token}` },
            });
        }
    },
    onError: ({ networkError, graphQLErrors }) => {
        if (graphQLErrors) {
            const unauthorizedErrors = graphQLErrors.filter((error) => error.extensions.code === 'UNAUTHENTICATED');
            if (unauthorizedErrors.length) {
                window.location = '/login';
            }
        }
    },
});

const LoadingFallback = () => (
    <Layout>
        <div className='p-4'>Loading...</div>
    </Layout>
);

const AuthenticatedRoute = ({ children, ...rest }) => {
    const auth = useContext(AuthContext);
    return (
        <Routes>
            <Route
                {...rest}
                render={() => (auth.isAuthenticated() ? <Layout>{children}</Layout> : <Navigate to='/' />)}
            ></Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => (
    <Layout>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
        </Routes>
    </Layout>
);

const AppRoute = () => (
    <>
        <Suspense fallback={<LoadingFallback />}>
            <UnauthenticatedRoutes />
        </Suspense>
    </>
);

const App = () => {
    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <AuthProvider>
                        <AuthenticatedRoute path='/' />
                        <AppRoute />
                    </AuthProvider>
                </BrowserRouter>
            </ApolloProvider>
        </ChakraProvider>
    );
};

export default App;
