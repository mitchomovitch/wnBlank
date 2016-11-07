import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerListPage } from './../reseller-list/reseller-list';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController  } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

declare var cordova;
/*
  Generated class for the WineDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-detail',
  templateUrl: 'wine-detail.html'
})
export class WineDetailPage {
  currentWine: any;
  public isDeleted: boolean;
  constructor(public nav: NavController, public navParams: NavParams, public actionsheetCtrl: ActionSheetController, 
  public wineData: WineData) {
    this.navParams = navParams;

    this.wineData.getWineDetail(this.navParams.get('wineId')).on('value', (snapshot) => {
      this.currentWine = snapshot.val();
      this.currentWine.id=snapshot.key;
      this.isDeleted=false;
      if(this.currentWine.photoName!=null){
          this.currentWine.photoPath=cordova.file.dataDirectory+this.currentWine.photoName;
      } 
    });
  }

  ionViewDidLoad() {
    console.log('Hello WineDetail Page');
  }

  ionViewWillLeave() {
    console.log('Not deleted ?'+(!this.isDeleted));
    if(!this.isDeleted){
      this.wineData.updateWine(this.currentWine).then( () => {
      });
    }
      
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.currentWine.codebarre=barcodeData.text;
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
      this.currentWine.photoName=name;
      this.currentWine.photoPath=success.nativeURL;
    });
  }


  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.currentWine.photoName=name;
      this.currentWine.photoPath=success.nativeURL;
    });
  }

  removeWine(){
    console.log("delete notes");
    
    this.wineData.removeWine(this.currentWine);
    this.isDeleted=true;
    this.nav.pop();
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
