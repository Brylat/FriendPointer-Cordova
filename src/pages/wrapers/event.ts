import { firestore } from "firebase/app";

export default class Event {
    name: string;
    ownerUid: string;
    description: string;
    limit: number;
    localization: firestore.GeoPoint;
    createDate: Date; 
    participants: string[];
}