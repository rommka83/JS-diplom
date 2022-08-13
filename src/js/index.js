/* eslint-disable prettier/prettier */
import 'babel-polyfill';
import '../scss/style.scss';
import {
  formValidation,
  sorting,
  validationOfAnewTransaction,
} from './logic-functions';
import {
  start,
  renderingHeaderBlokButton,
  renderingAccountLogin,
  renderMainPageOfPersonalAccount,
  accountDetailsRendering,
  renderingEdgeTransactionTable,
  TransactionTableClear
} from './rendering';

const body = document.querySelector('body');
let arrayWorking = [];
//   запрос на вход в кабинет
function officeEntryRequest() {
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
      renderMainPageOfPersonalAccount(res);
    });
}
//   запрос на детализацию счёта
function detailRequest(id, balance) {
  fetch(`http://localhost:3000/account/${id}`, {
    headers: {
      'Content-Type': 'text/plain',
      Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      return obj.payload;
    })
    .then((res) => {
      sessionStorage.setItem('id', JSON.stringify(res.account));
      let arr = res.transactions;
      accountDetailsRendering(res, arr, id, balance);
      renderingEdgeTransactionTable(arr, id);
      validationOfAnewTransaction();
    });
}
//   вход в кабинет
function entranceToTheOffice() {
  const entryBtn = document.querySelector('.acc-form__btn');
  formValidation();
  entryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    officeEntryRequest();
    renderingHeaderBlokButton();
  });
}
//   добавление счёта
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
//   детализация счёта
function accountDetails() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'account__btn btn btn_primary') {
      const id = event.target.parentNode.firstChild.textContent;
      const balance =
        event.target.parentNode.firstChild.nextElementSibling.textContent;
      detailRequest(id, balance);
    }
  });
}
//   запрос на транзакцию
function transferRequeset(id, recipient, amount, balance) {
  fetch(`http://localhost:3000/transfer-funds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
    },
    body: JSON.stringify({
      from: id,
      to: recipient,
      amount: amount,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      return obj.payload;
    })
    .then((res) => {
      let arr = res.transactions;
      accountDetailsRendering(res, arr, id, balance);
      validationOfAnewTransaction();
    });
}
//   транзакция
function newTransaction() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'detailing-form__btn btn btn_primary form__btn') {
      event.preventDefault();
      const id = document.querySelector('.main-header__number').textContent;
      let balance = document.querySelector('.balance').textContent;
      let recipient = document.getElementById('recipient-number').value;
      let amount = document.getElementById('transfer-amount').value;
      transferRequeset(id, recipient, amount, balance);
    }
  });
}
//   возвращение на предыдущую страницу
function comeBack() {
  body.addEventListener('click', (event) => {
    const subtitle = document.querySelector('.main-header__title');

    if (
      event.target.className ===
      'btn btn_primary main-header__btn main-header__btn_detaling' &&
      subtitle.textContent === 'Просмотр счёта'
    ) {
      officeEntryRequest();
    } else if (event.target.className ===
      'btn btn_primary main-header__btn main-header__btn_detaling' &&
      subtitle.textContent === 'История баланса') {
      let id = document.querySelector('.main-header__number').textContent;
      let balance = document.querySelector('.balance').textContent;
      detailRequest(id, balance);
    }
  });
}
//   просмотр историии баланса
function enterTheDetailedViewOfTheBalanceHistory() {
  body.addEventListener('click', (event) => {

    if (event.target.className === 'balance-chart' || event.target.className === 'translation-history__table history-table') {
      const headerTitle = document.querySelector('.main-header__title');
      const newTranslation = document.querySelector('.new-translation');
      const halfAyear = document.querySelector('.half-a-year');
      const year = document.querySelector('.year');
      const balanceDynamics = document.querySelector('.balance-dynamics');
      const translationHistory = document.querySelector('.translation-history');
      const balanceRatio = document.querySelector('.balance-ratio');

      headerTitle.textContent = 'История баланса';
      newTranslation.classList.add('new-translation_off');
      halfAyear.classList.add('chart-off');
      year.classList.remove('chart-off');
      balanceDynamics.style.gridColumn = '1 / span 2';
      translationHistory.style.gridRow = '3';
      balanceRatio.style.display = 'block';

      let id = JSON.parse(sessionStorage.getItem('id'));
      fetch(`http://localhost:3000/account/${id}`, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((obj) => {
          return obj.payload;
        })
        .then((res) => {
          let arr = res.transactions;
          TransactionTableClear();
          renderingEdgeTransactionTable(arr, id);
        });

    }
  });
}

start();
renderingAccountLogin();
entranceToTheOffice();
sorting();
accounAdded();
newTransaction();
accountDetails();
enterTheDetailedViewOfTheBalanceHistory();
comeBack();

