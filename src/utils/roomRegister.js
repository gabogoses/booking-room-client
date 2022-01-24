const moment = require('moment');

const generateHoursList = () => {
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

const hourList = generateHoursList();

const roomRegister = (events, currentHour, userEvents, currentRoomId) => {
    const roomRegisterList = hourList.map((hour) => {
        const splitHour = hour.split(':')[0];
        if (splitHour <= currentHour) {
            return {
                id: currentRoomId,
                hour,
                status: 'passed',
            };
        }

        for (const event of events) {
            const { eventStartTime } = event;
            const extractedHour = moment(eventStartTime).utc().format('HH');

            if (extractedHour === splitHour) {
                return {
                    id: currentRoomId,
                    hour,
                    status: 'not_available',
                };
            }
        }

        return {
            id: currentRoomId,
            hour,
            status: 'available',
        };
    });

    const filteredUserEvent = userEvents.filter((event) => event.roomId.id === currentRoomId);

    for (const userEvent of filteredUserEvent) {
        const { eventStartTime } = userEvent;
        const extractedHour = moment(eventStartTime).utc().format('HH');
        for (const hour of hourList) {
            const splitHour = hour.split(':')[0];
            if (extractedHour === splitHour) {
                roomRegisterList[hourList.indexOf(hour)].id = currentRoomId;
                roomRegisterList[hourList.indexOf(hour)].status = 'booked_by_user';
            }
        }
    }

    return roomRegisterList;
};

export default roomRegister;
