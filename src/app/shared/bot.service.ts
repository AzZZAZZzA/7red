import { Injectable } from "@angular/core";
import {CheckStep} from "../shared/checkStep.interface"
import {GameService} from "./game.service"

export interface Result{
   toStackId?:number
   cardId:number
   result:boolean
}

export interface  StackResult{
   toStackId:number
   cardId:number
   result:boolean
}

@Injectable({ providedIn: 'root' })
export class BotService {
   constructor(public chackStep:CheckStep,public gameService: GameService){}

   
   firstBotAnalyst(){
      let currentPlayer = this.gameService.stepControl.player
      let testPlayers = this.gameService.players
      let testStack = this.gameService.stack
      let testedPlayers = this.gameService.players
      let testStepControl=this.gameService.stepControl
      ////console.log("bot start firstanalysis")
      let arrayOfResults: Result[]=[]
      if (this.chackStep.check(testStack,this.gameService.players,this.gameService.stepControl,this.gameService.playerSum,this.gameService.nextPlayer)) {
         let luckyresult:Result={cardId:99,result:true}
         return luckyresult
      }
      for (let card = 0; card < testPlayers[currentPlayer.id].hand.length; card++) {
         ////console.log(`bot start ${card} step analysis`)
         let cardId=testedPlayers[currentPlayer.id].hand[0].id
         testedPlayers[currentPlayer.id].hand[0].active=true
         this.gameService.cardToPalette(testedPlayers[currentPlayer.id],testStepControl)
         
         let boolResult= this.chackStep.check(testStack,testedPlayers,testStepControl,this.gameService.playerSum,this.gameService.nextPlayer)
         let result:Result={cardId:cardId,result: boolResult }

         ////console.log(result);
         arrayOfResults.push( result )
         this.gameService.removePaletteCard(testedPlayers[currentPlayer.id],testStepControl)
         for (const card of testPlayers[currentPlayer.id].hand) {
            card.active= false
         }
         
      }
      ////console.log( arrayOfResults )
      let luckyresult:Result={cardId:0,result: false }
      for (let result = 0; result < arrayOfResults.length; result++) {
         if (arrayOfResults[result].result===true) {
            if ( luckyresult.result===false ) {
               luckyresult=arrayOfResults[result]
            }else{

               let handIdluck
               for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
                  if (testPlayers[currentPlayer.id].hand[i].id===luckyresult.cardId) {
                     handIdluck=i
                  }
                }
                let handIdArr
                for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
                   if (testPlayers[currentPlayer.id].hand[i].id===arrayOfResults[result].cardId) {
                      handIdArr=i
                   }
                 }
               
               if (this.chackStep.comparisonCard(currentPlayer.hand[handIdluck],currentPlayer.hand[handIdArr])) {
                  luckyresult=arrayOfResults[result]
               }
            }
            
         } 
         
      }
      return luckyresult
   }
   botAnalysis(){
      let currentPlayer = this.gameService.stepControl.player
      let testPlayers = this.gameService.players
      let testStack = this.gameService.stack
      //console.log("bot start topanalysis")
      //let arrayOfSecondResults: Result[]=[]

      let luckyresult= this.firstBotAnalyst()
      //console.log("after bot topanalisis");
      
      if (luckyresult.result=== true) {
         let handId
         for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
            if (testPlayers[currentPlayer.id].hand[i].id===luckyresult.cardId) {
               handId=i
            } 
            
         }
         testPlayers[currentPlayer.id].hand[handId].active=true

         setTimeout(() => {
            this.gameService.cardToPalette(testPlayers[currentPlayer.id],this.gameService.stepControl)
         }, 5000);
         
         setTimeout(() => {
            document.getElementById('endStep').click()
         }, 10000);
         return
      }else
      if (luckyresult.result=== false) {
         let currentPlayer = this.gameService.stepControl.player
         let testPlayers = this.gameService.players
         //console.log("bot start stackanalysis")
         let arrayOfStackResults:StackResult[]=[]
         for (let card = 0; card < testPlayers[currentPlayer.id].hand.length; card++) {
            //console.log(`bot start ${card} step analysis`)
            let testedPlayers = this.gameService.players
            let testStack = this.gameService.stack
            let testStepControl=this.gameService.stepControl
            let cardToStackId=testedPlayers[currentPlayer.id].hand[0].id
            testedPlayers[currentPlayer.id].hand[0].active=true
            //console.log("Start testing card to stack");
            //console.log(testedPlayers[currentPlayer.id].hand[0]);
            
            this.gameService.cardToStack(testedPlayers,testStack,testStepControl)
            let luckyPaletteResult= this.firstBotAnalyst()

            this.gameService.removeStackCard(testedPlayers[currentPlayer.id],testStack,testStepControl,)
            for (const card of testPlayers[currentPlayer.id].hand) {
               card.active= false
            }
            let stackResult={toStackId:cardToStackId,cardId: luckyPaletteResult.cardId,result:luckyPaletteResult.result}
            arrayOfStackResults.push(stackResult)
         }
         
         
         for (let resultStack = 0; resultStack < arrayOfStackResults.length; resultStack++) {
            //console.log(`result stack№ ${resultStack}`);
            
            //console.log(arrayOfStackResults[resultStack]);
            
            if (arrayOfStackResults[resultStack].cardId===99) {

               luckyresult=arrayOfStackResults[resultStack]
               //console.log("current player");
               //console.log(currentPlayer);
               //console.log("Card tostack active");

               let handToStackId
               for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
                  if (testPlayers[currentPlayer.id].hand[i].id===arrayOfStackResults[resultStack].toStackId) {
                     handToStackId=i
                  } 
               }
               //console.log(testPlayers[currentPlayer.id].hand[handToStackId]);
               
               
               testPlayers[currentPlayer.id].hand[handToStackId].active=true
               setTimeout(() => {
                  this.gameService.cardToStack(this.gameService.players,this.gameService.stack,this.gameService.stepControl)
               }, 5000);
               setTimeout(() => {
                  document.getElementById('endStep').click()
               }, 10000);
               return
            }else if (arrayOfStackResults[resultStack].result!==false) {
               //console.log("current player");
               //console.log(currentPlayer);
               //console.log("Card tostack active");

               let handToStackId
               for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
                  if (testPlayers[currentPlayer.id].hand[i].id===arrayOfStackResults[resultStack].toStackId) {
                     handToStackId=i
                  } 
               }
               //console.log(testPlayers[currentPlayer.id].hand[handToStackId]);
               
               
               testPlayers[currentPlayer.id].hand[handToStackId].active=true

               this.gameService.cardToStack(this.gameService.players,this.gameService.stack,this.gameService.stepControl)

               //console.log("Card topalette active");


               let handIdluck
               for (let i = 0; i < testPlayers[currentPlayer.id].hand.length; i++) {
                  if (testPlayers[currentPlayer.id].hand[i].id===arrayOfStackResults[resultStack].cardId) {
                     handIdluck=i
                  }
                }

               //console.log(testPlayers[currentPlayer.id].hand[handIdluck]);
               testPlayers[currentPlayer.id].hand[handIdluck].active=true

               setTimeout(() => {
                  this.gameService.cardToPalette(this.gameService.players[this.gameService.stepControl.player.id],this.gameService.stepControl)
               }, 5000);
               
               setTimeout(() => {
                  document.getElementById('endStep').click()
               }, 10000);
               return
            }
         }

                  alert(`Bot ${this.gameService.stepControl.player.id+1} end game`)
                  setTimeout(() => {
                     document.getElementById('gameOver').click()
                  }, 5000);

      }
   }


   botStep(){
      this.botAnalysis()
      //console.log("Step")
      
   }

}