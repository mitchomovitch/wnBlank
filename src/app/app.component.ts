import { LoginPage } from './../pages/login/login';
import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar} from 'ionic-native';

import { HomePage } from '../pages/home/home';
import firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, private ngZone:NgZone) {
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

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  selectMenu(){
    
  }
}
