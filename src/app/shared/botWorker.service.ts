import { Injectable } from "@angular/core";
import {BotService} from './bot.service'


@Injectable({ providedIn: 'root' })
export class BotWorker {
   constructor( public botService:BotService){}
   botStep(){
      this.botService.botStep()
      console.log("Step")
      
   }
}