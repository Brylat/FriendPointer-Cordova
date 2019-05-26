import { firestore } from "firebase/app";

export default class User {
   public name: string;
   public surname: string;
   public age: number;
   public status: number; //#AJ create enum 
   public description: string;
   public localization: firestore.GeoPoint;
}