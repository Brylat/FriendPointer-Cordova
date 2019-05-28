import { firestore } from "firebase/app";

export default class User {
   public name: string;
   public surname: string;
   public status: Status; //#AJ create enum 
   public description: string;
   public localization: firestore.GeoPoint;
}

export enum Status {
   Hide = 0,
   PartialVisible = 1,
   Visible = 2
}