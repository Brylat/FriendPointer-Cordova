import { Component } from '@angular/core';
import { Nav } from 'ionic-angular';

import { WordpressListPage } from '../wordpress/list/wordpress.list.page';
import { SlideBoxPage } from '../slide-box/slide-box.page';
import { GoogleMapsPage } from '../google-maps/google-maps.page';

import { Tile } from './models/tile.model';
import { EmailService } from '../../services/email.service';
import { CallService } from '../../services/call.service';
import { MapsService } from '../../services/maps.service';
import { InAppBrowserService } from '../../services/in-app-browser.service';
import { data } from './home-data';
import { DatabaseService } from '../../services/database.service';
import { firestore } from 'firebase/app';

@Component({
	templateUrl: 'home.html',
	providers: []
})
export class HomePage {
	public tiles: Tile[][];

	private emailService: EmailService;
	private callService: CallService;
	private mapsService: MapsService;
	private browserService: InAppBrowserService;
	private nav: Nav;
	private databaseService: DatabaseService;

	constructor(
		emailService: EmailService,
		callService: CallService,
		mapsService: MapsService,
		browserService: InAppBrowserService,
		nav: Nav,
		databaseService: DatabaseService
	) {
		this.emailService = emailService;
		this.callService = callService;
		this.mapsService = mapsService;
		this.browserService = browserService;
		this.nav = nav;
		this.databaseService = databaseService;
		this.initTiles();
	}

	public navigateTo(tile) {
		this.nav.setRoot(tile.component);
	}

	public getDirections() {
		this.mapsService.openMapsApp(data.officeLocation);
	}

	public sendEmail() {
		this.emailService.sendEmail(data.email);
	}

	public openFacebookPage() {
		this.browserService.open(data.facebook);
	}

	public callUs() {
		this.callService.call(data.phoneNumber);
	}

	public async getAllUsers() {
		let x = await this.databaseService.getAllUsers();
		console.log(x);
	}

	public async createUser() {
		await this.databaseService.createOrUpdateUser({age: 23, description: "sds", localization: new firestore.GeoPoint(23,23), name: "AndUpdat", status: 1, surname: "Jan"});
	}
	public async updateUserLocalization() {
		await this.databaseService.updateCurrentUserLocation(new firestore.GeoPoint(66.66, 66.66));
		console.log(await this.databaseService.getCurrentUserData());
	}

	private initTiles(): void {
		this.tiles = [[{
			title: 'Wordpress',
			path: 'wordpress-articles',
			icon: 'logo-wordpress',
			component: WordpressListPage
		}, {
			title: 'Slides',
			path: 'slides',
			icon: 'swap',
			component: SlideBoxPage
		}], [{
			title: 'Map',
			path: 'map',
			icon: 'map',
			component: GoogleMapsPage
		}]];
	}
}
