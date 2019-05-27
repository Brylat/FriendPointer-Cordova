import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import User from '../pages/wrapers/user';
import { firestore } from 'firebase/app';

@Injectable()
export class DatabaseService {
    constructor(private authService: AuthService) { }

    public async getCurrentUserData() {
        const snapshot = await firebase.firestore().collection('users')
            .doc(this.authService.getUID()).get();
        return snapshot.data();
    }

    public async createOrUpdateUser(user: User) {
        await firebase.firestore().collection('users')
            .doc(this.authService.getUID())
            .set(user, { merge: true });
    }

    public async updateCurrentUserLocation(newLocalizatation: firestore.GeoPoint) {
        await firebase.firestore().collection('users')
            .doc(this.authService.getUID())
            .update({ localization: newLocalizatation });
    }

    public async addFriend(uid: string) {
        var docRef = await firebase.firestore().collection('users')
            .doc(this.authService.getUID());
        firebase.firestore().runTransaction(transaction => {
            return transaction.get(docRef).then(snapshot => {
                const largerArray = snapshot.get('friends');
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
        const friendsIds = snapshot.data().friends;
        const usersRef = firebase.firestore().collection('users');
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

    public async getAllUsers() {
        const snapshot = await firebase.firestore().collection('users').get()
        return snapshot.docs.map(doc => doc.data());
    }

}