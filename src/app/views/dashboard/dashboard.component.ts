import { BorrowDto } from 'src/app/models/borrow-dto';
import { BorrowService } from 'src/app/services/borrow.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BookService } from 'src/app/services/book.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private bookService: BookService,
    private borrowService: BorrowService,
    private datepipe: DatePipe,
  ) {}

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  dataSource!: MatTableDataSource<any>;

  totalBooksNumber = 0;
  totalBorrowsNumber = 0;
  totalTodayBorrowsNumber = 0;
  totalBorrowsExpiredNumber = 0;
  borrows: BorrowDto[] = [];
  xAxis: string[] = [];
  yAxis: number[] = [];
  chartOption: EChartsOption = {};
  displayedColumns = ['date', 'number']

  ngOnInit() {
    this.bookService.get().subscribe(item => {
      this.totalBooksNumber = item.length;
    })

    this.borrowService.getByStatus('0').subscribe(item => {
      let data: any = [];
      this.borrows = item;
      this.totalBorrowsNumber = item.length;
      this.totalTodayBorrowsNumber = item.filter(x => x.addDate.toDate().toISOString().substring(0, 10) === new Date().toISOString().substring(0, 10)).length;
      this.totalBorrowsExpiredNumber = item.filter(x => x.dueDate.toDate().toISOString().substring(0, 10) <= new Date().toISOString().substring(0, 10)).length;

      let count = 6;
      while (count >= 0) {
        const date = new Date();
        const pastDate = new Date(date.setDate(date.getDate() - count)).toISOString().substring(0, 10);
        const pastData = item.filter(x => x.addDate.toDate().toISOString().substring(0, 10) === pastDate).length;
        this.xAxis.push(pastDate);
        this.yAxis.push(pastData);
        data.push({ date: pastDate, number: pastData });
        count--;
      }



      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.chartOption = {
        legend: {
          data: ['Books']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxis, // Past 7 days Date
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Books',
            data: this.yAxis, // Number of books
            type: 'line',
          },
        ],
      };

    })
  }


}
