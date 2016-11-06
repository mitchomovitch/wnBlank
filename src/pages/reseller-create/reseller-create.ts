import { ResellerData } from './../../providers/reseller-data';
import { ResellerModel } from './../../models/reseller-model';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

/*
  Generated class for the ResellerCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reseller-create',
  templateUrl: 'reseller-create.html'
})
export class ResellerCreatePage {

  reseller:ResellerModel;

  constructor(public navCtrl: NavController, public resellerData:ResellerData) {
    this.resellerData=resellerData;
    this.reseller = new ResellerModel();
  }

  ionViewDidLoad() {
    console.log('Hello ResellerCreate Page');
  }

  ionViewWillLeave() {
      this.resellerData.createReseller(this.reseller).then( () => {
      });
  }

  locate(){
    Geolocation.getCurrentPosition().then((position) => {
      this.reseller.gpsX=position.coords.latitude;
      this.reseller.gpsY=position.coords.longitude;
    }, (err) => {
      console.log('Geoloaction:'+err);
    });

  }

}
