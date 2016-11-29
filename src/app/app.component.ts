import { LoginPage } from './../pages/login/login';
import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar} from 'ionic-native';
import { Storage } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, private ngZone:NgZone, public storage:Storage) {
    firebase.initializeApp({
      apiKey: "AIzaSyCJm4-qfygYlGoguBOrZKykn4uMdkGmMJc",
      authDomain: "winenotes-8a11d.firebaseapp.com",
      databaseURL: "https://winenotes-8a11d.firebaseio.com",
      storageBucket: "winenotes-8a11d.appspot.com",
      messagingSenderId: "228384882730"
    });

    firebase.auth().onAuthStateChanged((user) => {
      this.ngZone.run(()=>{
          if(user){
            this.rootPage = HomePage;
          }
          else {
            this.rootPage = LoginPage;
          }
      });
      
    });

    storage.get('userProfile').then(userProfile=>{
      this.ngZone.run(()=>{
          if(userProfile){
            this.rootPage = HomePage;
          }
      });
      
    });

    /*var listVide:any[];
    this.storage.set('wineListToDelete',JSON.stringify(listVide));
    this.storage.set('wineList',JSON.stringify(listVide));

    this.storage.set('priceList',JSON.stringify(listVide));
    this.storage.set('priceListToDelete',JSON.stringify(listVide));*/

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  selectMenu(){
    
  }
}
