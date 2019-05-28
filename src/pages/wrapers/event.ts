import { firestore } from "firebase/app";
import { Timestamp } from "rxjs";

export default class Event {
    name: string;
    ownerUid: string;
    description: string;
    limit: number;
    localization: firestore.GeoPoint;
    createDate: Date; 
    participants: string[];
}