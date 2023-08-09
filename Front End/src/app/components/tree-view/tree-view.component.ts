import { OnInit, Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { EmployeeModel } from 'src/app/models/employee.model';
import { EmployeeRole } from 'src/app/models/employeeRole';
import { FetchEmployeeService } from 'src/app/services/fetch-employee.service';
import { FetchRoleService } from 'src/app/services/fetch-role.service';

interface Employee {
  _id: string;
  name: string;
  role: string;
  imageUrl: string;
  tel: string;
  email: string;
  pid?: string;
  children?: Employee[];
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent implements OnInit {
  selectedData!: {
    email: string;
    role: string;
    name: string;
    tel: string;
  };

  findEmployee(data: Employee[], role: string, name: string): Employee[] {
    let result: Employee[] = [];

    for (const employee of data) {
      if (employee.role === role && employee.name === name) {
        result.push(employee);
      }

      if (employee.children && employee.children.length > 0) {
        const childrenResult = this.findEmployee(employee.children, role, name);
        result = result.concat(childrenResult);
      }
    }

    return result;
  }

  showOtherInfo(role: string, name: string) {
    const value = this.findEmployee(this.data, role, name);
    let dat: {
      email: string;
      role: string;
      name: string;
      tel: string;
    } = { email: '', role: '', name: '', tel: '' };
    dat.name = value[0].name;
    dat.role = value[0].role;
    dat.tel = value[0]?.tel ? value[0]?.tel : 'No tel';
    dat.email = value[0]?.email ? value[0]?.email : 'No email';

    this.selectedData = dat;

    this.fetchEmp.getIdFromName(this.selectedData.name).subscribe({
      next: (response) => {
        this.fetchEmp
          .getEmployeeExcludingDescendants(response as string)
          .subscribe({
            next: (response) => {
              this.parents = [];
              (response as EmployeeModel[]).map((value) => {
                if (this.selectedData.name != value.name)
                  this.parents.push(value.name);
              });
            },
          });
      },
    });
  }

  data: Employee[] = [];
  employees: string[] = [];
  parents: string[] = [];
  rolesArray: string[] = [];
  worksUnderArray: string[] = [];
  removeParentRoleArray: string[] = [];
  roleHierarchy: string = '';

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
        this.data = [this.fetchEmp.transformData(response as EmployeeModel[])];
        console.log(this.data);
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
    this.childEmployee?.setValue(this.selectedData.name);
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
