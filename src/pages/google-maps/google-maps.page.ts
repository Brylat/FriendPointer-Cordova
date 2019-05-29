import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IMarker, IPoint } from './interfaces';
import { AlertController } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { UUID } from 'angular2-uuid';

import CustomEventWrapper from '../wrapers/event';

@Component({
	templateUrl: 'google-maps.html'
})
export class GoogleMapsPage {
	public origin: IPoint;
	public zoom: number;
	public events: CustomEventWrapper[];
	public globalPosition;

	constructor(private geolocation: Geolocation, private alertCtrl: AlertController, private databaseService: DatabaseService) {
		this.origin = {
			lat: 0,
			lng: 0
		};
		this.Init();
	}

	private async Init() {
		this.initData();
		var position = await this.geolocation.getCurrentPosition();
		this.origin = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		this.zoom = 10;
	}

	placeMarker($event) {
		console.log($event.coords.lat);
		console.log($event.coords.lng);
		this.presentPrompt($event);
	}

	public clickedMarker(label: CustomEventWrapper) {
		let alert = this.alertCtrl.create({
			title: label.name,
			subTitle: "limit: " + label.limit,
			message: label.description,
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				},
				{
					text: 'Dołącz',
					handler: data => {

					}
				}
			]
		})
		alert.present();
	}

	private async initData(): Promise<void> {
		this.events = await this.databaseService.getAllEvents();
	}



	presentPrompt(event: any) {
		let alert = this.alertCtrl.create({
			title: 'Dodaj wydarzenie',
			inputs: [
				{
					name: 'nazwa',
					placeholder: 'Nazwa'
				},
				{
					name: 'opis',
					placeholder: 'opis'
				},
				{
					name: 'limit',
					placeholder: 'limit osób',
					type: 'number',
					min: 1
				}
			],
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {

					}
				},
				{
					text: 'Dodaj',
					handler: data => {
						let customEvent = this.generateCustomEventWrapper(event, data);
						this.databaseService.createOrUpdateEvent(customEvent).then(() => this.initData());
					}
				}
			]
		});
		alert.present();
	}

	generateCustomEventWrapper(event, data) {
		let customEvent = new CustomEventWrapper()
		customEvent.name = data.nazwa;
		customEvent.description = data.opis;
		customEvent.limit = data.limit;
		customEvent.createDate = new Date();
		customEvent.uid = UUID.UUID().toString();
		customEvent.participants = new Array<string>();
		customEvent.localization = {
			latitude: event.coords.lat,
			longitude: event.coords.lng
		}
		return customEvent;
	}
}