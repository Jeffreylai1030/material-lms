import { BorrowDto } from 'src/app/models/borrow-dto';
import { BorrowService } from 'src/app/services/borrow.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BookService } from 'src/app/services/book.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource!: MatTableDataSource<any>;

  today = new Date();
  chartTitle = 'New Borrowed Last 7 Days';
  totalBooksNumber = 0;
  totalBorrowsNumber = 0;
  totalTodayBorrowsNumber = 0;
  totalBorrowsExpiredNumber = 0;
  borrows: BorrowDto[] = [];
  chartOption: EChartsOption = {};
  displayedColumns = ['date', 'number'];
  selectedTab = 'lastWeek';
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  ngOnInit() {
    this.bookService.get().subscribe(item => {
      this.totalBooksNumber = item.length;
    })

    this.borrowService.getByStatus('0').subscribe(item => {

      this.borrows = item;
      this.totalBorrowsNumber = item.length;
      this.totalTodayBorrowsNumber = item.filter(x => x.addDate.toDate().toISOString().substring(0, 10) === new Date().toISOString().substring(0, 10)).length;
      this.totalBorrowsExpiredNumber = item.filter(x => x.dueDate.toDate().toISOString().substring(0, 10) <= new Date().toISOString().substring(0, 10)).length;

      this.onTabChange('lastWeek');
    })

  }

  onTabChange(value: string) {
    const endDate = new Date(new Date().setDate(new Date().getDate() + 1));

    if (value === 'lastWeek') {
      this.chartTitle = 'New Borrowed Last 7 Days';
      const startDate = new Date(new Date().setDate(new Date().getDate() - 6));
      this.generateLineChart(startDate, endDate);
    } else if (value === 'lastMonth') {
      this.chartTitle = 'New Borrowed Last 30 Days';
      const startDate = new Date(new Date().setDate(new Date().getDate() - 29));
      this.generateLineChart(startDate, endDate);
    }
  }

  onChartChange() {
    const start: Date = this.dateRange.value.start;
    const end: Date = this.dateRange.value.end;
    const startDate: Date = new Date(start.setDate(start.getDate() + 1));
    const endDate: Date = new Date(end.setDate(end.getDate() + 2));
    this.selectedTab = '';
    this.chartTitle = `New Borrowed ${this.datepipe.transform(startDate, 'mediumDate')} ~ ${this.datepipe.transform(endDate, 'mediumDate')}`;
    this.generateLineChart(startDate, endDate);
  }

  generateLineChart(startDate: Date, endDate: Date) {
    let data: any = [];
    let xAxis: string[] = [];
    let yAxis: number[] = [];

    let startDateStr = startDate.toISOString().substring(0, 10);
    let endDateStr = endDate.toISOString().substring(0, 10);

    console.log('start: ' + startDateStr, 'end: ' + endDateStr);

    while (startDateStr !== endDateStr) {
      const date = new Date(startDateStr);
      const pastDate = date.toISOString().substring(0, 10);
      const pastData = this.borrows.filter(x => x.addDate.toDate().toISOString().substring(0, 10) === pastDate).length;
      xAxis.push(pastDate);
      yAxis.push(pastData);
      data.push({ date: pastDate, number: pastData });
      startDateStr = new Date(date.setDate(date.getDate() + 1)).toISOString().substring(0, 10);
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
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      xAxis: {
        type: 'category',
        data: xAxis, // Past 7 days Date
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
          data: yAxis, // Number of books
          type: 'line',
        },
      ],
    };
  }

}
