import { useQuery, gql } from '@apollo/client';
import { Box, SimpleGrid, Text, Container, Flex, HStack, Button, Spacer } from '@chakra-ui/react';

const GET_ROOMS = gql`
    query GetRooms {
        getRooms {
            id
            roomNumber
            events {
                id
                eventStartTime
                eventEndTime
                user {
                    id
                    email
                    password
                }
            }
        }
    }
`;

const getHourList = () => {
    const hourList = [];
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            hourList.push(`0${i}:00`);
        } else {
            hourList.push(`${i}:00`);
        }
    }
    return hourList;
};

const Home = () => {
    const { data } = useQuery(GET_ROOMS);

    const hourList = getHourList();
    console.log(hourList);
    return (
        <Container>
            {data ? (
                <>
                    {hourList.map((hour) => {
                        return (
                            <Flex style={{ backgroundColor: 'red', flexDirection: 'row' }}>
                                <Container style={{ flex: 0.1, backgroundColor: 'green' }}>
                                    <Text style={{ width: 50 }}>{hour}</Text>
                                </Container>
                                <Button colorScheme='blue' variant='outline' style={{ flex: 3 }}></Button>
                            </Flex>
                        );
                    })}

                    {/* <SimpleGrid columns={10} spacing={4}>
                            {data.getRooms.map((room, id) => (
                                <Box key={id} bg='tomato' w='100%' p={4} color='white'>
                                    <Text> {room.roomNumber} </Text>
                                    <SimpleGrid columns={2} spacing={4}>
                                        {hourList.map((hour, id) => (
                                            <Box bg='blue' w='100%' p={4} color='white'>
                                                {hour}
                                            </Box>
                                        ))}
                                    </SimpleGrid>
                                </Box>
                            ))}
                        </SimpleGrid> */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    );
};
export default Home;
