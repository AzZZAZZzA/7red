import { Component, OnInit } from '@angular/core';
import { GameService } from '../shared/game.service';
import {CheckStep} from '../shared/checkStep.interface'
import {CheckGameOver} from '../shared/checkGameover.interface'
import {BotWorker} from "../shared/botWorker.service"

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(public gameService: GameService, public checkStep:CheckStep,public botWorker: BotWorker) { }

  stepEnd(){
    if (this.checkStep.stackLock=== true) {
      return
    }
    if(this.gameService.checkStep.check( this.gameService.stack, this.gameService.players, this.gameService.stepControl, this.gameService.playerSum, this.gameService.nextPlayer)){
       
       //let nextPlayerId= this.nextPlayer(this.stepControl.player,this.playerSum)
       this.gameService.nextStapPlayer()
       //console.log(`Next player ${nextPlayerId}`);
       if (this.gameService.stepControl.player.id!==0) {
        this.botWorker.botStep()
       }
    }else{
       alert("Несоответствие");
    }
 }

 gameOver(){
  if (this.checkStep.stackLock=== true) {
    return
  }
    if(this.gameService.stepControl.cardToPalette=== true){
     this.gameService.removePaletteCard(this.gameService.players[this.gameService.stepControl.player.id],this.gameService.stepControl)
    }
    if (this.gameService.stepControl.cardToStack===true) {
     this.gameService.removeStackCard(this.gameService.players[this.gameService.stepControl.player.id],this.gameService.stack,this.gameService.stepControl)
    }
    this.gameService.players[this.gameService.stepControl.player.id].gameOver=true
    this.gameService.players[this.gameService.stepControl.player.id].palette= []
    this.gameService.checkGameOver.checkGameOver.count+=1 ;
    for (let x = 0; x < this.gameService.players.length; x++) {
     if(this.gameService.players[x].gameOver){
        this.gameService.checkGameOver.checkGameOver.playersId[x]=0
     } else{
        this.gameService.checkGameOver.checkGameOver.playersId[x]=1
     }
     
    }

    if ( this.gameService.checkGameOver.checkGameOver.count > this.gameService.playerSum-2) {
     let winnerId
     for (let i = 0; i < this.gameService.checkGameOver.checkGameOver.playersId.length; i++) {
        if(this.gameService.checkGameOver.checkGameOver.playersId[i]===1){
           winnerId=i
        }
     }
     alert(`Game over. Winner ${winnerId+1}`)
     location.reload()
    }
    this.gameService.nextStapPlayer()
    if (this.gameService.stepControl.player.id!==0) {
    this.botWorker.botStep()
    }
}




  ngOnInit(): void {
    if (Number(localStorage.getItem('PlayerSum'))) {
      this.gameService.playerSum=Number(localStorage.getItem('PlayerSum'))
    }
    
    console.log("init");
    this.gameService.players= []
    this.gameService.stack=[{id:0,value:0,color:7}]
    this.gameService.stepControl={player:this.gameService.players[0],cardToPalette: false, cardToStack:false}
    this.gameService.cards=[
      {id:1 , value:7,color:7},
      {id:2 , value:6,color:7},
      {id:3 , value:5,color:7},
      {id:4 , value:4,color:7},
      {id:5 , value:3,color:7},
      {id:6 , value:2,color:7},
      {id:7 , value:1,color:7},
      {id:8 , value:7,color:6},
      {id:9 , value:6,color:6},
      {id:10, value:5,color:6},
      {id:11, value:4,color:6},
      {id:12, value:3,color:6},
      {id:13, value:2,color:6},
      {id:14, value:1,color:6},
      {id:15, value:7,color:5},
      {id:16, value:6,color:5},
      {id:17, value:5,color:5},
      {id:18, value:4,color:5},
      {id:19, value:3,color:5},
      {id:20, value:2,color:5},
      {id:21, value:1,color:5},
      {id:22, value:7,color:4},
      {id:23, value:6,color:4},
      {id:24, value:5,color:4},
      {id:25, value:4,color:4},
      {id:26, value:3,color:4},
      {id:27, value:2,color:4},
      {id:28, value:1,color:4},
      {id:29, value:7,color:3},
      {id:30, value:6,color:3},
      {id:31, value:5,color:3},
      {id:32, value:4,color:3},
      {id:33, value:3,color:3},
      {id:34, value:2,color:3},
      {id:35, value:1,color:3},
      {id:36, value:7,color:2},
      {id:37, value:6,color:2},
      {id:38, value:5,color:2},
      {id:39, value:4,color:2},
      {id:40, value:3,color:2},
      {id:41, value:2,color:2},
      {id:42, value:1,color:2},
      {id:43, value:7,color:1},
      {id:44, value:6,color:1},
      {id:45, value:5,color:1},
      {id:46, value:4,color:1},
      {id:47, value:3,color:1},
      {id:48, value:2,color:1},
      {id:49, value:1,color:1}
   ]
   this.gameService.checkGameOver.checkGameOver={count:0,playersId:[0,0,0,0]}
    this.gameService.cards.sort(()=>Math.random()-0.5);
    for (let idPlayer = 0; idPlayer < this.gameService.playerSum; idPlayer++) {
      this.gameService.players.push({id:idPlayer,hand:[],palette:[]})
      }
this.gameService.deal()
    //console.log(this.gameService.cards);
if (this.gameService.stepControl.player.id!==0) {
  this.botWorker.botStep()
}
    
for (const player of this.gameService.players) {
  //console.log(player.id, player.hand, player.palette );
  
}

  }

}




