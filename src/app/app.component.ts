import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar} from 'ionic-native';

import { HomePage } from '../pages/home/home';
import firebase from 'firebase';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform) {
    firebase.initializeApp({
      apiKey: "AIzaSyCJm4-qfygYlGoguBOrZKykn4uMdkGmMJc",
      authDomain: "winenotes-8a11d.firebaseapp.com",
      databaseURL: "https://winenotes-8a11d.firebaseio.com",
      storageBucket: "winenotes-8a11d.appspot.com",
      messagingSenderId: "228384882730"
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //console.log(JSON.stringify(user));
        this.rootPage = HomePage;
        //this.rootPage = LoginPage;
        console.log("I'm here! HomePage");
      } else {
        this.rootPage = LoginPage;
        console.log("I'm here! LoginPage");
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      //Splashscreen.hide();
    });
  }
}
