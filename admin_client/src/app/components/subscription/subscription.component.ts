import { Component, OnInit } from '@angular/core';
import { Subscription, SubscriptionLevel } from 'src/app/models/subscription';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  constructor(private subService: SubscriptionService) {
    this.subList = [];
   }

  ngOnInit(): void {
  }

  subList: Subscription[];

  newSub: Subscription | undefined;

  refreshSubList(){
    this.subList = [];
    this.subService.retrieveSubscriptions(this.subList);
  }

  startNewSubscription(){
    this.newSub = new Subscription();
  }

  updateSubscription(sub:Subscription){
    this.subService.updateSub(sub);
  }

  submitNewSub(){
    if(this.newSub){
      this.subService.addNewSub(this.newSub);
    }
    this.newSub = undefined;
  }

  addNewLevel(){
    if(!this.newSub.levels){
      this.newSub.levels = [];
    }
    let subLevel = new SubscriptionLevel();
    subLevel.price = 1.00;
    subLevel.desc = "New Description Here";
    subLevel.name = "Level Name Here";
    subLevel.level = this.newSub.levels.push(subLevel);

  }

  removeSubLevel(subLevel: SubscriptionLevel){
    this.newSub.levels = this.newSub.levels.filter((value: SubscriptionLevel, index: number, array: SubscriptionLevel[])=>{
      return subLevel.level != value.level;
    });

    this.newSub.levels.forEach((value: SubscriptionLevel, index: number, array: SubscriptionLevel[]) =>{
      value.level = index;
    });
  }

}
