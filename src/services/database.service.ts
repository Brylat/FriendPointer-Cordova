import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import User from '../pages/wrapers/user';
import CustomEventWrapper from '../pages/wrapers/event';
import { Geolocation } from '@ionic-native/geolocation';
import { getCurrentDebugContext } from '@angular/core/src/view/services';

@Injectable()
export class DatabaseService {
    constructor(private authService: AuthService, private geolocation: Geolocation) { }

    public async getCurrentUserData(): Promise<User> {
        const snapshot = await firebase.firestore().collection('users')
            .doc(this.authService.getUID()).get();
            return snapshot.exists ? snapshot.data() as User : null;
    }

    public async createOrUpdateUser(user: User) {
        user.uid = this.authService.getUID();
        await firebase.firestore().collection('users')
            .doc(this.authService.getUID())
            .set(JSON.parse(JSON.stringify(user)), { merge: true });
        await firebase.firestore().collection('users')
            .doc(this.authService.getUID())
            .update({ localization: new firebase.firestore.GeoPoint(user.localization.latitude, user.localization.longitude) });
    }

    public async updateCurrentUserLocation(newLocalizatation: firebase.firestore.GeoPoint) {
        await firebase.firestore().collection('users')
            .doc(this.authService.getUID())
            .update({ localization: newLocalizatation });
    }

    public async addFriend(uid: string) {
        var docRef = await firebase.firestore().collection('users')
            .doc(this.authService.getUID());
            firebase.firestore().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                var largerArray: any[] = snapshot.get('friends');
                if(largerArray == null){
                    largerArray = new Array<String>();
                }
                largerArray.push(uid);
                transaction.update(docRef, 'friends', largerArray);
            });
        });
    }

    public async deleteFriend(uid: string) {
        var docRef = await firebase.firestore().collection('users')
            .doc(this.authService.getUID());
            firebase.firestore().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray: any[] = snapshot.get('friends');
                transaction.update(docRef, 'friends', largerArray.filter(x => x !== uid));
            });
        });
    }

    public async getAllFriendsData() {
        const snapshot = await firebase.firestore().collection('users')
            .doc(this.authService.getUID()).get();
        let friendsIds = snapshot.data().friends;
        if(!friendsIds) friendsIds = [];
        const usersRef = firebase.firestore().collection('users');
        let users: User[];
        try {
            users = (await Promise.all(friendsIds.map(id => usersRef.doc(id).get())))
            .map((doc: any) => (doc.data()));

        } catch (error) {
            console.log(`received an error in getUsers method in module \`db/users\`:`, error);
            return users;
        }
        return users as User[];
    }

    public async getAllFriendsIds(): Promise<string[]> {
        const snapshot = await firebase.firestore().collection('users')
            .doc(this.authService.getUID()).get();
        return snapshot.data().friends as string[];
    }

    public async getAllUsers(): Promise<User[]> {
        const snapshot = await firebase.firestore().collection('users').where("status", ">", 0).get();
        return this.filterUserForFriendOnly(snapshot.docs.map(doc => doc.data() as User));
    }

    private async filterUserForFriendOnly(users: User[]) {
        if(!users) return [];
        const myUid = await this.authService.getUID();
        const filterUsers = users.filter(x => {
            if(x.status > 1 || (x.friends && x.friends.length > 0 && x.friends.indexOf(myUid) > -1)){
                return x;
            }
        })
        return filterUsers;
    }

    public async getAllEvents(): Promise<CustomEventWrapper[]> {
        const snapshot = await firebase.firestore().collection('events').get()
        return snapshot.docs.map(doc => doc.data() as CustomEventWrapper).filter(x => new Date(x.stopDate).getTime() >= new Date().getTime());
    }

    public async getNearEvent() {
        let position = await this.geolocation.getCurrentPosition();
        const myUid = await this.authService.getUID();
        // ~1 mile of lat and lon in degrees
        let lat = 0.0144927536231884
        let lon = 0.0181818181818182
        let distance = 10;
    
        let lowerLat = position.coords.latitude - (lat * distance)
        let lowerLon = position.coords.longitude - (lon * distance)
    
        let greaterLat = position.coords.latitude + (lat * distance)
        let greaterLon = position.coords.longitude + (lon * distance)
        let now = new Date();
        const snapshot = await firebase.firestore().collection('events').get()
        let events = snapshot.docs.map(doc => doc.data() as CustomEventWrapper);
        events = events.filter(x => x.ownerUid !== myUid)
            .filter(x => x.localization.latitude > lowerLat && x.localization.latitude < greaterLat)
            .filter(x => x.localization.longitude > lowerLon && x.localization.longitude < greaterLon)
            .filter(x => new Date(x.stopDate).getTime() >= now.getTime());
        return events;
    }


    public async getAllOwnEvents(): Promise<CustomEventWrapper[]> {
        const myUid = await this.authService.getUID();
        const snapshot = await firebase.firestore().collection('events').where("ownerUid", "==", myUid).get()
        return snapshot.docs.map(doc => doc.data() as CustomEventWrapper);
    }

    public async createOrUpdateEvent(event: CustomEventWrapper) {
        event.ownerUid = this.authService.getUID();
        await firebase.firestore().collection('events')
            .doc(event.uid)
            .set(JSON.parse(JSON.stringify(event)), { merge: true });
        await firebase.firestore().collection('events')
            .doc(event.uid)
            .update({ localization: new firebase.firestore.GeoPoint(event.localization.latitude, event.localization.longitude) });
    }

    public async addParticipant(eventId: string, uid: string) {
        var docRef = await firebase.firestore().collection('events')
            .doc(eventId);
            firebase.firestore().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                let largerArray = snapshot.get('participants');
                if(!largerArray) largerArray = [];
                largerArray.push(uid);
                transaction.update(docRef, 'participants', largerArray);
            });
        });
    }

    public async deleteParticipant(eventId: string, uid: string) {
        var docRef = await firebase.firestore().collection('events')
            .doc(eventId);
            firebase.firestore().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray: any[] = snapshot.get('participants');
                transaction.update(docRef, 'participants', largerArray.filter(x => x !== uid));
            });
        });
    }

    public async deleteEvent(eventId: string,) {
        await firebase.firestore().collection('events')
            .doc(eventId)
            .delete();
    }
}