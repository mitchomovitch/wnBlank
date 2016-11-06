import { ResellerModel } from './../../models/reseller-model';
import { ResellerData } from './../../providers/reseller-data';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

/*
  Generated class for the ResellerDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reseller-detail',
  templateUrl: 'reseller-detail.html'
})
export class ResellerDetailPage {
  public reseller:ResellerModel;

  constructor(public navCtrl: NavController,public navParams: NavParams, 
  public resellerData:ResellerData) {
    this.navParams = navParams;

    this.resellerData.getResellerDetail(this.navParams.get('resellerId')).on('value', (snapshot) => {
      this.reseller = snapshot.val();
      this.reseller.id=snapshot.key;
      
    });
  }

  ionViewDidLoad() {
    console.log('Hello ResellerDetail Page');
  }

  ionViewWillLeave() {
      this.resellerData.updateReseller(this.reseller).then( () => {
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
