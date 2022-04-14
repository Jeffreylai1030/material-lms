import { EmployeeRegisterFormComponent } from './employee-register-form/employee-register-form.component';
import { EmployeeDto } from './../../models/employee-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CodeService } from 'src/app/services/code.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DialogComponent } from '../layout/dialog/dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CodeDto } from 'src/app/models/code-dto';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  displayedColumns = [
    '#',
    'downloadURL',
    'fullName',
    'username',
    'gender',
    'email',
    'contactNo',
    'role',
    'salary',
    'status',
    'action'
  ];
  transformation = [{
    height: '40',
    width: '40',
    focus: 'auto',
    radius: 'max'
  }];
  lqip = { active: true, quality: 1 };
  dataSource!: MatTableDataSource<EmployeeDto>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  selectedEmployee: EmployeeDto = new EmployeeDto();
  statusCode: CodeDto[] = [];

  constructor(
    private employeeService: EmployeeService,
    private loginService: AuthService,
    public codeService: CodeService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.employeeService.get().subscribe((item: EmployeeDto[]) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.codeService.getByCode('staff_role', 'status').subscribe((item) => {
      this.statusCode = item;
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(employeeDto: EmployeeDto = new EmployeeDto()) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '450px',
      data: employeeDto,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onUpload(emp: EmployeeDto) {
    this.selectedEmployee = emp;
    document.getElementById('uploader')?.click();
  }

  onUploadProfile(event: any) {
    const file = event.target.files[0];
    if (file.size < 5 * 1024 * 1024) {
      this.selectedEmployee.profileImage = file; // Need BLOB
      this.employeeService.uploadProfile(this.selectedEmployee);
    } else {
      this.dialog.open(DialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        data: {
          title: this.translate.instant('employee.profile'),
          html: this.translate.instant('errorMsg.imgExcess'),
          theme: 'dialog-red'
        }
      });
    }
  }

  onRegister(email: string, password = '') {
    const dialogRef = this.dialog.open(EmployeeRegisterFormComponent, {
      width: '450px',
      data: { email, password }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loginService.register(result.email, result.password)
          .then(result => {
            const message = this.translate.instant('snackbar.create_account_success');
            const closeBtn = this.translate.instant('snackbar.close');
            this.snackBar.open(message, closeBtn, { duration: 1500 })
          })
          .catch(error => {
            console.warn(error);
            // Display error message
            this.dialog.open(DialogComponent, {
              width: '350px',
              panelClass: 'confirm-dialog-container',
              data: {
                title: this.translate.instant('errorMsg.error'),
                content: this.translate.instant('errorMsg.genericErrorMsg'),
                theme: 'dialog-red'
              }
            });
          })
      }
    });
  }

  onShowAllData(emp: EmployeeDto) {
    const addDate = new Date(emp.addDate.seconds * 1000);
    const editDate = new Date(emp.editDate.seconds * 1000);
    const html = `<table style="width:100%">
                    <tr><td style="width: 6rem"><b>Name</b></td><td>${emp.fullName}</td></tr>
                    <tr><td><b>ID</b></td><td>${emp.id}</td></tr>
                    <tr><td><b>IC</b></td><td>${emp.idNumber}</td></tr>
                    <tr><td><b>Address</b></td><td>${emp.address}</td></tr>
                    <tr><td><b>AddDate</b></td><td>${this.datepipe.transform(addDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>AddWho</b></td><td>${emp.addWho}</td></tr>
                    <tr><td><b>EditDate</b></td><td>${this.datepipe.transform(editDate, 'yyyy-MM-dd HH:mm:ss')}</td></tr>
                    <tr><td><b>EditWho</b></td><td>${emp.editWho}</td></tr>
                  </table>`;

    const safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: { title: 'Detail', html: safeHtml, theme: 'dialog-blue' }
    });
  }

  onSubmit(emp: EmployeeDto) {
    this.employeeService.set(emp).then(result => {
      const message = this.translate.instant('snackbar.update_success');
      const closeBtn = this.translate.instant('snackbar.close');
      this.snackBar.open(message, closeBtn, { duration: 1500 })
    });
  }

  onStatusToggle(employeeDto: EmployeeDto) {
    let message = '';
    let newStatus = '';

    if (employeeDto.status === '9') {
      message = this.translate.instant('employee.toggleDeactivateMsg');
      newStatus = '0';
    } else {
      message = this.translate.instant('employee.toggleActivateMsg');
      newStatus = '9';
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: this.translate.instant('employee.confirmation'),
        content: message,
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        employeeDto.status = newStatus;
        this.employeeService.set(employeeDto);
      }
    });
  }

  onDelete(emp: EmployeeDto) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: this.translate.instant('employee.confirmation'),
        content: this.translate.instant('employee.deleteConfirmMsg'),
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.delete(emp);
      }
    });
  }

  getStatusChipColor(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value3;
  }

  getStatusText(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value1;
  }

}
