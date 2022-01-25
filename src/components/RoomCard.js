import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import moment from 'moment';
import {
    Box,
    SimpleGrid,
    Text,
    Button,
    Heading,
    Image,
    Stack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import roomRegister from '../utils/roomRegister';

const BOOK_EVENT = gql`
    mutation CreateEvent($eventName: String, $eventStartTime: String, $roomId: String) {
        createEvent(eventName: $eventName, eventStartTime: $eventStartTime, roomId: $roomId) {
            id
        }
    }
`;

const ME = gql`
    query Me {
        me {
            id
            email
            events {
                eventStartTime
                roomId {
                    id
                    roomNumber
                }
            }
        }
    }
`;

const RoomCard = (props) => {
    const [event, { data }] = useMutation(BOOK_EVENT);
    const { data: userData, refetch: refetchUserData } = useQuery(ME);
    const { authState, isAuthenticated } = useContext(AuthContext);
    const { roomNumber, image, roomId, events, refetch } = props;
    const utcHour = moment.utc().format('HH');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            refetch();
            refetchUserData();
        }
    }, [data, refetch, refetchUserData]);

    useEffect(() => {
        refetch();
        refetchUserData();
        if (userData?.events) {
            const userEvents = userData.me.events;
            const roomRegistry = roomRegister(events, utcHour, userEvents, roomId);
            setRooms(roomRegistry);
        }
        const roomRegistry = roomRegister(events, utcHour, [], roomId);
        setRooms(roomRegistry);
    }, [refetch, refetchUserData, userData, events, roomId, utcHour]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const onSubmit = (values) => {
        event({ variables: { ...values } });
    };

    return (
        <>
            <Box
                onClick={onOpen}
                role={'group'}
                p={6}
                maxW={'330px'}
                w={'full'}
                bg={'white'}
                boxShadow={'2xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}
            >
                <Box
                    rounded={'lg'}
                    mt={-12}
                    pos={'relative'}
                    height={'230px'}
                    _after={{
                        transition: 'all .3s ease',
                        content: '""',
                        w: 'full',
                        h: 'full',
                        pos: 'absolute',
                        top: 5,
                        left: 0,
                        backgroundImage: `url(${image})`,
                        filter: 'blur(15px)',
                        zIndex: -1,
                    }}
                    _groupHover={{
                        _after: {
                            filter: 'blur(20px)',
                        },
                    }}
                >
                    <Image rounded={'lg'} height={230} width={282} objectFit={'cover'} src={image} />
                </Box>
                <Stack pt={10} align={'center'}>
                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                        {roomNumber.split('')[0] === 'C' ? 'Coke' : 'Pepsi'}
                    </Text>
                    <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                        {roomNumber}
                    </Heading>
                </Stack>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Book one hour on room: {roomNumber}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={1}>
                            {rooms.map((room, idx) =>
                                room.status === 'past' ? (
                                    <Button key={idx} isDisabled color={'gray.500'}>
                                        {room.hour}
                                    </Button>
                                ) : room.status === 'not_available' ? (
                                    <Button key={idx} color={'blue.500'} isDisabled>
                                        Booked
                                    </Button>
                                ) : room.status === 'booked_by_user' ? (
                                    <Button key={idx} color={'blue.800'} isDisabled>
                                        <Text fontSize='xs'>My Booking</Text>
                                    </Button>
                                ) : (
                                    <Button
                                        key={idx}
                                        onClick={(event) => {
                                            if (!isAuthenticated()) {
                                                return navigate('/login');
                                            }
                                            event.preventDefault();
                                            onSubmit({
                                                eventName: `Meet ${authState.user.email} on room ${roomNumber}`,
                                                eventStartTime: moment()
                                                    .utc()
                                                    .set({
                                                        hour: room.hour.split(':')[0],
                                                        minute: 0,
                                                        second: 0,
                                                        millisecond: 0,
                                                    }),
                                                roomId: roomId,
                                            });
                                        }}
                                    >
                                        {room.hour}
                                    </Button>
                                )
                            )}
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RoomCard;
