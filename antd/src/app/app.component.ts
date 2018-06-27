import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  AbstractControl
} from '@angular/forms';

import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';

import { Observable, Observer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  validateForm: FormGroup;

  investment_options = [{
    value: 'Basic',
    label: 'Basic',
    children: [{
      value: 'Savings',
      label: 'Savings Account',
      children: [{
        value: 'Fixed Deposit',
        label: 'Fixed Deposit',
        isLeaf: true
      }]
    }, {
      value: 'Recurring Deposit',
      label: 'Recurring Deposit',
      isLeaf: true
    }]
  }, {
    value: 'Prime',
    label: 'Prime',
    children: [{
      value: 'Mutual Funds',
      label: 'Mutual Funds',
      children: [{
        value: 'SIP',
        label: 'SIP',
        isLeaf: true
      }, {
        value: 'Lumpsum',
        label: 'Lumpsum',
        isLeaf: true
      }]
    }, {
      value: 'Stocks',
      label: 'Stocks'
    }]
  }];

  listOfBanks = [{
    label: 'SBI',
    value: {
      name: 'SBI',
      acc_num: 111,
      balance: 1000
    }
  }, {
    label: 'Kotak',
    value: {
      name: 'Kotak',
      acc_num: 222,
      balance: 20000
    }
  }, {
    label: 'HSBC',
    value: {
      name: 'HSBC',
      acc_num: 333,
      balance: 30300
    }
  }, {
    label: 'Citigroup',
    value: {
      name: 'Citigroup',
      acc_num: 444,
      balance: 400
    }
  }, {
    label: 'Barclays',
    value: {
      name: 'Barclays',
      acc_num: 555,
      balance: 5000
    }
  }, {
    label: 'UBS',
    value: {
      name: 'UBS',
      acc_num: 6,
      balance: 600
    }
  }, {
    label: 'Standard Chartered',
    value: {
      name: 'Standard Chartered',
      acc_num: 7,
      balance: 7700
    }
  }];

  notifyOptions = [
    { label: 'Email', value: 'Email', checked: false },
    { label: 'Mobile', value: 'Mobile', checked: false }
  ];

  inv_details = [
    new NzTreeNode({
      title   : 'Investments',
      key     : '1001',
      children: [
        {
          title   : 'Debt',
          key     : '10001',
          children: [
            {
              title : 'Fixed Deposits',
              key   : '100011',
              isLeaf: true
            },
            {
              title : 'Liquid Funds',
              key   : '100012',
              isLeaf: true
            }
          ]
        },
        {
          title   : 'Equity',
          key     : '10002',
          children: [
            {
              title   : 'Mutual Funds',
              key     : '1000121',
              isLeaf  : true,
              disabled: true
            },
            {
              title : 'Stocks',
              key   : '1000122',
              isLeaf: true
            }
          ]
        }
      ]
    })
  ];

  expandKeys = [ '1001', '10001' ];
  checkedKeys = [ '100011', '1002' ];
  selectedKeys = [ '10001', '100011' ];
  expandDefault = false;


  expandCityKeys = [ '1001' ];
  value: string;
  city_nodes = [
    new NzTreeNode({
      title: 'Maharashtra',
      key: '1001',
      children: [
        {
          title: 'Mumbai',
          key: '10001',
          children: [{
              title: 'Andheri',
              key: '100001',
            },
            {
              title: 'Dadar',
              key: '100002',
            }
          ]
        },
        {
          title: 'Bengaluru',
          key: '10002',
        },
        {
          title: 'Jaipur',
          key: '10003',
        }
      ]
    }),
    new NzTreeNode({
      title: 'Karkow',
      key: '1002',
      children: [
        {
          title: 'Katowice',
          key: '10021',
          children: [],
          disableCheckbox: true
        },
        {
          title: 'Chorzow',
          key: '10022'
        }
      ]
    }),
    new NzTreeNode({
      title: 'Bristol',
      key: '1003',
      children: [{
        title: 'Attleboro',
        key: '10031'
      }, {
        title: 'Berkley',
        key: '10032'
      }]
    })
  ];


  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      if (control.value === 'John Doe') {
        observer.next({ error: true, duplicated: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 500);
  })

  constructor(private fb: FormBuilder, private message: NzMessageService) { }

  selectCountry(country) {
    this.validateForm.controls.country = country;
  }

  bankSelected(bank) {
    console.log(bank);
  }

  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    setTimeout((): void => {
      if (this.validateForm.valid) {
        for (const i in this.validateForm.controls) {
          if (this.validateForm.controls[i].value !== null) {
            console.log(i + ' -> ' + this.validateForm.controls[i].value);
          }
        }
        const id = this.message.loading('Registration in progress...', { nzDuration: 1000 }).messageId;
        setTimeout(_ => {
          this.message.remove(id);
          this.message.create('success', `Registration Successful`);
        }, 1000);
      }
    }, 1000);
  }


  updateSingleChecked(option): void {
    console.log(option);
    option.checked = !option.checked;
    if (option.checked) {
      this.validateForm.controls.notify.value.push(option.value);
    } else {
      const index = this.validateForm.controls.notify.value.indexOf(option.value);
      this.validateForm.controls.notify.value.splice(index, 1);
    }
  }

  onSelectInvestmentOptions(options): void {
    if (options.length > 0) {
      this.validateForm.controls.inv_options = options[options.length - 1].value;
      console.log(this.validateForm.controls.inv_options);
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      formLayout: [ 'vertical' ],
      name    : [ '', [ Validators.required ], [ this.userNameAsyncValidator ] ],
      address : [ '' ],
      email   : [ '', [ Validators.required, Validators.email ] ],
      mobile  : [ '', [Validators.required]],
      dob     : [ '' ],
      country : [ 'India' ],
      city   : [ this.city_nodes ],
      banks   : [null],
      accType : [ '' ],
      inv_options : [ '' ],
      inv_period : [ '' ],
      inv_details : [ this.inv_details ],
      notify  : [ [] ]
    });
  }
}
