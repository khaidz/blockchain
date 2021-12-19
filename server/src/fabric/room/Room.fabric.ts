import { getHealthRecordContract } from './CommonFuntion';
import { Room } from './RoomInterface';
export { Room } from './RoomInterface';

export async function createRoom(room: Room) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('addRoom', JSON.stringify(room));
        console.log(`Room ${room.room_name} has been registed`);
        return { success: true, result: JSON.parse(result.toString()) };
    } catch (error) {
        return { success: false, result: { error: error } };
    }
}


export async function updateRoom(roomId:string, payload: any) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('updateRoom', roomId, JSON.stringify(payload));
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function getAllRoom() {
    try {
        const contract = await getHealthRecordContract('admin');
        const roomsAsBuffer = await contract.evaluateTransaction('queryAllRoom');
        const rooms = JSON.parse(roomsAsBuffer.toString());
        return { success: true, result: { rooms } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}

export async function getAllRoomActive() {
    try {
        const contract = await getHealthRecordContract('admin');
        const roomsAsBuffer = await contract.evaluateTransaction('queryAllRoom_Active');
        const rooms = JSON.parse(roomsAsBuffer.toString());
        return { success: true, result: { rooms } };
    } catch (error) {
        return { success: false, result: { error: error } }
    }
}


export async function getRoomById(roomId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const roomAsBuffer = await contract.evaluateTransaction('queryRoomById', roomId);
        const room = JSON.parse(roomAsBuffer.toString());
        return room;
    } catch (error) {
        console.log(error);
        return null
    }
}
export async function queryRoom(userId: string, queryString: string): Promise<any> {
    try {
        const contract = await getHealthRecordContract(userId);
        const queryResult = await contract.evaluateTransaction('getQueryResultForQueryString', queryString);
        return JSON.parse(queryResult.toString());
    } catch (err) {
        throw err
    }
}
export async function getRoomByDepartmentId(dId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const roomAsBuffer = await contract.evaluateTransaction('getRoomByDepartmentId', dId);
        const room = JSON.parse(roomAsBuffer.toString());
        return room;
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function deleteRoom(roomId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('deleteRoom', roomId);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function activeRoom(roomId: string) {
    try {
        const contract = await getHealthRecordContract('admin');
        const result = await contract.submitTransaction('activeRoom', roomId);
        return JSON.parse(result.toString());
    } catch (error) {
        console.log(error);
        throw error;
    }
}