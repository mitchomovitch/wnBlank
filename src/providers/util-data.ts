import { Injectable } from '@angular/core';

/*
  Generated class for the UtilData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UtilData {

  public uuid:any;

  constructor() {
    console.log('Hello UtilData Provider');
    this.uuid={
      generateUuid:function(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      generateTimeId:function(){
        let date = new Date(),time = date.getTime();
        return time*1000+Math.floor(Math.random() * 999);
      }
      
    }

  }

}
