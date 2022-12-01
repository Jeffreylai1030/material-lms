import { Observable, of, Subject } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeDto } from '../models/employee-dto';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  authState() {
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        // User is not signed in
        this.router.navigate(['login']);
      }
    })
  }

  login(email: string, password: string): Observable<any> {
    var errorMsg = new Subject<any>();

    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in
        this.employeeService
          .getByEmail(email.toLowerCase())
          .subscribe((x: EmployeeDto[]) => {
            localStorage.setItem('lms_emp', JSON.stringify({
                email,
                username: x[0].username,
                fullName: x[0].fullName,
                downloadURL: x[0].downloadURL,
                imageKitURL: x[0].imageKitURL
              })
            );
            this.router.navigate(['main']);
          });
      })
      .catch((e) => {
        errorMsg.next(e);
      });

    return errorMsg.asObservable();
  }

  logout() {
    localStorage.removeItem('lms_emp');
    signOut(this.auth);
    this.router.navigate(['login']);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email.toLowerCase(), password);
  }
}
