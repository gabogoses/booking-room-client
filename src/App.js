import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthContext, AuthProvider } from './context/AuthContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Appointments from './pages/Appointments';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/',
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const LoadingFallback = () => (
    <Layout>
        <div>Loading...</div>
    </Layout>
);

const AuthenticatedRoute = ({ component: Component }) => {
    const auth = useContext(AuthContext);
    if (auth.isAuthenticated()) {
        return (
            <Layout>
                <Component />
            </Layout>
        );
    }
    return <Navigate to='/login' />;
};

const App = () => {
    return (
        <ChakraProvider>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <AuthProvider>
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                <Route path='/login' element={<Login />} />
                                <Route path='/signup' element={<Signup />} />
                                <Route path='/' element={<AuthenticatedRoute component={Home} />} />
                                <Route path='/appointments' element={<AuthenticatedRoute component={Appointments} />} />
                            </Routes>
                        </Suspense>
                    </AuthProvider>
                </BrowserRouter>
            </ApolloProvider>
        </ChakraProvider>
    );
};

export default App;
