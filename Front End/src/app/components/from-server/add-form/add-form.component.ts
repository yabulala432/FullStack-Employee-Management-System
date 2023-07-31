import {
  FetchEmpRoleService,
  empRoleType,
} from 'src/app/services/fetchEmpRoles.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddFormValidators } from './add-form-validators/add-form.validators';
import { FetchService } from 'src/app/services/fetchEmployee.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
})
export class AddFormComponent implements OnInit {
  rolesArray: any[] = [];
  reportsToArray: any[] = [];
  roleTobeAdded: string = '';
  reportsToAdd: string = '';

  constructor(
    private fetchRolesService: FetchEmpRoleService,
    private fetchEmployeeService: FetchService
  ) {}

  onFormSubmit() {
    if (this.form.status === 'VALID') {
      const reportsToName: string = this.reportsTo?.value as string;
      const body = {
        name: this.name?.value,
        role: this.role?.value,
        tel: this.tel?.value,
        imageUrl: this.imageUrl?.value,
        email: this.email?.value,
      };
      this.fetchEmployeeService.addChild(reportsToName, body).subscribe({
        next: (response) => {
          console.log(response);
          this.resetForm();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }else{
      alert('Invalid form submission');
    }
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tel: new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(12)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    imageUrl: new FormControl('', [
      Validators.required,
      AddFormValidators.shouldNotContainSpaces,
    ]),
    role: new FormControl('', [
      Validators.required,
      AddFormValidators.shouldHoldValue,
    ]),
    reportsTo: new FormControl('', [
      Validators.required,
      AddFormValidators.shouldHoldValue,
    ]),
  });

  ngOnInit() {
    this.fetchRolesService.getData().subscribe({
      next: (response: any) => {
        console.log(response);
        for (let role of response) {
          this.rolesArray.push(role.role);
        }
      },
    });

    this.role?.valueChanges.subscribe({
      next: (value: string | null) => {
        this.fetchRolesService.findRole(value as string).subscribe({
          next: (response: any) => {
            for (let res of response) {
              this.fetchEmployeeService
                .getEmpNameFromRole(res?.worksUnder)
                .subscribe({
                  next: (response: any) => {
                    // console.log(response)
                    this.reportsToArray = [];
                    for (let res of response) {
                      // console.log(res?.name);
                      this.reportsToArray.push(res?.name);
                    }
                    return;
                  },
                });
            }
          },
        });
      },
    });
  }

  get name() {
    return this.form.get('name');
  }

  get tel() {
    return this.form.get('tel');
  }

  get email() {
    return this.form.get('email');
  }

  get imageUrl() {
    return this.form.get('imageUrl');
  }

  get reportsTo() {
    return this.form.get('reportsTo');
  }

  get role() {
    return this.form.get('role');
  }

  resetForm(){
    const values = ["name",'role','reportsTo','imageUrl','tel','email',];
    values.map((val)=> {
      // this.form.get(val)?.setValue('');
      this.form.get(val)?.reset();
    });

  }
  addRole() {
    if (this.reportsToAdd != '' && this.roleTobeAdded != '') {
      const addedRole: empRoleType = {
        role: this.roleTobeAdded.toUpperCase(),
        worksUnder: this.reportsToAdd,
      };
      this.fetchRolesService.addRole(addedRole).subscribe({
        next: (res) => console.log(res),
        error: (err) => console.error(err),
      });
    }
  }
}
