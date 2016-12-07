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
  public resellerList:any;
  public isDeleted: boolean;

  constructor(public nav: NavController,public navParams: NavParams, 
  public resellerData:ResellerData) {
    this.navParams = navParams;
    this.reseller=this.navParams.get('reseller');
    this.isDeleted=false;
  }

  ionViewDidLoad() {
    console.log('Hello ResellerDetail Page');
  }
   
  ionViewWillLeave() {
    if(this.reseller.isChanged&&!this.isDeleted){
      this.resellerData.saveReseller(this.reseller);
    }
  }

  locate(){
    Geolocation.getCurrentPosition().then((position) => {
      this.reseller.latlng=position.coords.latitude+","+position.coords.longitude;
      this.elementChanged();
      
    }, (err) => {
      console.log('Geoloaction:'+err);
    });
  }

  removeReseller(){
    console.log("delete notes");
    this.resellerData.removeReseller(this.reseller);
    this.isDeleted=true;
    this.nav.pop();
  }
  
  saveCloud(){

  }

  elementChanged(){
    this.reseller.isChanged=true;
  }

}
