import { AgmCoreModule } from '@agm/core';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Config } from '../config';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ComponentsModule } from '../pages/components/components.module';
import { GoogleMapsModule } from '../pages/google-maps/google-maps.module';
import { HomeModule } from '../pages/home/home.module';
import { SlideBoxModule } from '../pages/slide-box/slide-box.module';
import { SettingsScreenModule } from '../pages/settings-screen/settings-screen.module';
import { FriendsScreenPageModule } from '../pages/friends-screen/friends-screen.module';
import { WordpressModule } from '../pages/wordpress/wordpress.module';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebaseConfig } from '../config';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../services/auth.service';
import { SignupPage } from '../pages/signup/signup';
import { DatabaseService } from '../services/database.service';
import { Geolocation } from '@ionic-native/geolocation';
import { SingleGoogleMapsModule } from '../pages/single-google-maps/single-google-maps.module';
import { EventsPageModule } from "../pages/events/events.module";
import { OfflinePage } from '../pages/offline/offline';

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		SignupPage,
		OfflinePage
	],
	imports: [
		BrowserModule,
		HttpModule,
		IonicModule.forRoot(MyApp),
		AgmCoreModule.forRoot(),

		AngularFireModule.initializeApp(firebaseConfig.fire),
		AngularFirestoreModule,
		ComponentsModule,
		NgxErrorsModule,
		GoogleMapsModule,
		SingleGoogleMapsModule,
		HomeModule,
		SlideBoxModule,
		SettingsScreenModule,
		WordpressModule,
		EventsPageModule,
		FriendsScreenPageModule,
		WordpressModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		SignupPage,
		OfflinePage
	],
	providers: [
		Config,
		StatusBar,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		AngularFireAuth,
		AuthService,
		DatabaseService,
		Geolocation
	]
})
export class AppModule {
}
