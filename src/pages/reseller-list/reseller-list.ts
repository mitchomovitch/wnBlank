import { ResellerData } from './../../providers/reseller-data';
import { ResellerModel } from './../../models/reseller-model';
import { ResellerDetailPage } from './../reseller-detail/reseller-detail';
import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { Component,NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the ResellerList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reseller-list',
  templateUrl: 'reseller-list.html'
})
export class ResellerListPage {

  public resellerList: any;
  reseller: ResellerModel;

  constructor(public nav: NavController, public resellerData:ResellerData, private ngZone:NgZone) {
    this.nav = nav;
    this.resellerData = resellerData;
    this.resellerData.getResellerList().on('value', snapshot => {
      this.ngZone.run(()=>{
          console.log('Snapshot reseller');
          let rawList = [];
          snapshot.forEach( snap => {
            this.reseller=snap.val();
            this.reseller.id=snap.key;
            rawList.push(this.reseller); 
          });
          this.resellerList = rawList;
          });   
    });
  }

  ionViewDidLoad() {
    console.log('Hello ResellerList Page');
  }

  addReseller(){
    this.nav.push(ResellerCreatePage);
  }

  searchResellerByMap(){
    this.nav.push(ResellerMapPage,{
      resellerList: this.resellerList
    });
  }

  goToResellerDetail(resellerId){
    if(this.resellerList!==null){
      this.nav.push(ResellerDetailPage, {
        resellerId: resellerId
      });
    }
    
  }

}
