import { PriceModel } from './../../models/price-model';
import { ResellerData } from './../../providers/reseller-data';
import { ResellerModel } from './../../models/reseller-model';
import { ResellerDetailPage } from './../reseller-detail/reseller-detail';
import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { Component, NgZone } from '@angular/core';
import { NavController, Events, NavParams } from 'ionic-angular';

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

  public resellerList: any[];
  public searchResellerList: any[];
  reseller: ResellerModel;
  public price: PriceModel;

  constructor(public nav: NavController, public navParams: NavParams, public resellerData: ResellerData,
    private ngZone: NgZone, public events: Events) {
    this.nav = nav;
    this.price = this.navParams.get('price');
    this.resellerData = resellerData;
    this.resellerList = this.resellerData.getResellerList();
    this.searchResellerList = this.resellerList;
  }

  ionViewDidLoad() {
    console.log('Hello ResellerList Page');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.searchResellerList = this.resellerList;

    // set val to the value of the searchbar  
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    
    if (val && val.trim() != '') {
      this.searchResellerList = this.searchResellerList.filter((item) => {
        return (item.nom != null && item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.adresse != null && item.adresse.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  addReseller() {
    this.nav.push(ResellerCreatePage);
  }

  searchResellerByMap() {
    this.nav.push(ResellerMapPage, {
      resellerList: this.resellerList
    });
  }


  goToResellerDetail(reseller) {
    if (this.resellerList !== null) {
      this.nav.push(ResellerDetailPage, {
        reseller: reseller
      });
    }

  }

  selectReseller(reseller: ResellerModel) {
    this.price.vendeurId = reseller.id;
    this.price.vendeurName = reseller.nom;
    this.price.isChanged = true;
    this.nav.pop();

  }

}
