import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface EmpRoleType {
  role: string;
  worksUnder: string;
}

@Injectable({
  providedIn: 'root',
})
export class FetchRoleService {
  constructor(private _http: HttpClient) {
  }

  private url: string = 'http://localhost:3000/employee-roles/';

  getAll(): Observable<unknown> {
    return this._http.get(this.url + 'getAllRoles');
  }

  addRole(body: EmpRoleType) {
    return this._http.post(this.url + 'add', body);
  }

  findRole(role: string) {
    return this._http.get(this.url + 'findByRole/' + role);
  }

  pushToRole(theRole: string, worksUnder: string) {
    //   endpoint /pushToRole/:role
    const body = {worksUnder};
    // console.log(body)
    return this._http.post(this.url + 'pushToRole/' + theRole, body);
  }

  deleteFromRole(theRole:string,worksUnder:string) {
    //   endPoint deleteFromRole/:role
    const body = {worksUnder};
    return this._http.post(this.url + 'deleteFromRole/' + theRole, body);
  }
}
