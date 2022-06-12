import 'babel-polyfill';
import '../scss/style.scss';
import { formValidation, sorting } from './logic-functions';
import {
  start,
  renderingHeaderBlokButton,
  renderingAccountLogin,
  renderMainPageOfPersonalAccount,
} from './rendering';

const body = document.querySelector('body');
let arrayWorking = [];

function entranceToTheOffice() {
  const entryBtn = document.querySelector('.acc-form__btn');
  formValidation();
  entryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/accounts', {
      headers: {
        'Content-Type': 'text/plain',
        Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        arrayWorking = res.payload;
        return arrayWorking;
      })
      .then((res) => {
        renderingHeaderBlokButton();
        renderMainPageOfPersonalAccount(res);
      });
  });
}
function accounAdded() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'btn btn_primary main-header__btn') {
      fetch('http://localhost:3000/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((obj) => {
          arrayWorking.push(obj.payload);
          return arrayWorking;
        })
        .then((res) => {
          renderMainPageOfPersonalAccount(res);
        });
    }
  });
}

start();
renderingAccountLogin();
entranceToTheOffice();
sorting();
accounAdded();
