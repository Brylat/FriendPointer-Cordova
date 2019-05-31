import { firestore } from "firebase/app";

export default class CustomEventWraper {
    uid: string;
    name: string;
    ownerUid: string;
    description: string;
    limit: number;
    localization: firestore.GeoPoint;
    createDate: Date; 
    stopDate: Date;
    participants: Array<string>;
}