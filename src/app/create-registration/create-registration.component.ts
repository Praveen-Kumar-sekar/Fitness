import { Component } from '@angular/core';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent {

  packages:string[] =["Monthly","Quarterly","Yearly"];
  genders:string[]=["Male","Female"];
  importantList:string[]=["Toxic Fat reduction",
  "Energy and Endurance",
  "Building Lean Muscle",
  "Healthier Digestive System",
  "Sugar Craving Body",
  "Fitness"];
  yesOrNO:string[]=["yes","No"];
}
