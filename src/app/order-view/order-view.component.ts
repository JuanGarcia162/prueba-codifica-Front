import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CustomerService, Order } from '../services/customer.service';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  displayedColumns: string[] = ['orderID', 'requiredDate', 'shippedDate', 'shipName', 'shipAddress', 'shipCity'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  customerName: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<OrderViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customerId: number },
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.loadCustomerDetails();
    this.loadOrders();
  }

  loadCustomerDetails() {
    this.customerService.getSalesDatePrediction().subscribe(customers => {
      const customer = customers.find(c => c.custid === Number(this.data.customerId));
      if (customer) {
        this.customerName = customer.companyName;
      } else {
        console.log('Customer not found'); // Mensaje cuando no se encuentra el cliente
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders() {
    this.customerService.getOrdersByCustomer(this.data.customerId).subscribe(orders => {
      this.dataSource.data = orders;
    });
  }
}
