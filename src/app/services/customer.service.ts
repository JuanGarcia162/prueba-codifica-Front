import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  custid: number;
  companyName: string;
  lastorderDate: string;
  nextPredictedOrder: string;
}

export interface Order {
  OrderID: number;
  requiredDate: string;
  shippedDate: string;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  freight: number;
  shipCountry: string;
}

export interface Employee {
  empID: number;
  fullName: string;
}

export interface Shipper {
  shipperID: number;
  companyName: string;
}

export interface Product {
  productID: number;
  productName: string;
}

export interface OrderCreateDto {
  empID: number;
  customerId: number;
  shipperID: number;
  shipName: string;
  shipAddress: string;
  shipCity: string;
  orderDate: string;
  requiredDate: string;
  shippedDate: string | null;
  freight: number;
  shipCountry: string;
  unitPrice: number;
  qty: number;
  discount: number;
  productID: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7133/api';

  constructor(private http: HttpClient) { }

  getSalesDatePrediction(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  getOrdersByCustomer(custid: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${custid}`);
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getShippers(): Observable<Shipper[]> {
    return this.http.get<Shipper[]>(`${this.apiUrl}/shippers`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createOrder(order: OrderCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }
}