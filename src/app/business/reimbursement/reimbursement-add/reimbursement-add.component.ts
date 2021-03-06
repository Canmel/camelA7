import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Https} from '../../../public/https.service';
import {Urls} from '../../../public/url';

@Component({
  selector: 'app-reimbursement-add',
  templateUrl: './reimbursement-add.component.html',
  styleUrls: ['./reimbursement-add.component.css']
})
export class ReimbursementAddComponent implements OnInit {

  validateForm: FormGroup;

  formData: Object;

  _submitForm() {
    let isValid = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls[i]) {
        if (this.validateForm.status === 'INVALID') {
          this.validateForm.controls[i].markAsDirty();
          isValid = false;
        }
      }
    }
    if (!isValid) {
      this.createNotification('error', '表单验证错误', '表单信息错误，请检查表单');
      return isValid;
    } else {
      this.doSubmit();
    }
  }

  constructor(private http: Https,
              private fb: FormBuilder,
              private _notification: NzNotificationService,
              public route: Router) {
    this.formData = {};
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
        description: [null, [Validators.required, Validators.maxLength(20)]],
        amount: [null, [Validators.required, Validators.max(99999999)]]
      }
    );
  }

  createNotification(type, title, content) {
    this._notification.create(type,
      title,
      content
    );
  }

  backToList() {
    this.route.navigate([Urls.BUSINESS.REIMBURSEMENT.LIST]);
  }

  doSubmit() {
    this.http.post(Urls.REIMBURSEMENT.SAVE,
      this.formData)
      .then(
        (val) => {
          this._notification.success('成功', val['msg']);
          this.route.navigate([Urls.BUSINESS.REIMBURSEMENT.LIST]);
        },
        response => {
          this._notification.error('失败', response['msg']);
        });
  }
}
