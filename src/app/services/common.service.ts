import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  lms_emp = 'lms_emp'

  constructor() { }

  getCurrentUser() {
    const user = localStorage.getItem(this.lms_emp);

    return user ? JSON.parse(user) : {};
  }

  getCurrentUserName() {
    const user = localStorage.getItem(this.lms_emp);

    return user ? JSON.parse(user)?.username : {};
  }

  getCurrentUserEmail() {
    const user = localStorage.getItem(this.lms_emp);

    return user ? JSON.parse(user)?.email : {};
  }
}
