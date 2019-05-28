import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
}

export const firebaseConfig = {
	fire: {
		apiKey: "AIzaSyAiNwf0ykCwXKsix-frr1t7oI3SxnXptYU",
		authDomain: "friendpointer-bai.firebaseapp.com",
		databaseURL: "https://friendpointer-bai.firebaseio.com",
		projectId: "friendpointer-bai",
		storageBucket: "friendpointer-bai.appspot.com",
		messagingSenderId: "599306015353",
		appId: "1:599306015353:web:c47c3a77855b4422"
	}
};
