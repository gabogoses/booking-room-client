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

import roomRegister from '../utils/roomRegister';
import { AuthContext } from '../context/AuthContext';

const GET_ROOMS = gql`
    query GetRooms {
        getRooms {
            id
            roomNumber
            roomImage
            events {
                id
                eventStartTime
                eventEndTime
                user {
                    id
                    email
                }
            }
        }
    }
`;

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
    const [event, { loading, error, data }] = useMutation(BOOK_EVENT);
    const { data: userData } = useQuery(ME);
    const { authState } = useContext(AuthContext);
    const { roomNumber, image, roomId, events } = props;
    const utcHour = moment.utc().format('HH');
    const [room, setRoom] = useState([]);

    useEffect(() => {
        if (userData) {
            const userEvents = userData?.me?.events;
            const roomRegistry = roomRegister(events, utcHour, userEvents, roomId);
            setRoom(roomRegistry);
        }
    }, []);
    
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
                    <ModalHeader>Book one hour slot on room: {roomNumber}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={1}>
                            {room.map((room, idx) =>
                                room.status === 'passed' ? (
                                    <Button key={idx} isDisabled color={'gray.500'}>
                                        {room.hour}
                                    </Button>
                                ) : room.status === 'booked_by_user' ?  (
                                    <Button key={idx} color={'blue.500'} isDisabled >
                                        Your slot
                                    </Button>
                                ) : (
                                    <Button
                                        key={idx}
                                        onClick={() =>
                                            onSubmit({
                                                eventName: `Meet ${authState.user.email} on room ${roomNumber}`,
                                                eventStartTime: '2022-01-21T23:00:00.000Z',
                                                roomId: roomId,
                                            })
                                        }
                                    >
                                        {room.hour}
                                    </Button>
                                )
                            )}
                        </SimpleGrid>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const Home = () => {
    const { data } = useQuery(GET_ROOMS);

    return (
        <Box maxW='7xl' mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
            <Text textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
                Book a room
            </Text>
            {data ? (
                <>
                    <SimpleGrid columns={{ base: 2, md: 5 }} spacing={10}>
                        {data.getRooms.map(({ roomNumber, roomImage, id: roomId, events }, id) => (
                            <RoomCard
                                key={id}
                                roomNumber={roomNumber}
                                image={roomImage}
                                roomId={roomId}
                                events={events}
                            />
                        ))}
                    </SimpleGrid>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Box>
    );
};
export default Home;
