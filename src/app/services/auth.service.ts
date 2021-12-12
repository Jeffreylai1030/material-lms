import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeDto } from '../models/employee-dto';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageUser = localStorage.getItem('lms_emp') ?? '';

  constructor(private firestore: Firestore,
    private auth: Auth,
    private router: Router,
    private employeeService: EmployeeService) { }

  authState() {
    if (this.localStorageUser !== '') {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          // User is signed in
          const user = JSON.parse(this.localStorageUser);

          this.employeeService.getByEmail(user.email.toLowerCase()).subscribe((x: EmployeeDto[]) => {
            localStorage.setItem('lms_emp', JSON.stringify({ email: user.email, username: x[0].username }))
          });
        }
      });
    } else {
      // this.logout();
    }
  }

  login(email: string, password: string) {
    try {
      signInWithEmailAndPassword(this.auth, email, password).then(userCredential => {
        // Signed in
        this.employeeService.getByEmail(email.toLowerCase()).subscribe((x: EmployeeDto[]) => {
          localStorage.setItem('lms_emp', JSON.stringify({ email, username: x[0].username }))
          this.router.navigate(['main']);
        });
      }).catch((e) => {
        alert(e.message);
      });
    } catch (e: any) {
      alert(e.message);
    }
  }

  logout() {
    localStorage.removeItem('lms_emp');
    signOut(this.auth);
    this.router.navigate(['login']);
  }

  register(email: string, password: string) {
    try {
      createUserWithEmailAndPassword(this.auth, email.toLowerCase(), password);
      return 'Register Successful';
    } catch (e: any) {
      alert(e.message);
      return e.message;
    }
  }
}
