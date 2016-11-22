import { ResellerModel } from './../../models/reseller-model';
import { ResellerData } from './../../providers/reseller-data';
import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;
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
  public resellerList:any

  constructor(public nav: NavController,public navParams: NavParams, 
  public resellerData:ResellerData) {
    this.navParams = navParams;
    this.resellerList=this.navParams.get('resellerList');
    console.log('Constructor ResellerDetail Page');
    this.resellerData.getResellerDetail(this.navParams.get('resellerId')).on('value', (snapshot) => {
      this.reseller = snapshot.val();
      this.reseller.id=snapshot.key;
      
    });
  }

  ionViewDidLoad() {
    console.log('Hello ResellerDetail Page');
  }

  ionViewWillLeave() {
      this.resellerData.updateReseller(this.reseller,this.resellerList);
  }

  locate(){
    Geolocation.getCurrentPosition().then((position) => {
      this.reseller.latlng=position.coords.latitude+","+position.coords.longitude;
      
    }, (err) => {
      console.log('Geoloaction:'+err);
    });
  }

  removeReseller(){
    console.log("delete notes");
    this.resellerData.removeReseller(this.reseller,this.resellerList);
    this.nav.pop();
  }
  saveCloud(){

  }

}
