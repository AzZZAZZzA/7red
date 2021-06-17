import { Component, OnChanges  } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})


export class SettingComponent {
  public selectedValue
public players= [    {value: '2', viewValue: '1'},
{value: '3', viewValue: '2'},
{value: '4', viewValue: '3'}]


  constructor() { }
    onSubmit(){
      console.log(this.selectedValue);
      
  localStorage.setItem('PlayerSum',this.selectedValue )
  }

}
