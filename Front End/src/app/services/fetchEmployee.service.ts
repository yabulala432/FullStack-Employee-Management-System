import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {response} from 'express';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  constructor(private _http: HttpClient) {
  }

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
    // console.log(this.url + "delete/" + id);
    this._http.delete(this.url + "delete/" + id).subscribe(
      {
        next: (response) => {
          if (response) {
            console.log("deleted");
          }
        },
        error: (err) => {
          console.error(err);
        }
      }
    )
    return this._http.delete(this.url + "delete/" + id);
  }

  getEmpNameFromRole(role: string) {
    return this._http.get(this.url + "findByRole/" + role);
  }

}
