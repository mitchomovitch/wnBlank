import { WineModel } from './../../models/wine-model';
import { ResellerMapPage } from './../../pages/reseller-map/reseller-map';
import { ResellerListPage } from './../../pages/reseller-list/reseller-list';
import { PriceData } from './../../providers/price-data';
import { PriceModel } from './../../models/price-model';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

/*
  Generated class for the PriceCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-price-create',
  templateUrl: 'price-create.html'
})
export class PriceCreatePage {
  public priceList: any[];
  public price:PriceModel;
  public wine : WineModel;

  constructor(public nav: NavController,public navParams: NavParams, 
  public events: Events,public priceData:PriceData) {
    this.priceData=priceData;
    this.wine=this.navParams.get('wine');
    this.price=this.navParams.get('price');
    this.priceList = this.priceData.getWinePriceList(this.wine);
  }

  ionViewDidLoad() {
    console.log('Hello PriceCreate Page');
  }

  ionViewWillLeave() {
    this.processUpdate();

  }

  processUpdate(){
    if(this.price.isChanged && this.price.prix && this.price.vendeurId){

      this.price.isChanged=false;
      this.price.wineId=this.wine.id;
      //last price
      this.price=this.updateVendorPrice(this.price);
      this.priceData.savePrice(this.price);
      this.priceList = this.priceData.getWinePriceList(this.wine);
      this.wine.lastPrice=this.price;
      //best Price
      this.wine.minPrice=this.getBestPrice();
      this.wine.isChanged=true;
      

    }

    if(this.priceList.length>0){
        if(this.wine.lastPrice && !this.isPriceExist(this.wine.lastPrice)){
          this.wine.lastPrice=this.getLastPrice();
          this.wine.isChanged=true;
        }

        if(this.wine.minPrice &&!this.isPriceExist(this.wine.minPrice)){
          this.wine.minPrice=this.getBestPrice();
          this.wine.isChanged=true;
        }
    }
    else {
        this.wine.lastPrice=null;   
        this.wine.minPrice=null;
        this.wine.gammePrix=null;
    }

    if(this.wine.lastPrice){
        // Gamme de prix
        if(this.wine.lastPrice.prix<1000){
          this.wine.gammePrix='<1000';
        }
        else if(this.wine.lastPrice.prix<2000){
          this.wine.gammePrix='1000-2000';
        } 
        else {
          this.wine.gammePrix='2000';
        }
    }
    
  }

  getLastPrice():PriceModel{
    var sortList:PriceModel[];
    sortList =this.priceList.sort(function(a, b) {
      return b.time - a.time;
    });
    return sortList[0];
  }

  getBestPrice():PriceModel{
    var sortList:PriceModel[];
    sortList =this.priceList.sort(function(a, b) {
      return a.prix - b.prix;
    });
    console.log('best price sort',JSON.stringify(sortList));
    return sortList[0];
  }

  isPriceExist(price : PriceModel):boolean{
    return (this.priceData.positionFor(this.priceList,price.id)!=-1);
  }

  updateVendorPrice(price:PriceModel):PriceModel{
    for(var i = 0, len = this.priceList.length; i < len; i++) {
        if( this.priceList[i].vendeurId === price.vendeurId ) {
          this.priceList[i].prix=price.prix;
          return this.priceList[i];
        }
    }
    return price;
  }

  elementChanged(){
    this.price.isChanged=true;
  }

  searchResellerByName(){
    this.nav.push(ResellerListPage, {  
        price: this.price
    }); 
  }

  searchResellerByMap(){
    this.nav.push(ResellerMapPage, {
        price: this.price
    }); 
  }

  updatePrice(price :PriceModel){
    console.log('update price');
  }

  removePrice(price :PriceModel){
    console.log('remove price 2');  
    this.priceData.removePrice(price);
    this.priceList = this.priceData.getWinePriceList(this.wine);
  }
}
