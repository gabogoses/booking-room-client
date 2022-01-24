import { useState, useEffect, useContext } from 'react';
import {
    Box,
    Text,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Stack,
    Center,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/AuthContext';

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
    const { authState, logout } = useContext(AuthContext);
    const { user } = authState;

    return (
        <>
            <Box bg={'gray.100'} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Text>
                        <Link to='/'>Coke Day</Link>
                    </Text>
                    <Time />
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Menu>
                                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                                    <Avatar bg='teal.500' size={'sm'} />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <br />
                                    <Center>
                                        <Avatar size={'md'} bg='teal.500' />
                                    </Center>
                                    <br />
                                    <Center>
                                        <Text>{user.email}</Text>
                                    </Center>
                                    <br />
                                    <MenuDivider />
                                    <MenuItem>
                                        <Link to='/appointments'>My appointments</Link>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => {
                                            logout();
                                        }}
                                    >
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
};

export default Navbar;
