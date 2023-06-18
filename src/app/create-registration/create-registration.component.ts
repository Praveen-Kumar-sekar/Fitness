import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../models/users.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {

  packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  genders: string[] = ["Male", "Female"];
  importantList: string[] = ["Toxic Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"];
  yesOrNO: string[] = ["yes", "No"];

  registerForm!: FormGroup;
  userIdToUpdate!: number;
  isUpdateActive: boolean = false;

  constructor(private fb: FormBuilder, 
    private activateRoute: ActivatedRoute, 
    private api: ApiService, 
    private toastSerice: NgToastService,
    private router:Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res);
    });
    this.activateRoute.params.subscribe((val => {
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe((
        res => {
          this.isUpdateActive = true;
          this.fillFormToUpdate(res);

        }
      ));
    }));

  }

  submit() {
    this.api.postRegistration(this.registerForm.value).subscribe((res => {
      this.toastSerice.success({ detail: 'Success', summary: 'Registration Successful', duration: 3000 });
      this.registerForm.reset();
    }))

  }

  update(){
    this.api.updateRegisterUser(this.registerForm.value,this.userIdToUpdate).subscribe((res => {
      this.toastSerice.success({ detail: 'Success', summary: 'Successfully Updated', duration: 3000 });
      this.registerForm.reset();
      this.router.navigate(['list']);
    }))
  }
  calculateBmi(heightValue: number) {
    const weight = this.registerForm.value.weight;
    const height = heightValue;
    const bmi = weight / (height * height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("UnderWeight");
        break;

      case (bmi >= 18.5 && bmi < 25):
        this.registerForm.controls['bmiResult'].patchValue("NormalWeight");
        break;

      case (bmi > 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Overweight");
        break;
      default:
        this.registerForm.controls['bmiResult']
    }

  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })

  }
}
