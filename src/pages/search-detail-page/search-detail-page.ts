import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the SearchDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search-detail-page',
  templateUrl: 'search-detail-page.html'
})
export class SearchDetailPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello SearchDetailPage Page');
  }

}
