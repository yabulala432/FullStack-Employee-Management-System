import { Component, OnInit } from '@angular/core';
import { FetchRoleService } from '../../services/fetch-role.service';
import { FetchEmployeeService } from '../../services/fetch-employee.service';
import { EmployeeRole } from '../../models/employeeRole';
import { FormControl, FormGroup } from '@angular/forms';
import { EmployeeModel } from '../../models/employee.model';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css'],
})
export class UpdateEmployeeComponent implements OnInit {
  employees: string[] = [];

  parents: string[] = [];
  rolesArray: string[] = [];
  worksUnderArray: string[] = [];
  removeParentRoleArray: string[] = [];

  constructor(
    private fetchRole: FetchRoleService,
    private fetchEmp: FetchEmployeeService
  ) {}

  ngOnInit() {
    this.fetchRole.getAll().subscribe({
      next: (response) => {
        (response as EmployeeRole[]).map((value) => {
          if (value.role != 'CEO') this.rolesArray.push(value.role);
          this.worksUnderArray.push(value.role);
        });
      },
    });

    this.rolesValue?.valueChanges.subscribe({
      next: (value: string | null) => {
        this.removeParentRoleArray = [];
        if (value) {
          this.fetchRole.findRole(value).subscribe({
            next: (response: any) => {
              for (let res of response) {
                (res as EmployeeRole).worksUnder.map((value) => {
                  this.removeParentRoleArray.push(value);
                });
              }
            },
          });
        }
      },
    });

    this.fetchEmp.getData().subscribe({
      next: (response) => {
        (response as EmployeeModel[]).map((value) => {
          this.employees.push(value.name);
        });
      },
    });

    this.childEmployee?.valueChanges.subscribe({
      next: (responsed) => {
        this.parents = [];
        if (responsed) {
          this.fetchEmp.getIdFromName(responsed).subscribe({
            next: (response) => {
              this.fetchEmp
                .getEmployeeExcludingDescendants(response as string)
                .subscribe({
                  next: (response) => {
                    (response as EmployeeModel[]).map((value) => {
                      if (responsed != value.name) {
                        this.parents.push(value.name);
                      } else {
                        console.log(responsed, value.name);
                      }
                    });
                  },
                });
            },
          });
        }
      },
    });
  }

  rolesForm = new FormGroup({
    rolesValue: new FormControl(''),
    worksUnderValue: new FormControl(''),
    removeParentValue: new FormControl(''),
  });

  changeParentForm = new FormGroup({
    childEmployee: new FormControl(''),
    parentEmployee: new FormControl(''),
  });

  get childEmployee() {
    return this.changeParentForm.get('childEmployee');
  }

  get parentEmployee() {
    return this.changeParentForm.get('parentEmployee');
  }

  get rolesValue() {
    return this.rolesForm.get('rolesValue');
  }

  get worksUnderValue() {
    return this.rolesForm.get('worksUnderValue');
  }

  get removeParent() {
    return this.rolesForm.get('removeParentValue');
  }

  onAddClick() {
    const theRole = this.rolesValue?.value;
    const worksUnderVal = this.worksUnderValue?.value;
    if (worksUnderVal && theRole) {
      this.fetchRole.pushToRole(theRole, worksUnderVal).subscribe({
        next: () => {
          this.rolesForm.reset();
        },
        error: (error) => {
          alert(`Value not Added!!! ${error.message}`);
        },
      });
    }
  }

  onDeleteClick() {
    const theRole = this.rolesValue?.value;
    const worksUnderVal = this.removeParent?.value;
    if (theRole && worksUnderVal)
      this.fetchRole.deleteFromRole(theRole, worksUnderVal).subscribe({
        next: () => {
          this.rolesForm.reset();
        },
        error: (err) => {
          alert(err.message);
        },
      });
  }

  onChangeParent() {
    console.log(this.childEmployee?.value, this.parentEmployee?.value);
    if (this.childEmployee?.value && this.parentEmployee?.value) {
      this.fetchEmp
        .updateChildParent(
          this.childEmployee?.value,
          this.parentEmployee?.value
        )
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.changeParentForm.reset();
          },
          error: (err: any) => {
            alert(err.message);
          },
        });
    }
  }
}
