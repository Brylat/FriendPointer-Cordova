import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IMarker, IPoint } from './interfaces';
import { AlertController, LoadingController } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { UUID } from 'angular2-uuid';

import CustomEventWrapper from '../wrapers/event';
import User, { Status } from '../wrapers/user';

@Component({
	templateUrl: 'google-maps.html'
})
export class GoogleMapsPage {
	public origin: IPoint;
	public zoom: number;
	public events: CustomEventWrapper[];
	public ownEvents: CustomEventWrapper[] = new Array<CustomEventWrapper>();
	public users: User[];
	public friends: User[];
	public currentUser: User[] = new Array<User>();
	public globalPosition;
	public loading;

	constructor(private geolocation: Geolocation, private alertCtrl: AlertController, private databaseService: DatabaseService, private loadingCtrl: LoadingController) {
		this.origin = {
			lat: 0,
			lng: 0
		};
		this.loading = this.createLoadingScreen();
		this.Init();
	}

	private async Init() {	
		this.loading.present();
		await this.initData();
		var position = await this.geolocation.getCurrentPosition();
		this.origin = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		this.zoom = 10;
		this.loading.dismiss();
	}

	private async initData(): Promise<void> {
		await this.acquireData();
		await this.processMapData();
	}

	private async acquireData(){
		this.events = await this.databaseService.getAllEvents();
		this.friends = await this.databaseService.getAllFriendsData();
		this.currentUser.push(await this.databaseService.getCurrentUserData())
		this.users = await this.databaseService.getAllUsers();
	}

	placeMarker($event) {
		console.log($event.coords.lat);
		console.log($event.coords.lng);
		this.addEvent($event);
	}

	public clickedEvent(event: CustomEventWrapper) {
		let alert = this.alertCtrl.create({
			title: event.name,
			subTitle: "limit: " + event.limit,
			message: event.description,
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
						if(event.limit>0){
							this.databaseService.addParticipant(event.uid, this.currentUser[0].uid);
						} else {
							this.alertCtrl.create({
								title: 'Brak miejsc',
								message: 'Brak dostępnych miejsc w wyznaczonym wydarzeniu',
								buttons: ['Ok']
							}).present()
						}
					}
				}
			]
		})
		alert.present();
	}

	public clickedOwnEvent(event: CustomEventWrapper) {
		let alert = this.alertCtrl.create({
			title: event.name,
			subTitle: "limit: " + event.limit,
			message: event.description,
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				},
				{
					text: 'Usuń',
					handler: data => {

					}
				}
			]
		})
		alert.present();
	}

	public clickedUser(user: User) {
		let alert = this.alertCtrl.create({
			title: user.name + " " + user.surname,
			subTitle: "Status: " + user.status,
			message: user.description,
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				},
				{
					text: 'Dodaj do znajomych',
					handler: data => {
						console.log(user.uid);
						this.databaseService.addFriend(user.uid);
						this.users.map(userObject => {
							if(userObject.uid == user.uid){
								this.users.splice(this.users.indexOf(userObject), 1);
							}
						})
						this.friends.push(user);
					}
				}
			]
		})
		alert.present();
	}

	public clickedFriend(user: User) {
		let alert = this.alertCtrl.create({
			title: user.name + " " + user.surname,
			subTitle: "Status: " + user.status,
			message: user.description,
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				},
				{
					text: 'Usuń ze znajomych',
					handler: data => {
						console.log(user.uid);
						this.databaseService.deleteFriend(user.uid);
						this.friends.map(friend => {
							if(friend.uid == user.uid){
								this.friends.splice(this.friends.indexOf(friend), 1);
							}
						})
						this.users.push(user);
					}
				}
			]
		})
		alert.present();
	}

	addEvent(event: any) {
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

	private async processMapData(){
		await this.removeFriendsFromUsers();
		await this.removeCurrentUserFromUsers();
		await this.removeOwnEventsFromEvents();
	}

	private async removeFriendsFromUsers(){
		await this.friends.forEach(friend => {
			this.users.map(user => {
				if(user.uid == friend.uid){
					this.users.splice(this.users.indexOf(user), 1);
				}
			})
		});
	}

	private async removeCurrentUserFromUsers(){
		this.users.map(user => {
			if(user.uid == this.currentUser[0].uid){
				this.users.splice(this.users.indexOf(user), 1);
			}
		})
	}

	private async removeOwnEventsFromEvents(){
		this.ownEvents = this.isEventOwn();
		this.events = this.isEventNotOwn();
	}

	private isEventOwn(){
		return this.events.filter(event => {
			return (event.ownerUid == this.currentUser[0].uid)
		})
	}

	private isEventNotOwn(){
		return this.events.filter(event => {
			return (event.ownerUid != this.currentUser[0].uid)
		})
	}

	private createLoadingScreen(){
		return this.loadingCtrl.create({
            content: 'Trwa ładowanie mapy...'
		});
	}
}