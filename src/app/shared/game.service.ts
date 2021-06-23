import { Injectable } from "@angular/core";
import {CheckStep} from "../shared/checkStep.interface"
import {CheckGameOver} from "../shared/checkGameover.interface"


export interface Card{
   id: number
   value: number
   color: number
   rule?: number
   active?:boolean
}
export interface Player{
   id: number
   hand: Card[]
   palette: Card[]
   gameOver?:boolean
}

export enum PlayerSum {
      MIN = 2,
      MID = 3,
      MAX = 4
   }

export interface StepControl{
   player:Player
   cardToPalette:boolean
   cardToStack:boolean
   cardToPaletteId?:number
   cardToStackId?:number
}



@Injectable({ providedIn: 'root' })
export class GameService {
   
   constructor(public checkStep:CheckStep,public checkGameOver:CheckGameOver){}
   public game = false
   public playerSum: PlayerSum = 4
   public players: Player[]
   public stack: Card[]
   public stepControl:StepControl
   public cards: Card[]

   
   ruleFromColor(color:number){
      switch(color){
         case 7:{  
               return "Big"
            break;
         }
         case 6:{  
               return "value"
            break;
         }
         case 5:{  
               return "color"
            break;
         }
         case 4:{  
               return "paired"
            break;
         }
         case 3:{  
            return "differ"
            break;
         }
         case 2:{  
            return "strit"
            break;
         }
         case 1:{  
            return "lower"
            break;
         }  
         default:{
            alert('error');
            break
         }
      }
   }
   deal(){
      this.game= true 
    //console.log(this.cards)
      for (let circle = 0; circle < 7; circle++) {
         for (let i = 0; i < this.playerSum; i++) { 
            this.players[i].hand.push(this.cards.shift())
            
            
         }
      }
     
      for (let i = 0; i < this.players.length; i++) { 
         this.players[i].palette.push(this.cards.shift())
      }
      let idOfCurrentPlayer:number
      if(this.playerSum ===2){
         if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[1].palette[0])){
            idOfCurrentPlayer= 0
         }else{
         idOfCurrentPlayer= 1}
      }
      if(this.playerSum===3){
         
         if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[1].palette[0])){
            if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[2].palette[0])) {
               idOfCurrentPlayer=0
            }else{
               idOfCurrentPlayer= 2
            }
         }else{
            if (this.checkStep.comparisonCard(this.players[1].palette[0],this.players[2].palette[0])) {
            idOfCurrentPlayer=1
            }else{
               idOfCurrentPlayer=2
            }
         
         }

      }
      if(this.playerSum===4){
         if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[1].palette[0])){
            if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[2].palette[0])) {
               if (this.checkStep.comparisonCard(this.players[0].palette[0],this.players[3].palette[0]) ){
                  idOfCurrentPlayer= 0
               }else{
                  idOfCurrentPlayer= 3
               }
            }else{
               if (this.checkStep.comparisonCard(this.players[2].palette[0],this.players[3].palette[0]) ){
                  if (this.checkStep.comparisonCard(this.players[2].palette[0],this.players[3].palette[0]) ){
                     idOfCurrentPlayer= 2
                  }else{
                     idOfCurrentPlayer= 3
                  }
               }else{
                  idOfCurrentPlayer= 3
               }
            }
         }else{
            if (this.checkStep.comparisonCard(this.players[1].palette[0],this.players[2].palette[0])) {
               if (this.checkStep.comparisonCard(this.players[1].palette[0],this.players[3].palette[0]) ){
                  idOfCurrentPlayer= 1
               }else{
                  idOfCurrentPlayer= 3
               }
            }else{
                           if (this.checkStep.comparisonCard(this.players[2].palette[0],this.players[3].palette[0]) ){
               idOfCurrentPlayer= 2
            }else{
               idOfCurrentPlayer= 3
            }
            
            }

         }
      }
      //console.log(idOfCurrentPlayer);
      
      this.stepControl.player= this.players[this.nextPlayer(this.players[idOfCurrentPlayer],this.playerSum)]
      if (this.stepControl.player.id===0) {
         this.checkStep.stackLock= false
      }else{
         this.checkStep.stackLock=true
      }
   
   }


   activCard(card,player){
      //if (player.id===0) {
        for (let i = 0; i < player.hand.length; i++) {
            if (player.hand[i].id===card.id){
            //console.log(i);
            for (const card of player.hand) {
               card.active= false
            }
           card.active= true}
       } 
      //}else{
      //console.log('its any card');
      //}
   }

