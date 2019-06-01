import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";

/**
 * Generated class for the NearbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html',
})

export class NearbyPage {

    private databaseService: DatabaseService;
    private authService: AuthService;
    private eventList: Array<Object>;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        databaseService: DatabaseService,
        authService: AuthService,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController) {
        this.databaseService = databaseService;
        this.authService = authService;
        this.eventList = Array();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NearbyPage');
        const loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        this.databaseService.getAllEvents().then((res) => {
            let responseList = (res);
            for (let response of responseList) {
                this.eventList.push(
                    {
                        uid: response.uid,
                        name: response.name,
                        ownerUid: response.ownerUid,
                        description: response.description,
                        limit: response.limit,
                        localization: response.localization,
                        createDate: new Date(response.createDate),
                        stopDate: new Date(response.stopDate),
                        participants: response.participants,
                    }
                );
            }
            loader.dismissAll();
        });
    }


    join(referer, event) {
        let uid = this.authService.getUID();
        let referer_status = referer.currentTarget.style.color;
        if (referer_status === "" && event.participants.length !== Number(event.limit)) {
            this.databaseService.addParticipant(event.uid, uid).then(
                (res) => {
                    referer.currentTarget.style.color = "#4cbb17";
                    event.participants.push(uid);
                });
        } else if (referer_status === "" && event.participants.length === Number(event.limit)) {
            this.eventAlert(event);
        } else {
            this.databaseService.deleteParticipant(event.uid, uid).then(
                (res) => {
                    event.participants = event.participants.filter(x => x !== uid);
                    referer.currentTarget.style.color = "";
                });
        }
    }

    goToEvent(event) {
        alert('My name is: "' + event.name + '" and want to go to my location!');
    }

    async eventAlert(event) {
        let alert = this.alertCtrl.create({
            title: 'Event is full',
            subTitle: 'Event "' + event.name + '" is full, you cannot join it.',
            buttons: ['Ok'],
        });
        return await alert.present();
    }
}