import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import Logo from '../svg/Logo';

const YEAR = new Date().getFullYear();

const Footer = () => {
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} color={useColorModeValue('gray.700', 'gray.200')}>
            <Box py={10}>
                <Flex
                    align={'center'}
                    _before={{
                        content: '""',
                        borderBottom: '1px solid',
                        borderColor: useColorModeValue('gray.200', 'gray.700'),
                        flexGrow: 1,
                        mr: 8,
                    }}
                    _after={{
                        content: '""',
                        borderBottom: '1px solid',
                        borderColor: useColorModeValue('gray.200', 'gray.700'),
                        flexGrow: 1,
                        ml: 8,
                    }}
                >
                    <Logo />
                </Flex>
                <Text pt={6} fontSize={'sm'} textAlign={'center'}>
                    {YEAR} Coke Day
                </Text>
            </Box>
        </Box>
    );
};

export default Footer;
