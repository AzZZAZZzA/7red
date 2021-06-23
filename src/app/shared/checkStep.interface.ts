import { Injectable } from "@angular/core";
import {Card, Player, PlayerSum, StepControl} from "../shared/game.service"
import {CheckGameOver} from "../shared/checkGameover.interface"

export interface SortStorageUnit{
   value:number
   count:number
   card:Card[]
}
export interface StorageStreetUnit{
   count:number
   card:Card[]
}


@Injectable({providedIn:'root'})
export class CheckStep{
   

   constructor(checkGameOver:CheckGameOver){}
   public stackLock:boolean= false
   
   check(stack:Card[], players:Player[], stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //console.log(players);
      //console.log(stepControl);

      switch(stack[stack.length -1].color) {
         case 7:{  
            //console.log("Big card");
            if (this.highCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 6:{  
            //console.log("one value card");
            if (this.oneValueCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 5:{  
            //console.log("one color card");
            if (this.oneColorCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 4:{  
            //console.log("par card");
            if (this.pairedCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 3:{  
            //console.log("any color");
            if (this.anyColorCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 2:{  
            //console.log("strit");
            if (this.streetCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }
         case 1:{  
            //console.log("lower card");
            if (this.lowerCard(players,stepControl,playerSum,nextPlayer)) {
               return true
            }
            
            return false
            break;
         }  
         default:{
            //console.log('error');
            
            return false
            break
         }
      }
   }
   // Hight card
      comparisonCard(card1:Card,card2:Card){
      if(card1.value> card2.value){
         return true
      }else if(card1.value===card2.value&& card1.color> card2.color){
         return true
      }else{
         return false
      }
      
   }//Check top card of players
   
   searchTopCard(array:Card[]){
      let topCard: Card= {id:49, value:1,color:1}
      //console.log(array);
      

      for (let i = 0; i < array.length; i++) {
            if(array[i].value> topCard.value){
            topCard= array[i]
         }else if(array[i].value===topCard.value&& array[i].color> topCard.color){
            topCard= array[i]
         }
      }
      //console.log(`Top card result ${topCard.value}`);
      return topCard
   }//Search top card current player


   highCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //console.log("Palette to highCard");
   //console.log(stepControl.player);

   let currentPlayerTopCard=this.searchTopCard(players[stepControl.player.id].palette)
   let secondPlayerTopCard= this.searchTopCard(players[nextPlayer(stepControl.player,playerSum)].palette)
   let thirdPlayerTopCard=this.searchTopCard(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)].palette)
   let fourthPlayerTopCard=this.searchTopCard(players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)].palette)
   //console.log(players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)].id);
   //console.log(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)].id);
   //console.log(players[nextPlayer(stepControl.player,playerSum)].id);
   
   
   
      if(playerSum ===2){
         if ( this.comparisonCard(currentPlayerTopCard,secondPlayerTopCard)){
            return true
         }
         
      }
      if(playerSum===3){
         
         if (this.comparisonCard(currentPlayerTopCard,secondPlayerTopCard) && this.comparisonCard(currentPlayerTopCard,thirdPlayerTopCard)) {
            return true
         }
         
      }
      if(playerSum===4){
         if (this.comparisonCard(currentPlayerTopCard,secondPlayerTopCard) && this.comparisonCard(currentPlayerTopCard,thirdPlayerTopCard) && this.comparisonCard(currentPlayerTopCard,fourthPlayerTopCard)) {
            return true
         }
      }
      //console.log(players[stepControl.player.id].palette);
      this.searchTopCard(players[stepControl.player.id].palette)
   }
// One Value Card
   addCard(storage,players,player,j,i){
               storage[j].count+=1;
               storage[j].card.push(players[player.id].palette[i])
   }// add card to storage
   searchOneValueCard(players:Player[],player:Player){
            let storage=[
               {value:7,count:0,card:[]},
               {value:6,count:0,card:[]},
               {value:5,count:0,card:[]},
               {value:4,count:0,card:[]},
               {value:3,count:0,card:[]},
               {value:2,count:0,card:[]},
               {value:1,count:0,card:[]},
            ]
            for (let i = 0; i < players[player.id].palette.length; i++) {

               switch(players[player.id].palette[i].value) {
                  case 7:{  
                     this.addCard(storage,players,player,0,i)
                     break;
                  }
                  case 6:{  
                     this.addCard(storage,players,player,1,i)
                     break;
                  }
                  case 5:{  
                     this.addCard(storage,players,player,2,i)
                     break;
                  }
                  case 4:{  
                     this.addCard(storage,players,player,3,i)
                     break;
                  }
                  case 3:{  
                     this.addCard(storage,players,player,4,i)
                     break;
                  }
                  case 2:{  
                     this.addCard(storage,players,player,5,i)
                     break;
                  }
                  case 1:{  
                     this.addCard(storage,players,player,6,i)
                     break;
                  }  
                  default:{
                     //console.log('error');
                     break
                  }
               }
            }

            let topOneValueCardSum={value:0,count:0,card:[]}
            for (let i = 0; i < storage.length; i++) {
               if ( topOneValueCardSum.count< storage[i].count ) {
                  topOneValueCardSum= storage[i]
               }
               
            }
            //console.log(topOneValueCardSum);
            
            return topOneValueCardSum
   }// search top sum one value card in current player hand

   playerSumRules(thisfunct,nextPlayer,players,stepControl,playerSum):boolean{
      let searhTopCard= this.searchTopCard
      let comparisonCard = this.comparisonCard
      let searchTopCard= this.searchTopCard
      let firstValue=thisfunct(players,stepControl.player,comparisonCard,searchTopCard)
      let secondValue=thisfunct(players,players[nextPlayer(stepControl.player,playerSum)],comparisonCard,searchTopCard)
      let thirdValue=thisfunct(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],comparisonCard,searchTopCard)
      let fourthValue=thisfunct(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)],comparisonCard,searchTopCard)
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
      
   }

   comparisonOneValue(first,any){
      if(first.count>any.count){
         return true
      }else if (first.count === any.count) {
         //console.log(first.card);
         
         if (this.comparisonCard(this.searchTopCard(first.card),this.searchTopCard(any.card))) {
            
            return true
         }
         return false
      }
   }//Check top sum all players

   oneValueCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
     //let comparisonOneValue =this.comparisonOneValue
      //return this.playerSumRules(this.searchOneValueCard,nextPlayer,players,stepControl,playerSum)
      let firstValue=this.searchOneValueCard(players,stepControl.player)
      let secondValue=this.searchOneValueCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchOneValueCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchOneValueCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])
      //console.log(firstValue);
      //console.log(secondValue);
      //console.log(thirdValue);
      //console.log(fourthValue);
      
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
   }

//One color card

