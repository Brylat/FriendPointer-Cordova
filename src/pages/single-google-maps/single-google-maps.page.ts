import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, LoadingController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';

import CustomEventWrapper from '../wrapers/event';
import User, { Status } from '../wrapers/user';
import { firestore } from 'firebase/app';
import { IPoint } from '../google-maps/interfaces';
import { DatabaseService } from '../../services/database.service';



@Component({
	templateUrl: 'single-google-maps.html'
})
export class SingleGoogleMapsPage {
	public origin: IPoint;
	public zoom: number;
	public events: CustomEventWrapper[];
	public ownEvents: CustomEventWrapper[] = new Array<CustomEventWrapper>();
	public joinedEvents: CustomEventWrapper[] = new Array<CustomEventWrapper>();

	public users: User[];
	public friends: User[];
	public currentUser: User[] = new Array<User>();
	public globalPosition;
	public loading;
	private customEvent;
	private customUser;

	constructor(private geolocation: Geolocation,
		private alertCtrl: AlertController,
		private databaseService: DatabaseService,
		private loadingCtrl: LoadingController,
		private navParams: NavParams) {
		this.origin = {
			lat: 0,
			lng: 0
		};
		this.loading = this.createLoadingScreen();
		this.customEvent = this.navParams.get('event');
		this.customUser = this.navParams.get('user');
		this.Init();
	}

	private async Init() {
		this.loading.present();
		await this.initData();
		let customPosition: firestore.GeoPoint;
		if (this.customEvent) {
			customPosition = this.customEvent.localization;
		}
		if (this.customUser) {
			customPosition = this.customUser.localization;
		}
		if (customPosition) {
			this.origin = {
				lat: customPosition.latitude,
				lng: customPosition.longitude
			};
		} else {
			var position = await this.geolocation.getCurrentPosition();
			this.origin = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		}

		this.zoom = 10;
		this.loading.dismiss();
	}

	private async initData(): Promise<void> {
		await this.acquireData();
		await this.processMapData();
	}

	private async acquireData() {
		this.events = new Array<CustomEventWrapper>();
		if (this.customEvent) {
			this.events.push(this.customEvent);
		}
		this.currentUser = new Array<User>();
		this.currentUser.push(await this.databaseService.getCurrentUserData())
		this.users = await this.getUsers();
		this.friends = await this.getFriends();
	}

	private async getUsers() {
		var tempUsers = new Array<User>();
		if (this.customUser) {
			tempUsers.push(this.customUser);
		}
		return tempUsers.filter(user => user.localization != null);
	}

	private async getFriends() {
		let friends = new Array<User>();
		this.users.forEach(user => {
			this.currentUser[0].friends.forEach(friend => {
				if (user.uid == friend) {
					friends.push(user);
				}
			})
		});
		return friends;
	}

	public clickedEvent(event: CustomEventWrapper) {
		let alert = this.alertCtrl.create({
			title: event.name,
			subTitle: "Limit: " + event.limit + " Zajęte: " + ((Object.keys(event.participants).length == undefined) ? 0 : Object.keys(event.participants).length),
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
						if (event.limit > Object.keys(event.participants).length || Object.keys(event.participants).length == undefined) {
							this.databaseService.addParticipant(event.uid, this.currentUser[0].uid);
							this.events.map(eventTmp => {
								if (eventTmp.uid == event.uid) {
									this.events.splice(this.events.indexOf(event), 1);
								}
							})
							event.participants.push(this.currentUser[0].uid)
							this.joinedEvents.push(event);
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
			subTitle: "Limit: " + event.limit + " Zajęte: " + Object.keys(event.participants).length,
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
						this.databaseService.deleteEvent(event.uid)
						this.ownEvents.map(ownEvent => {
							if (ownEvent.uid == event.uid) {
								this.ownEvents.splice(this.ownEvents.indexOf(event), 1);
							}
						})
					}
				}
			]
		})
		alert.present();
	}

	public clickedUser(user: User) {
		let alert = this.alertCtrl.create({
			title: user.name + " " + user.surname,
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
						this.databaseService.addFriend(user.uid);
						this.users.map(userObject => {
							if (userObject.uid == user.uid) {
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
						this.databaseService.deleteFriend(user.uid);
						this.friends.map(friend => {
							if (friend.uid == user.uid) {
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

	public clickedJoinedEvent(event: CustomEventWrapper) {
		let alert = this.alertCtrl.create({
			title: event.name,
			subTitle: "limit: " + event.limit + " Zajęte: " + ((Object.keys(event.participants).length == undefined) ? 0 : Object.keys(event.participants).length),
			message: event.description,
			buttons: [
				{
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				},
				{
					text: 'Wypisz się',
					handler: data => {
						this.databaseService.deleteParticipant(event.uid, this.currentUser[0].uid);
						this.joinedEvents.map(joinedEvent => {
							if (joinedEvent.uid == event.uid) {
								this.joinedEvents.splice(this.joinedEvents.indexOf(event), 1);
							}
						})
						event.participants.pop();
						this.events.push(event);
					}
				}
			]
		})
		alert.present();
	}

	generateCustomEventWrapper(event, data) {
		let newCustomEvent: CustomEventWrapper = {
			name: data.nazwa,
			description: data.opis,
			limit: data.limit,
			createDate: new Date(),
			stopDate: new Date(new Date().getTime() + (1000 * 60 * 60 * (data.activeTime as number))),
			uid: UUID.UUID().toString(),
			participants: new Array<string>(),
			localization: new firestore.GeoPoint(event.coords.lat, event.coords.lng),
			ownerUid: ''
		};

		return newCustomEvent;
	}

	private async processMapData() {
		await this.removeFriendsFromUsers();
		await this.removeCurrentUserFromUsers();
		await this.removeOwnEventsFromEvents();
	}

	private async removeFriendsFromUsers() {
		await this.friends.forEach(friend => {
			this.users.map(user => {
				if (user.uid == friend.uid) {
					this.users.splice(this.users.indexOf(user), 1);
				}
			})
		});
	}

	private async removeCurrentUserFromUsers() {
		this.users.map(user => {
			if (user.uid == this.currentUser[0].uid) {
				this.users.splice(this.users.indexOf(user), 1);
			}
		})
	}

	private async removeOwnEventsFromEvents() {
		this.ownEvents = this.isEventOwn();
		this.events = this.isEventNotOwn();
		this.prepareEventJoinedData();
	}

	private isEventOwn() {
		return this.events.filter(event => {
			return (event.ownerUid == this.currentUser[0].uid)
		})
	}

	private isEventNotOwn() {
		return this.events.filter(event => {
			return (event.ownerUid != this.currentUser[0].uid)
		})
	}

	private prepareEventJoinedData() {
		this.events.forEach(event => {
			event.participants.forEach(participant => {
				if (participant == this.currentUser[0].uid) {
					this.joinedEvents.push(event)
				}
			})
		})
		this.removeJoinedEventsFromEvents();
	}

	private removeJoinedEventsFromEvents() {
		this.events.map(event => {
			this.joinedEvents.map(joinedEvent => {
				if (event.uid == joinedEvent.uid) {
					this.events.splice(this.events.indexOf(event), 1);
				}
			})
		})
	}

	private createLoadingScreen() {
		return this.loadingCtrl.create({
			content: 'Trwa ładowanie mapy...'
		});
	}
}