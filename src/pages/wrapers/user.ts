import { firestore } from "firebase/app";

export default class User {
    public uid: string;
    public name: string;
    public surname: string;
    public status: Status;
    public description: string;
    public localization: firestore.GeoPoint;
 }
 
 export enum Status {
    Hide = 0,
    PartialVisible = 1,
    Visible = 2
 }