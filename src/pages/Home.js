import { useQuery, gql } from '@apollo/client';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

import RoomCard from '../components/RoomCard';

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

const Home = () => {
    const { data, refetch } = useQuery(GET_ROOMS);

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
                                refetch={refetch}
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
