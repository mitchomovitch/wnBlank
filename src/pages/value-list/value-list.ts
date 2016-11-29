import { ListData } from './../../providers/list-data';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

/*
  Generated class for the ValueList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-value-list',
  templateUrl: 'value-list.html'
})
export class ValueListPage {

  public listName:string;
  public itemList:any[];
  items: any[];

  constructor(public navCtrl: NavController,public navParams:NavParams, public listData:ListData,public nav: NavController, public events: Events) {
    this.navParams = navParams;
    this.listName=this.navParams.get('listName');
    this.itemList=listData.getList(this.listName);
    this.items=this.itemList;
  }

  ionViewDidLoad() {
    console.log('Hello ValueList Page');
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.items=this.itemList;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  selectItem(item:any){
    this.events.publish('region:selected', item);
    this.nav.pop();  
  }

}
