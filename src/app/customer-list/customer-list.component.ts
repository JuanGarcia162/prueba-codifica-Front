import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CustomerService, Customer } from '../services/customer.service';
import { OrderViewComponent } from '../order-view/order-view.component';
import { NewOrderComponent } from '../new-order/new-order.component';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['companyName', 'lastorderDate', 'nextPredictedOrder', 'actions'];
  dataSource: MatTableDataSource<Customer> = new MatTableDataSource<Customer>([]);
  totalCustomers: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadCustomers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCustomers() {
    this.customerService.getSalesDatePrediction().subscribe(customers => {
      this.dataSource.data = customers;
      this.totalCustomers = customers.length;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewOrders(customer: Customer) {
    this.dialog.open(OrderViewComponent, {
      data: { customerId: customer.custid }
    });
  }

  newOrder(customer: Customer) {
    this.dialog.open(NewOrderComponent, {
      data: { customerId: customer.custid }
    });
  }
}