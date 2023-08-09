import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  EmpRoleType,
  FetchRoleService,
} from '../../services/fetch-role.service';
import { FetchEmployeeService } from '../../services/fetch-employee.service';
import { AddFormValidators } from './Validator/add-Form.validator';

// interface EmpRole {
//   role: string;
//   worksUnder: string[];
// }

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  rolesArray: any[] = [];
  reportsToArray: any[] = [];
  roleTobeAdded: string = '';
  reportsToAdd: string = '';

  constructor(
    private fetchRolesService: FetchRoleService,
    private fetchEmployeeService: FetchEmployeeService
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
    } else {
      alert('Invalid form submission');
    }
  }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    tel: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
    ]),
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
    this.fetchRolesService.getAll().subscribe({
      next: (response: any) => {
        for (let role of response) {
          this.rolesArray.push(role.role);
        }
      },
    });

    this.role?.valueChanges.subscribe({
      next: (value: string | null) => {
        if (value) {
          this.fetchRolesService.findRole(value).subscribe({
            next: (response: any) => {
              for (let res of response) {
                this.reportsToArray = [];
                for (let value of res.worksUnder)
                  this.fetchEmployeeService
                    .getEmpNameFromRole(value)
                    .subscribe({
                      next: (response: any) => {
                        for (let res of response) {
                          this.reportsToArray.push(res?.name);
                        }
                        return;
                      },
                    });
              }
            },
          });
        }
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

  resetForm() {
    const values = ['name', 'role', 'reportsTo', 'imageUrl', 'tel', 'email'];
    values.map((val) => {
      // this.form.get(val)?.setValue('');
      this.form.get(val)?.reset();
    });
  }

  addRole() {
    if (this.reportsToAdd != '' && this.roleTobeAdded != '') {
      const addedRole: EmpRoleType = {
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
