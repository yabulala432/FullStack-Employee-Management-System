import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Employee {
  _id: string;
  pid?: string;
  name: string;
  role: string;
  email: string;
  tel: string;
  imageUrl: string;
  children?: Employee[];
}

@Injectable({
  providedIn: 'root',
})
export class FetchEmployeeService {
  constructor(private _http: HttpClient) {}

  private url: string = 'http://localhost:3000/main-api/';

  getData() {
    return this._http.get(this.url + 'getAll');
  }

  addChild(name: string, body: any) {
    return this._http.post(this.url + 'addChildOn/' + name, body);
  }

  getIdFromName(name: string) {
    return this._http.get(this.url + 'findIdFromName/' + name);
  }

  deleteData(id: string) {
    this._http.delete(this.url + 'delete/' + id).subscribe({
      next: (response) => {
        if (response) {
          console.log('deleted');
        }
      },
      error: (err) => {
        if (err.status === 400) {
          alert('Error: this Employee has Children !!! Cannot be deleted');
        }
      },
    });
    return this._http.delete(this.url + 'delete/' + id);
  }

  getEmpNameFromRole(role: string) {
    const endpoint = this.url + 'findByRole/' + role;
    console.log(endpoint);
    return this._http.get(this.url + 'findByRole/' + role);
  }

  getEmployeeExcludingDescendants(id: string) {
    return this._http.get(this.url + 'findExcludingDescendants/' + id);
  }

  updateChildParent(childName: string, parentName: string) {
    // endPoint /updateParentOf/:childId/:parentId
    return this._http.put(
      this.url + 'updateParentOf/' + childName + '/' + parentName,
      ''
    );
  }

  updateEmployeeInformation(id: string, body: any) {
    console.log({ id });
    console.log({ body });
    return this._http.put(this.url + 'update/' + id, body);
  }

  transformData(data: Employee[]): Employee {
    const transformedData: Record<string, Employee> = {};

    for (const item of data) {
      const itemId = item._id;
      const itemPid = item.pid;
      const itemName = item.name;
      const itemRole = item.role;
      const itemEmail = item.email;
      const itemTel = item.tel;
      const itemImageUrl = item.imageUrl;

      const itemObject: Employee = {
        _id: itemId,
        name: itemName,
        role: itemRole,
        email: itemEmail,
        tel: itemTel,
        imageUrl: itemImageUrl,
        children: [],
      };

      if (itemPid) {
        const parentItem = transformedData[itemPid];
        if (parentItem) {
          parentItem.children!.push(itemObject);
        }
      }

      transformedData[itemId] = itemObject;
    }

    let rootItem: Employee | undefined;
    for (const item of Object.values(transformedData)) {
      if (!item.pid) {
        rootItem = item;
        break;
      }
    }

    return rootItem!;
  }
}
