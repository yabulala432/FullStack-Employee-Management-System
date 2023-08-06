import { EmployeeModel } from './../../models/employee.model';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FetchEmployeeService } from 'src/app/services/fetch-employee.service';

interface Employee {
  _id: string;
  name: string;
  role: string;
  email: string;
  tel: string;
  imageUrl: string;
}

@Component({
  selector: 'app-info-employee',
  templateUrl: './info-employee.component.html',
  styleUrls: ['./info-employee.component.css'],
})
export class InfoEmployeeComponent implements OnInit {
  modalContent: TemplateRef<any> | undefined;
  modalRef!: NzModalRef;
  submitting = false;
  data: Employee[] = [];
  isVisible: boolean = false;
  updateName: string = '';

  nameToUpdate: string = '';
  emailToUpdate: string = '';
  roleToUpdate: string = '';
  imageUrlToUpdate: string = '';
  telToUpdate: string = '';
  idToUpdate: string = '';

  constructor(
    private fetchService: FetchEmployeeService,
    private modalService: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchService.getData().subscribe({
      next: (response) => {
        this.data = response as Employee[];
        // console.log(this.data);
      },
    });
    // this.fetchService.
  }

  onDelete(id: string, name: string, role: string, email: string, tel: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure delete this employee?',
      nzContent: `<b style="color: red;">
              Name: ${name}<br>
              Role: ${role}<br>
              Email: ${email}<br>
              Tel: ${tel}<br>
      </b>`,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => {
        this.fetchService.deleteData(id).subscribe({
          next: (response) => {
            if (response) {
              this.fetchService.deleteData(id).subscribe({
                next: (response) => {
                  if (response) {
                    this.data.filter(
                      (item) => item.name !== (response as Employee).name
                    );
                  }
                },
              });
            }
          },
          error: (err) => {},
        });
      },
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  form = this.fb.group({
    name: ['', [Validators.required]],
    role: ['', [Validators.required]],
    email: ['', [Validators.required]],
    tel: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
  });

  showModal(
    name: string,
    email: string,
    role: string,
    imageUrl: string,
    tel: string,
    id: string
  ) {
    this.isVisible = true;
    this.updateName = name;
    this.nameToUpdate = name;
    this.emailToUpdate = email;
    this.roleToUpdate = role;
    this.imageUrlToUpdate = imageUrl;
    this.telToUpdate = tel;
    this.idToUpdate = id;
  }

  closeModal(): void {
    this.modalRef.close();
  }

  submitForm(id: string): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const partialEmployee: Partial<EmployeeModel> = {
      name: this.nameToUpdate,
      role: this.roleToUpdate,
      email: this.emailToUpdate,
      tel: this.telToUpdate,
      imageUrl: this.imageUrlToUpdate,
    };
    this.fetchService.updateEmployeeInformation(id, partialEmployee).subscribe({
      next: (response) => {
        if (response) {
          this.data = this.data.filter((item) => {
            if (item._id === id) {
              item.name = this.nameToUpdate;
              item.role = this.roleToUpdate;
              item.email = this.emailToUpdate;
              item.tel = this.telToUpdate;
              item.imageUrl = this.imageUrlToUpdate;
            }
            return item;
          });
          this.isVisible = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
    setTimeout(() => {
      this.submitting = false;
      this.closeModal();
    }, 2000);
  }
}
