import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerService, Customer, Employee, Shipper, Product, OrderCreateDto } from '../services/customer.service';

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  customerName: string = '';
  orderForm: FormGroup;
  customers: Customer[] = [];
  employees: Employee[] = [];
  shippers: Shipper[] = [];
  products: Product[] = [];

  constructor(
    private dialogRef: MatDialogRef<NewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customerId: number },
    private customerService: CustomerService
  ) {
    this.orderForm = new FormGroup({
      empID: new FormControl('', Validators.required),
      customerId: new FormControl('', Validators.required),
      shipperID: new FormControl('', Validators.required),
      shipName: new FormControl('', Validators.required),
      shipAddress: new FormControl('', Validators.required),
      shipCity: new FormControl('', Validators.required),
      orderDate: new FormControl('', Validators.required),
      requiredDate: new FormControl('', Validators.required),
      shippedDate: new FormControl(''),
      freight: new FormControl('', Validators.required),
      shipCountry: new FormControl('', Validators.required),
      unitPrice: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      discount: new FormControl('', [Validators.required, this.discountValidator]),
      productID: new FormControl('', Validators.required),
    });
  }

  discountValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (isNaN(value) || value < 0 || value > 1) {
      return { invaliddiscount: true };
    }
    return null;
  }

  ngOnInit() {
    this.loadCustomerDetails();
    this.loadDropdowns();
  }

  loadCustomerDetails() {
    this.customerService.getSalesDatePrediction().subscribe(customers => {
      const customer = customers.find(c => c.custid === Number(this.data.customerId));
      if (customer) {
        this.customerName = customer.companyName;
        this.orderForm.get('customerId')?.setValue(customer.custid);
      } else {
        console.log('Customer not found');
      }
    });
  }

  loadDropdowns() {
    this.customerService.getSalesDatePrediction().subscribe(customers => {
      this.customers = customers;
    });
    this.customerService.getEmployees().subscribe(employees => {
      this.employees = employees;
    });
    this.customerService.getShippers().subscribe(shippers => {
      this.shippers = shippers;
    });
    this.customerService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  submitOrder() {
    console.log('Form validity:', this.orderForm.valid);
    console.log('Form values before submit:', this.orderForm.value);

    if (this.orderForm.valid) {
      const order: OrderCreateDto = this.orderForm.value;
      console.log('Order data to submit:', order);
      this.customerService.createOrder(order).subscribe(response => {
        console.log('Order created successfully', response);
        this.dialogRef.close();
      }, error => {
        console.error('Error creating order', error);
      });
    } else {
      console.log('Form is invalid:', this.orderForm.errors);
    }
  }
}


