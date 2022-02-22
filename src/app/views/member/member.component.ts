import { DialogComponent } from './../layout/dialog/dialog.component';
import { MemberDto } from './../../models/member-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CodeService } from 'src/app/services/code.service';
import { MemberService } from 'src/app/services/member.service';
import { CodeDto } from 'src/app/models/code-dto';
import { MemberFormComponent } from './member-form/member-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit {
  displayedColumns = [
    'fullName',
    'email',
    'gender',
    'contactNo',
    'borrowed',
    'effDate',
    'expDate',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<MemberDto>;
  title = '';
  count = 0;
  statusCode: CodeDto[] = [];

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  constructor(
    private memberService: MemberService,
    private codeService: CodeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.memberService.get().subscribe((item) => {
      this.dataSource = new MatTableDataSource(item);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.count = item.length;
    });

    this.codeService.getByCode('member', 'status').subscribe((item) => {
      this.statusCode = item;
    });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(memberDto: MemberDto = new MemberDto()) {
    const dialogRef = this.dialog.open(MemberFormComponent, {
      width: '450px',
      data: memberDto,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit(result);
      }
    });
  }

  onSubmit(member: MemberDto) {
    this.memberService.set(member).then(result =>
      this.snackBar.open('Update successful', 'Close')
    );;
  }

  onStatusToggle(memberDto: MemberDto) {
    const newStatus = memberDto.status === '1' || memberDto.status === '0' ? '9' : '0';
    const newStatusName = this.statusCode.find(x => x.value2 === newStatus)?.value1.toLowerCase();

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: `Do you want to ${newStatusName} this member?`,
        btnType: 'form',
        theme: 'dialog-red'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        memberDto.status = newStatus;
        this.memberService.set(memberDto).then(result =>
          this.snackBar.open('Update successful', 'Close')
        );
      }
    });
  }

  onDelete(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      panelClass: 'confirm-dialog-container',
      data: {
        title: 'Confirmation',
        content: 'Do you want to remove this members, it is recommend to deactive the member?',
        btnType: 'form',
        theme: 'dialog-red',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.memberService.delete(id).then(result =>
          this.snackBar.open('Delete successful', 'Close')
        );
      }
    });
  }

  getStatusChipColor(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value3;
  }

  getStatusText(value: string) {
    return this.statusCode.find(x => x.value2 === value)?.value1;
  }

  insertSampleMembers() {
    this.memberService.insertSampleMembers();
  }
}