removeStackCard(player,stack,stepControl){
   let elem= stack[stepControl.cardToStackId]
   stack.splice(stepControl.cardToStackId,1)
   player.hand.push(elem)
   stepControl.cardToStack=false
   for (const card of player.hand) {
      card.active= false
   }
}

removePaletteCard(player,stepControl){
   let elem= player.palette[stepControl.cardToPaletteId ]
   player.palette.splice(stepControl.cardToPaletteId,1)
   player.hand.push(elem)
   stepControl.cardToPalette=false
   for (const card of player.hand) {
      card.active= false
   }

}

   cardToPalette(player:Player,stepControl:StepControl){
      if(player.id=== stepControl.player.id ){
         if (stepControl.cardToPalette===false) {
            for (let i=0; i< player.hand.length;i++){
            //console.log(player.hand[i]);
            if (player.hand[i].active===true) {
               let elem = player.hand[i]
               player.hand.splice(i,1)
               stepControl.cardToPaletteId=player.palette.length
               player.palette.push(elem)
               stepControl.cardToPalette=true
               return
               }
            }
            alert('Сначала нужно выбрать карту')
         }else{
            let nowActiveCard:boolean
            for (let i=0; i< player.hand.length;i++){
               //console.log(player.hand[i]);
               if (player.hand[i].active===true) {nowActiveCard= true}
            }
            if ( nowActiveCard===true ) {
               alert("В этом ходе палитра уже задействована. Обе кары возвращены в руку")
               this.removePaletteCard(player,stepControl)
            }else{
               this.removePaletteCard(player,stepControl)
            }
         }
      }else{alert("В палитру карта уже выложена или использованы чужие карты")}
   }
   cardToStack(players,stack,stepControl){
      if (this.checkStep.stackLock=== true) {
         //console.error('to stack true');
         
         return
      }
      let player= players[stepControl.player.id]
      if(player.id=== stepControl.player.id){
         if (stepControl.cardToStack===false) {
            //console.log("worck");
            for (let i=0; i< player.hand.length;i++){
               //console.log(player.hand[i]);
               if (player.hand[i].active===true) {
                  let elem = player.hand[i]
                  player.hand.splice(i,1)
                  stepControl.cardToStackId=stack.length
                  stack.push(elem)
                  stepControl.cardToStack=true
                  return
                  }}
               alert('Сначала нужно выбрать карту')
         }else{
            let nowActiveCard:boolean
            for (let i=0; i< player.hand.length;i++){
               //console.log(player.hand[i]);
               if (player.hand[i].active===true) {nowActiveCard= true}
            }
            if ( nowActiveCard===true ) {
               alert("В этом ходе правило уже задано. Обе карты возвращены в руку")
               this.removeStackCard(player,stack,stepControl)
            }else{
                  this.removeStackCard(player,stack,stepControl)
            }
         }
      }else{alert("Ход у другого игрока")}
   }
   //stepFunction(player){
   //   this.stepControl.player.id= player.id 
   //   if(this.stepControl.cardToPalette===true){
   //      
   //      //console.log(`Card to palette ${this.stepControl.cardToPalette}`);
   //      
   //   }
   //   if(this.stepControl.cardToStack===true){
   //      
   //console.log(`Card to stack ${this.stepControl.cardToStack}`);
   //   }
   //}




   nextPlayer(nowPlayer:Player,playerSum:PlayerSum,){
      let nextID:number
      if (nowPlayer.id+1< playerSum) {
         nextID = nowPlayer.id+1
         
      }else{
         nextID = 0
      }
      return nextID
   }

   nextStapPlayer(){
      let nextId=this.nextPlayer(this.stepControl.player,this.playerSum)
      if (this.checkGameOver.checkGameOver.count>0) {
         if (this.checkGameOver.checkGameOver.playersId[nextId]===0) {
               nextId=this.nextPlayer({id:nextId,hand:[],palette:[]},this.playerSum)
               if (this.checkGameOver.checkGameOver.playersId[nextId]===0) {
                  nextId=this.nextPlayer({id:nextId,hand:[],palette:[]},this.playerSum)
               }

         }
      }
      this.stepControl={player:this.players[nextId], cardToPalette:false, cardToStack:false}
      //console.log(this.players[nextId].id);
      
      if (this.players[nextId].id===0) {
         this.checkStep.stackLock= false
         //console.log('edit false');
         
      }else{
         this.checkStep.stackLock=true
         //console.log('edit true');
         
      }

   }

}