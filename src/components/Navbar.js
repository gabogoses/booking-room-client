import { useState, useEffect } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import moment from 'moment';

const Time = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => setTime(moment().utc().format('HH:mm:ss')), 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div>
            <p>{`${time} GMT`} </p>
        </div>
    );
};

const Navbar = () => {
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>Coke Day</Box>
                    <Time />
                    <Flex alignItems={'center'}></Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;
