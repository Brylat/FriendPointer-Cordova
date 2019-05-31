import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';


import { AgmCoreModule } from '@agm/core';
import { SingleGoogleMapsPage } from './single-google-maps.page';

@NgModule({
	declarations: [SingleGoogleMapsPage],
	entryComponents: [SingleGoogleMapsPage],
	imports: [IonicModule, AgmCoreModule]
})
export class SingleGoogleMapsModule {

}
