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
    private snackBar: MatSnackBar
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

  onUploaderChange(event: any) {
    try {
      if (event.target.files[0].size < 5 * 1024 * 1024) {
        this.selectedEmployee.profileImage = event.target.files[0]; // Need BLOB
        this.employeeService.uploadProfilePicture(this.selectedEmployee);
      } else {
        this.dialog.open(DialogComponent, {
          width: '350px',
          panelClass: 'confirm-dialog-container',
          data: {
            title: 'Registration',
            html: 'Image cannot larger than 5 MB',
            theme: 'dialog-red'
          }
        });
      }
    } catch (error) {
      console.warn("File upload failed.");
    }
  }

  onRegister(email: string, password = '') {
    const dialogRef = this.dialog.open(EmployeeRegisterFormComponent, {
      width: '450px',
      data: { email, password },
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loginService.register(result.email, result.password)
          .then(result => {
            // Open snack bar
            this.translate.get(['snackbar.create_account_success', 'snackbar.close']).subscribe((message: any) => {
              this.snackBar.open(message['snackbar.create_account_success'], message['snackbar.close'], {
                duration: 1500
              })
            });
          })
          .catch(error => {
            console.warn(error);
            // Display error message
            this.translate.get(['errorMsg.genericErrorMsg', 'errorMsg.error']).subscribe((message: any) => {
              this.dialog.open(DialogComponent, {
                width: '350px',
                panelClass: 'confirm-dialog-container',
                data: {
                  title: message['errorMsg.error'],
                  content:  message['errorMsg.genericErrorMsg'],
                  theme: 'dialog-red'
                }
              });
            })
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
    this.employeeService.set(emp).then(result =>
      this.translate.get(['snackbar.update_success', 'snackbar.close']).subscribe((message: any) => {
        this.snackBar.open(message['snackbar.update_success'], message['snackbar.close'], {
          duration: 1500
        })
      })
    );
  }

  onStatusToggle(id: string, status: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: `Do you want to ${status === '1' ? 'deactivate' : 'activate'} this employee?`,
        btnType: 'form',
        theme: 'dialog-red'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.employeeService.toggleStatus(id, status);
      }
    });
  }

  onDelete(emp: EmployeeDto) {
    this.translate.get(['employee.confirmation', 'employee.confirmMsg']).subscribe((message: any) => {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        panelClass: 'confirm-dialog-container',
        data: {
          title: message['employee.confirmation'],
          content: message['employee.confirmMsg'],
          btnType: 'form',
          theme: 'dialog-red'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.employeeService.delete(emp);
        }
      });
    })
  }

  getStatusChipColor(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value3;
  }

  getStatusText(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value1;
  }

}
