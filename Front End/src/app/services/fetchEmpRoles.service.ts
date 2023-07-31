import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface empRoleType {
  role: string;
  worksUnder: string;
}

@Injectable({
  providedIn: 'root',
})
export class FetchEmpRoleService {
  constructor(private _http: HttpClient) {
  }

  private url: string = 'http://localhost:3000/employee-roles/';

  getData(): Observable<unknown> {
    return this._http.get(this.url + 'getAllRoles');
  }

  addRole(body: empRoleType) {
    return this._http.post(this.url + 'add', body);
  }

  findRole(role: string) {
    return this._http.get(this.url + 'findRole/' + role);
  }
}
