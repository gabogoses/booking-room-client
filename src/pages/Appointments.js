import { useEffect } from 'react';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Spacer } from '@chakra-ui/react';
import { useMutation, useQuery, gql } from '@apollo/client';
import moment from 'moment';

const ME = gql`
    query Me {
        me {
            id
            email
            events {
                id
                eventStartTime
                roomId {
                    id
                    roomNumber
                }
            }
        }
    }
`;

const CANCEL_EVENT = gql`
    mutation DeleteEvent($eventId: ID) {
        deleteEvent(eventId: $eventId) {
            message
        }
    }
`;

const Appointments = () => {
    const { data, refetch } = useQuery(ME);
    const [cancelEvent, {loading, error, data: mutationData}] = useMutation(CANCEL_EVENT);

    useEffect(() => {
        if (mutationData?.deleteEvent?.message === 'Event deleted') {
            refetch();
        }
    },[mutationData, data]);

    const hasEvents = data?.me?.events?.length > 0;
    const events = data?.me?.events;

    const onSubmit = (values) => {
        cancelEvent({ variables: { ...values } });
    };

    return (
        <Box maxW='7xl' mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
            {hasEvents ? (
                <>
                    <Table align='center' fontSize='xl' variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Room Number</Th>
                                <Th>Start Time</Th>
                                <Th>Duration</Th>
                                <Th isNumeric>Actions</Th>
                            </Tr>
                        </Thead>
                        {events.map(({ id, eventStartTime, roomId: { roomNumber } }) => (
                            <Tbody>
                                <Tr>
                                    <Td>{roomNumber}</Td>
                                    <Td>{moment(eventStartTime).utc().format('HH:mm')}</Td>
                                    <Td>60 minutes</Td>
                                    <Td isNumeric>
                                        <Button
                                            onClick={() =>
                                                onSubmit({
                                                    eventId: `${id}`,
                                                })
                                            }
                                        >
                                        Cancel
                                        </Button>
                                    </Td>
                                </Tr>
                            </Tbody>
                        ))}
                    </Table>
                    <Spacer />
                </>
            ) : (
                <Text align='center' fontSize='3xl'>
                    You have no events booked
                </Text>
            )}
        </Box>
    );
};

export default Appointments;
