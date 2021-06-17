import { Injectable } from "@angular/core";

export interface GameOver{
   count:number
   playersId:number[]
}
@Injectable({providedIn:'root'})
export class CheckGameOver{
constructor(){}
   public checkGameOver:GameOver={count:0,playersId:[0,0,0,0]}
}