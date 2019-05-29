import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IMarker, IPoint } from './interfaces';
import { DatabaseService } from '../../services/database.service';

import CustomEventWrapper from '../wrapers/event';

@Component({
	templateUrl: 'google-maps.html'
})
export class GoogleMapsPage {
	public origin: IPoint;
	public zoom: number;
	public events: CustomEventWrapper[];

	constructor(private geolocation: Geolocation, private databaseService: DatabaseService) {
		this.origin = {
			lat: 0,
			lng: 0
		};
		this.Init();
	}

	private async Init(){
		this.initData();
		var position = await this.geolocation.getCurrentPosition();
		this.origin = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		this.zoom = 10;
	}

	public clickedMarker(label: string) {
		window.alert(`clicked the marker: ${label || ''}`);
	}

	private async initData(): Promise<void> {
		this.events = await this.databaseService.getAllEvents();
	}
}