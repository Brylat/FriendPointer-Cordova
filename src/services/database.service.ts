import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from './auth.service';
import User from '../pages/wrapers/user';

@Injectable()
export class DatabaseService {
	constructor(private authService: AuthService) {}

    public async getCurrentUserData() {
        const snapshot = await firebase.firestore().collection('users').doc(this.authService.getUID()).get();
        return snapshot.data();
    }

    public async createOrUpdateUser(user: User) {
        await firebase.firestore().collection('users').doc(this.authService.getUID()).set(user, { merge: true });
    }

    public async getAllUsers() {
        console.log(this.authService.authenticated);
        const snapshot = await firebase.firestore().collection('users').get()
        return snapshot.docs.map(doc => doc.data());
    }
	

}