   searchOneColorCard(players:Player[],player:Player){
   let storage=[
      {color:7,count:0,card:[]},
      {color:6,count:0,card:[]},
      {color:5,count:0,card:[]},
      {color:4,count:0,card:[]},
      {color:3,count:0,card:[]},
      {color:2,count:0,card:[]},
      {color:1,count:0,card:[]},
   ]
   for (let i = 0; i < players[player.id].palette.length; i++) {


      switch(players[player.id].palette[i].color) {
         case 7:{  
            this.addCard(storage,players,player,0,i)
            break;
         }
         case 6:{  
            this.addCard(storage,players,player,1,i)
            break;
         }
         case 5:{  
            this.addCard(storage,players,player,2,i)
            break;
         }
         case 4:{  
            this.addCard(storage,players,player,3,i)
            break;
         }
         case 3:{  
            this.addCard(storage,players,player,4,i)
            break;
         }
         case 2:{  
            this.addCard(storage,players,player,5,i)
            break;
         }
         case 1:{  
            this.addCard(storage,players,player,6,i)
            break;
         }  
         default:{
            //console.log('error');
            break
         }
      }
   }

   let topOneColorCardSum={color:1,count:0,card:[]}
   for (let i = 0; i < storage.length; i++) {
      if ( topOneColorCardSum.count< storage[i].count ) {
         topOneColorCardSum= storage[i]
      }else if( topOneColorCardSum.count=== storage[i].count ){
         if(this.comparisonCard(this.searchTopCard(storage[i].card),this.searchTopCard(topOneColorCardSum.card)))
         topOneColorCardSum= storage[i]
      }

   } 
   return topOneColorCardSum
  
   
   }// search top sum one color card in current player hand



   oneColorCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //return this.playerSumRules(this.searchOneColorCard,nextPlayer,players,stepControl,playerSum)
      let firstValue=this.searchOneColorCard(players,stepControl.player)
      let secondValue=this.searchOneColorCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchOneColorCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchOneColorCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])

      
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
   }

   //Paired card

   searchPairedCard(players:Player[],player:Player){
   let storage=  [{count:0,card:[]}]
      for(let i = 0; i < players[player.id].palette.length; i++) {
         if ( players[player.id].palette[i].value===2 || players[player.id].palette[i].value===4 || players[player.id].palette[i].value===6) {
            this.addCard(storage,players,player,0,i)
         }
      }
   //console.log(storage);

      return storage[0]
      }// search sum paired card in current player hand


   pairedCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //return this.playerSumRules(this.searchPairedCard,nextPlayer,players,stepControl,playerSum)
      let firstValue=this.searchPairedCard(players,stepControl.player)
      let secondValue=this.searchPairedCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchPairedCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchPairedCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
      }


   //Any color
   searchAnyColorCard(players:Player[],player:Player){
      let storage={count:0,card:[]}
      let colorStack=[
         {color:7,active:false},
         {color:6,active:false},
         {color:5,active:false},
         {color:4,active:false},
         {color:3,active:false},
         {color:2,active:false},
         {color:1,active:false},
      ]
      for(let i = 0; i < players[player.id].palette.length; i++) {
         storage.card.push(players[player.id].palette[i])
         for (let j = 0; j < colorStack.length; j++) {
            if (players[player.id].palette[i].color=== colorStack[j].color && !colorStack[j].active) {
               storage.count+=1
               colorStack[j].active=true
            }
         }
      }
   //console.log(storage);
      return storage
   }

   anyColorCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //return this.playerSumRules(this.searchAnyColorCard,nextPlayer,players,stepControl,playerSum)
      let firstValue=this.searchAnyColorCard(players,stepControl.player)
      let secondValue=this.searchAnyColorCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchAnyColorCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchAnyColorCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
   }

   //strit
   searchStreetCard(players:Player[],player:Player){
      let storage: SortStorageUnit[]=[
         {value:7,count:0,card:[]},
         {value:6,count:0,card:[]},
         {value:5,count:0,card:[]},
         {value:4,count:0,card:[]},
         {value:3,count:0,card:[]},
         {value:2,count:0,card:[]},
         {value:1,count:0,card:[]},
      ]
      //console.log("before sort");
      
      for (let i = 0; i < players[player.id].palette.length; i++) {
   
   
         switch(players[player.id].palette[i].value) {
            case 7:{  
               this.addCard(storage,players,player,0,i)
               break;
            }
            case 6:{  
               this.addCard(storage,players,player,1,i)
               break;
            }
            case 5:{  
               this.addCard(storage,players,player,2,i)
               break;
            }
            case 4:{  
               this.addCard(storage,players,player,3,i)
               break;
            }
            case 3:{  
               this.addCard(storage,players,player,4,i)
               break;
            }
            case 2:{  
               this.addCard(storage,players,player,5,i)
               break;
            }
            case 1:{  
               this.addCard(storage,players,player,6,i)
               break;
            }  
            default:{
               //console.log('error');
               break
            }
         }
      }
      //console.log("after sort");
      //console.log(storage);
      
      
      let storageStreet:StorageStreetUnit[]=[{count:0,card:[]}]
      let topStreetCardSum:StorageStreetUnit={count:0,card:[]}
      let l= 0
      for (let k = 0; k < storage.length; k++) {
         
         if(k===0 && storage[k].count>0){
            storageStreet[l]={count:storageStreet[l].count+1,card:storageStreet[l].card}
            for (let a = 0; a < storage[k].card.length; a++) {
               storageStreet[l].card.push(storage[k].card[a]);
            }
         }else if( storage[k].count>0) {
            storageStreet[l]={count:storageStreet[l].count+1,card:storageStreet[l].card}
            for (let a = 0; a < storage[k].card.length; a++){
               storageStreet[l].card.push(storage[k].card[a]);
            }
         }else{storageStreet[l+1]= {count:0,card:[]}; l++  }
         
      }
      //console.log("after storageStreet");
      //console.log(storageStreet);
      
      
      //console.log( player.id );
      //console.log(storage);
      //
      //console.log(storageStreet);
      
      
      for (let j = 0; j < storageStreet.length; j++) {
         if ( topStreetCardSum.count< storageStreet[j].count ) {
            topStreetCardSum= storageStreet[j]
         }
         //console.log(`storage top length serch ${j}`);
         
      }
      //console.log(topStreetCardSum);
      
      return topStreetCardSum
}// search top sum street card in current player hand


streetCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){

   //return this.playerSumRules(this.searchStreetCard,nextPlayer,players,stepControl,playerSum)
   let firstValue=this.searchStreetCard(players,stepControl.player)
      let secondValue=this.searchStreetCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchStreetCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchStreetCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])
      //console.log(firstValue);
      //console.log(secondValue);
      //console.log(thirdValue);
      //console.log(fourthValue);
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}
   
}
   //lower
   
   searchLowerCard(players:Player[],player:Player){
      let storage=  [{count:0,card:[]}]
         for(let i = 0; i < players[player.id].palette.length; i++) {
            if ( players[player.id].palette[i].value < 4) {
               this.addCard(storage,players,player,0,i)
            }
         }
      //console.log(storage);
         return storage[0]
   }// search sum lower card in current player hand

   lowerCard(players:Player[],stepControl:StepControl,playerSum:PlayerSum,nextPlayer){
      //return this.playerSumRules(this.searchLowerCard,nextPlayer,players,stepControl,playerSum)

      let firstValue=this.searchLowerCard(players,stepControl.player)
      let secondValue=this.searchLowerCard(players,players[nextPlayer(stepControl.player,playerSum)])
      let thirdValue=this.searchLowerCard(players,players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)])
      let fourthValue=this.searchLowerCard(players,players[nextPlayer(players[nextPlayer(players[nextPlayer(stepControl.player,playerSum)],playerSum)],playerSum)])
      if ( playerSum === 2 ) {
         if ( this.comparisonOneValue(firstValue,secondValue)) {
            return true
         }
         return false
      }
      if ( playerSum === 3 ) {
         if ( this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) ) {
            return true
         }
         return false
      }
      if ( playerSum === 4 ) {
         if (this.comparisonOneValue(firstValue,secondValue) && this.comparisonOneValue(firstValue,thirdValue) && this.comparisonOneValue(firstValue,fourthValue)) {
            return true
         }
         return false
      }else{return false}

   }

}
   