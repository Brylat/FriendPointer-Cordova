import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import User from '../pages/wrapers/user';
import { firestore } from 'firebase/app';
import firestoreInstance = firebase.firestore;

@Injectable()
export class DatabaseService {
    constructor(private authService: AuthService) { }

    public async getCurrentUserData(): Promise<User> {
        const snapshot = await firestoreInstance().collection('users')
            .doc(this.authService.getUID()).get();
        return snapshot.data() as User;
    }

    public async createOrUpdateUser(user: User) {
        await firestoreInstance().collection('users')
            .doc(this.authService.getUID())
            .set(user, { merge: true });
    }

    public async updateCurrentUserLocation(newLocalizatation: firestore.GeoPoint) {
        await firestoreInstance().collection('users')
            .doc(this.authService.getUID())
            .update({ localization: newLocalizatation });
    }

    public async addFriend(uid: string) {
        var docRef = await firestoreInstance().collection('users')
            .doc(this.authService.getUID());
            firestoreInstance().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray = snapshot.get('friends');
                largerArray.push(uid);
                transaction.update(docRef, 'friends', largerArray);
            });
        });
    }

    public async deleteFriend(uid: string) {
        var docRef = await firestoreInstance().collection('users')
            .doc(this.authService.getUID());
        firestoreInstance().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray: any[] = snapshot.get('friends');
                transaction.update(docRef, 'friends', largerArray.filter(x => x !== uid));
            });
        });
    }

    public async getAllFriendsData() {
        const snapshot = await firestoreInstance().collection('users')
            .doc(this.authService.getUID()).get();
        let friendsIds = snapshot.data().friends;
        if(!friendsIds) friendsIds = [];
        const usersRef = firestoreInstance().collection('users');
        let users = {};
        try {
            users = (await Promise.all(friendsIds.map(id => usersRef.doc(id).get())))
                .map((doc: any) => ({ [doc.id]: doc.data() }))
                .reduce((acc, val) => ({ ...acc, ...val }), {});

        } catch (error) {
            console.log(`received an error in getUsers method in module \`db/users\`:`, error);
            return {};
        }
        return users;
    }

    public async getAllUsers(): Promise<User[]> {
        const snapshot = await firestoreInstance().collection('users').get()
        return snapshot.docs.map(doc => doc.data() as User);
    }

    public async getAllEvents(): Promise<Event[]> {
        //add restriction date
        const snapshot = await firestoreInstance().collection('events').get()
        return snapshot.docs.map(doc => doc.data() as Event);
    }

    public async createOrUpdateEvent(event: Event) {
        await firestoreInstance().collection('events')
            .doc(this.authService.getUID())
            .set(event, { merge: true });
    }

    public async addParticipant(eventId: string, uid: string) {
        var docRef = await firestoreInstance().collection('events')
            .doc(eventId);
            firestoreInstance().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray = snapshot.get('participants');
                largerArray.push(uid);
                transaction.update(docRef, 'participants', largerArray);
            });
        });
    }

    public async deleteParticipant(eventId: string, uid: string) {
        var docRef = await firestoreInstance().collection('events')
            .doc(eventId);
        firestoreInstance().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray: any[] = snapshot.get('participants');
                transaction.update(docRef, 'participants', largerArray.filter(x => x !== uid));
            });
        });
    }
}