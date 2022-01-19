import { Box, Flex, useColorModeValue } from '@chakra-ui/react';

const Navbar = () => {
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>Coke Day</Box>

                    <Flex alignItems={'center'}></Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;
