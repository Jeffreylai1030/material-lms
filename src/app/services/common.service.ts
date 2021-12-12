import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getCurrentUserName() {
    const user = localStorage.getItem('lms_emp');

    if (user) {
      return JSON.parse(user)?.username;
    }

    return null;
  }

  getCurrentUserEmail() {
    const user = localStorage.getItem('lms_emp');

    if (user) {
      return JSON.parse(user)?.email;
    }
  }
}
