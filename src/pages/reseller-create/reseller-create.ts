import { ResellerData } from './../../providers/reseller-data';
import { ResellerModel } from './../../models/reseller-model';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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

  reseller:ResellerModel;public resellerList:any

  constructor(public nav: NavController,public navParams: NavParams, 
  public resellerData:ResellerData) {
    this.navParams = navParams;
    this.resellerList=this.navParams.get('resellerList');
    this.resellerData=resellerData;
    this.reseller = new ResellerModel();
  }

  ionViewDidLoad() {
    console.log('Hello ResellerCreate Page');
  }

  ionViewWillLeave() {
      this.resellerData.createReseller(this.reseller, this.resellerList);
  }

  locate(){
    Geolocation.getCurrentPosition().then((position) => {
      this.reseller.latlng=position.coords.latitude+","+position.coords.longitude;
    }, (err) => {
      console.log('Geoloaction:'+err);
    });

  }

  saveCloud(){

  }

}
