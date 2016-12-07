import { ResellerListPage } from './../../pages/reseller-list/reseller-list';
import { WineDetailPage } from './../wine-detail/wine-detail';
import { WineData } from './../../providers/wine-data';
import { ResellerData } from './../../providers/reseller-data';
import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from 'ionic-native';
/*
  Generated class for the SearchMenuPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search-menu-page',
  templateUrl: 'search-menu-page.html'
})
export class SearchMenuPage {

  public resellerList: any[];
  public searchResellerList: any[];

  public itemList:any[];
  public filterItemList:any[];
  items: any[];

  public showSearchButton:boolean;
  public isFiltering:boolean;
  public libSearch:string;

  mySlideOptions = {
    initialSlide: 0,
    autoplay:5000,
    loop: true
  };

  constructor(public nav: NavController, public resellerData: ResellerData, 
  public wineData : WineData, public storage : Storage, public events : Events) {
    this.nav = nav;
    this.itemList=wineData.getWineList();
    this.showSearchButton=true;
    this.isFiltering=false;
    this.libSearch="Rechercher dans Wine Notes";
    console.log('Hello SearchMenuPage Page constructor');
    this.events.subscribe('searchVendor:filtered', (data) => {
      this.filterItemList=data[0];   
      this.items=this.filterItemList; 
      this.libSearch=data[1];
      this.isFiltering=true;
    });
  }
  
  ionViewDidLoad() {
    console.log('Hello SearchMenuPage Page');
    this.searchResellerList=[];
    this.storage.get('resellerList').then(list=>{
      if(list){
        console.log("use local");
        var array:any[]=JSON.parse(list);
        let cpt3 = 0;
        var length = array.length;
        for(var i = 0, len = array.length; i < len; i+=3) {
          var tabReseller:any[]=[];
          if(i<length)tabReseller.push(array[i]); 
          if(i+1<length) tabReseller.push(array[i+1]);
          if(i+2<length) tabReseller.push(array[i+2]);
          this.searchResellerList.push(tabReseller);
          cpt3+=1;
        }
      } 
    });
  }  

  getItems(ev: any) {
    console.log('Hello SearchMenuPage Page search');
    this.showSearchButton=false;
    // Reset items back to all of the items 
    if(this.isFiltering)
      this.items=this.filterItemList;
    else
      this.items=this.itemList;
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.userPseudo != null && item.userPseudo.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.nom != null && item.nom.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.millesime != null && item.millesime.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.producteur != null && item.producteur.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.appellation != null && item.appellation.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.subdivision != null && item.subdivision.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.region != null && item.region.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.pays != null && item.pays.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.color != null && item.color.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.lastNote != null && item.lastNote.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.lastMsg != null && item.lastMsg.toLowerCase().indexOf(val.toLowerCase()) > -1)
            || (item.gammePrix != null && item.gammePrix.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  getFilterItems(filter:string) {
    console.log('Hello SearchMenuPage Page search Button');
    this.showSearchButton=false;
    if(!this.isFiltering){
      this.filterItemList=this.itemList;
      this.isFiltering=true;
      this.libSearch="";
    }
    
    if(filter=="<1000"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.gammePrix != null && item.gammePrix==filter);
      });
      this.libSearch+=" < 1000";
    }
    else if(filter=="1000-2000"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.gammePrix != null && item.gammePrix==filter);
      });
      this.libSearch+=" 1000-2000";
    }
    else if(filter==">2000"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.gammePrix != null && item.gammePrix==filter);
      });
      this.libSearch+=" > 2000";
    }
    else if(filter==">5"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.score != null && item.score>=5);
      });
      this.libSearch+=" Note > 5";
    }
    else if(filter==">7"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.score != null && item.score>=7);
      });
      this.libSearch+=" Note > 7";
    }
    else if(filter==">9"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.score != null && item.score>=9);
      });
      this.libSearch+=" Note > 9";
    }
    else if(filter=="rouge"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.color != null && item.color==filter);
      });
      this.libSearch+=" Rouge";
    }
    else if(filter=="rose"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.color != null && item.color==filter);
      });
      this.libSearch+=" Rosé";
    }
    else if(filter=="blanc"){
      this.filterItemList = this.filterItemList.filter((item) => {
          return (item.color != null && item.color==filter);
      });
      this.libSearch+=" Blanc";
    }
    
    this.items=this.filterItemList;
  }

  showFilter(){
    this.items=null;
    this.showSearchButton=true;
  }

  reset(){
    this.items=null;
    this.filterItemList=null;
    this.libSearch="Rechercher dans Wine Notes";
    this.isFiltering=false;
    this.showSearchButton=true;
  }

  goToWineDetail(wine){
    this.nav.push(WineDetailPage, {
      wine: wine,
      wineList: this.itemList
    });
  }

  searchResellerByName(){
    console.log("search resseler");  
    this.showSearchButton=false;
    var list:any;
    if(this.isFiltering)
      list=this.filterItemList;
    else
      list=this.itemList;

    this.nav.push(ResellerListPage, {
        wineList: list
    }); 
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.showSearchButton=false;
      var filter=barcodeData.text;
      if(this.isFiltering)
        this.items=this.filterItemList;
      else
        this.items=this.itemList;
      this.items = this.items.filter((item) => {
          return (item.codebarre != null && item.codebarre==filter);
      });
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
    });
  }

}
