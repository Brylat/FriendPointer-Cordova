import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';

import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { GoogleMapsPage } from '../pages/google-maps/google-maps.page';
import { SettingsScreenPage } from '../pages/settings-screen/settings-screen.page';
import { FriendsScreenPage } from '../pages/friends-screen/friends-screen';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { Subscribable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../services/database.service';
import { firestore } from 'firebase/app';
import User from '../pages/wrapers/user';
import { EventsPage } from '../pages/events/events';
import { OfflinePage } from '../pages/offline/offline';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	pages;
	rootPage;

	private app;
	private platform;
	private menu: MenuController;
	private positionWatch: Subscription;

	@ViewChild(Nav) nav: Nav;

	constructor(app: App, platform: Platform,
		menu: MenuController,
		private statusBar: StatusBar,
		private auth: AuthService,
		private geolocation: Geolocation,
		private db: DatabaseService) {
		this.menu = menu;
		this.app = app;
		this.platform = platform;
		this.initializeApp();


		// set our app's pages
		this.pages = [
			{ title: 'Mapa', component: GoogleMapsPage, icon: 'map' },
			{ title: 'Wydarzenia', component: EventsPage, icon: 'flame' },
			{ title: 'Znajomi', component: FriendsScreenPage, icon: 'person' },
			{ title: 'Ustawienia', component: SettingsScreenPage, icon: 'settings' }
		];
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
		});

		if (navigator.onLine) {
			this.auth.afAuth.authState
			.subscribe(
				user => {
					if (user) {
						this.rootPage = GoogleMapsPage;
						this.menu.enable(true);
						this.afterLoginAction();
					} else {
						this.rootPage = LoginPage;
						this.menu.enable(false);
						if (this.positionWatch) {
							this.positionWatch.unsubscribe();
						}
					}
				},
				() => {
					this.rootPage = GoogleMapsPage;
					this.menu.enable(false);
				}
			);
		} else {
			this.rootPage = OfflinePage;
			this.menu.enable(false);
		}

	}

	private async afterLoginAction() {
		let options = {
			frequency: 30000,
			maximumAge: 10000,
			enableHighAccuracy: true
		};
		if (!await this.db.getCurrentUserData()) {
			await this.db.createOrUpdateUser({
				uid: this.auth.getUID(),
				name: "",
				surname: "",
				status: 2,
				description: "",
				localization: new firestore.GeoPoint(0, 0),
				friends: []
			})
		}
		this.positionWatch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
			this.db.updateCurrentUserLocation(new firestore.GeoPoint(position.coords.latitude, position.coords.longitude))
		});
	}

	login() {
		this.menu.close();
		this.auth.signOut();
		this.nav.setRoot(LoginPage);
	}

	logout() {
		this.menu.close();
		this.auth.signOut();
		this.nav.setRoot(LoginPage);
	}

	openPage(page) {
		this.menu.close();
		this.nav.setRoot(page.component);
	}
}
