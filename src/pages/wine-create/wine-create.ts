import { ResellerListPage } from './../reseller-list/reseller-list';
import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { WineModel } from './../../models/wine-model';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController,ActionSheetController,NavParams } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
/*
  Generated class for the WineCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-create',
  templateUrl: 'wine-create.html'
})
export class WineCreatePage {
  wine:WineModel;
  public wineList: any;

  constructor(public navParams:NavParams,public nav: NavController, public actionsheetCtrl: ActionSheetController,public wineData: WineData) {
    this.nav = nav;
    this.wineData= wineData;
    this.wine = new WineModel();
    this.wineList=this.navParams.get('wineList');
  }

  ionViewDidLoad() {
    console.log('Hello WineCreate Page');
  }

  ionViewWillLeave() {
      this.wineData.createWine(this.wine,this.wineList);
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.wine.codebarre=barcodeData.text;
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
    });
  }

  openMenuPhoto() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Photo',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choisir une photo',
          icon: 'images',
          handler: () => {
            this.openPhotoLibrary();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    this.wineData.takePicture(1).then(success=>{
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
    });
  }


  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
    });
  }

  addReseller(){
    this.nav.push(ResellerCreatePage);
  }

  searchResellerByName(){
    this.nav.push(ResellerListPage);
  }

  searchResellerByMap(){
    this.nav.push(ResellerMapPage);
  }
  

}
