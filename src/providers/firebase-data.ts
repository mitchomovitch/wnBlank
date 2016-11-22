import { Platform } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
declare var cordova;
/*
  Generated class for the FirebaseData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseData {

  constructor(public platform:Platform, public ngZone:NgZone) {
    console.log('Hello FirebaseData Provider');
  }

getSynchronizedArray(firebaseRef):any {
  var list = [];
  this.syncChanges(list, firebaseRef);
  this.wrapLocalCrudOps(list, firebaseRef);
  //console.log("getSynchronizedArray return :"+JSON.stringify(list));
  return list;
}

syncChanges(list, ref) {
  //console.log("syncChanges");

  ref.on('child_added', (snap, prevChild) => {
    this.ngZone.run(()=>{
      console.log("syncChanges child_added");
      var data = snap.val();
      data.id = snap.key; // assumes data is always an object
      //var pos = this.positionAfter(list, prevChild);
      //list.splice(pos, 0, data);
      //Ajout du nouvel element a la position 1
      list.splice(0, 0, data);
      //console.log("child_added list :"+JSON.stringify(list));
    });
  });

  ref.on('child_removed', (snap) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_removed");
      var i = this.positionFor(list, snap.key);
      if( i > -1 ) {
        list.splice(i, 1);
      }
      //console.log("child_removed list :"+JSON.stringify(list));
    });
  });

  ref.on('child_changed', (snap) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_changed");
      var i = this.positionFor(list, snap.key);
      if( i > -1 ) {
        list[i] = snap.val();
        list[i].id = snap.key; // assumes data is always an object
      }
      //console.log("child_changed list :"+JSON.stringify(list));
    });
  });

  ref.on('child_moved', (snap, prevChild) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_moved");
      var curPos = this.positionFor(list, snap.key);
      if( curPos > -1 ) {
        var data = list.splice(curPos, 1)[0];
        var newPos = this.positionAfter(list, prevChild);
        list.splice(newPos, 0, data);
      }
      //console.log("child_moved list :"+JSON.stringify(list));
    });

  });
}

wrapLocalCrudOps(list, firebaseRef):any {
  //console.log("wrapLocalCrudOps");
   // we can hack directly on the array to provide some convenience methods
   list.add = function(data) {
     //console.log("wrapLocalCrudOps add");
      return firebaseRef.push(data);
   };

   list.remove = function(key) {
     //console.log("wrapLocalCrudOps remove");
     return firebaseRef.child(key).remove();
   };

   list.set = function(key, newData) {
     //console.log("wrapLocalCrudOps set");
     // make sure we don't accidentally push our id prop
     //if( newData.hasOwnProperty('id') ) { delete newData.id; }
     firebaseRef.child(key).set(newData);
   };

   list.indexOf = function(key) {
     //console.log("wrapLocalCrudOps indexOf");
     return this.positionFor(list, key); // positionFor in examples above
   }
}

// similar to indexOf, but uses id to find element
positionFor(list, key):number {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i].id === key ) {
      return i;
    }
  }
  return -1;
}

// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
positionAfter(list, prevChild):number {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = this.positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i+1;
    }
  }
}

}
