/* eslint-disable prettier/prettier */
import 'babel-polyfill';
import '../scss/style.scss';
import {
  formValidation,
  sorting,
  validationOfAnewTransaction,
  currencyExchangeFormValidation,
} from './logic-functions';
import {
  start,
  renderingHeaderBlokButton,
  renderingAccountLogin,
  renderMainPageOfPersonalAccount,
  accountDetailsRendering,
  renderingEdgeTransactionTable,
  TransactionTableClear,
  currencyPageRendering,
  fillingTheListOfUserCurrencies,
  drawingChangesInExchangeRates,
  exchangeList,
  mapPageRendering,
} from './rendering';
import mapWidjet from 'yandex-map-widget';

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
      renderMainPageOfPersonalAccount(arrayWorking);
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
  formValidation();
  body.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.className === 'acc-form__btn btn btn_primary form__btn') {
      officeEntryRequest();
      renderingHeaderBlokButton();
    } else if (event.target.className === 'blok-btn__btn btn btn_white btn-accounts') {
      officeEntryRequest();
    }
  });
}
//   сортировка счетов
function accountsSort() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'main-header__select dropdawn dropdawn_primary') {
      let items = document.querySelectorAll('.dropdawn__item');
      items.forEach(el => {
        el.addEventListener('click', () => {
          if (el.textContent === 'По номеру') {
            arrayWorking.sort((a, b) => a.account > b.account ? 1 : -1);
            renderMainPageOfPersonalAccount(arrayWorking);
          }
          if (el.textContent === 'По балансу') {
            arrayWorking.sort((a, b) => a.balance > b.balance ? 1 : -1);
            console.log(arrayWorking);
            renderMainPageOfPersonalAccount(arrayWorking);
          }
          if (el.textContent === 'По последней транзакции') {
            let arr = arrayWorking.filter(el => el.transactions[0]);
            arr.sort((a, b) => a.transactions[0].date > b.transactions[0].date ? 1 : -1);
            renderMainPageOfPersonalAccount(arr);
          }
        });
      });
    }
  });
}
//   выход из кабинета
function output() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'blok-btn__btn btn btn_white output') {
      location.reload();
    }
  });
}
//   вход на страницу с банкоматами
function cashMachine() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'blok-btn__btn btn btn_white cash-machine') {
      fetch(`http://localhost:3000/banks`, {
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
          mapPageRendering();
          mapWidjet.loadApi()
            .then(() => {
              mapWidjet.createMap('map',
                res);
            });
        });
    }
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
//   вход на валютную страницу
function entranceToTheCurrencyPage() {
  body.addEventListener('click', (event) => {
    if (event.target.className === 'blok-btn__btn btn btn_white btn-cyrrency') {
      fetch(`http://localhost:3000/currencies`, {
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
          currencyPageRendering();
          fillingTheListOfUserCurrencies(res);
          drawingChangesInExchangeRates();
        }).then(() => {
          fetch(`http://localhost:3000/all-currencies`, {
            headers: {
              'Content-Type': 'text/plain',
              Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
            },
          }).then((res) => {
            return res.json();
          })
            .then((obj) => {
              return obj.payload;
            }).then((res) => {
              exchangeList(res);
              currencyExchangeFormValidation();
            });
        });
    }
  });
}
//   запрос на обмен валют (на все запросы ответ с ошибкой `Unknown currency code`)
function currencyExchangeRequest() {
  body.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.className === 'button btn btn_primary exchange__btn') {
      const dropdawnText = document.querySelectorAll('.dropdawn__text');
      const from = dropdawnText[0].textContent;
      const to = dropdawnText[1].textContent;
      const amount = document.querySelector('.exchange__inp').value;
      let obj = {
        from: from,
        to: to,
        amount: amount
      };
      fetch(`http://localhost:3000/currency-buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          Authorization: 'Basic ZGV2ZWxvcGVyOnNraWxsYm94',
        },
        body: JSON.stringify(obj),
      }).then((res) => {
        return res.json();
      })
        .then((obj) => {
          return obj.payload;
        });;
    }
  });
}
//   запрос на изменение курсов валют (закрывается сразу после открытия, ответа нет)
// function websoc() {
//   const ws = new WebSocket("ws://localhost:3000/WebSocket/currency-feed");
//   ws.onopen = () => {
//     console.log('open');
//   };
//   ws.onmessage = (event) => {
//     console.log(event.data);
//   };
//   ws.onclose = () => {
//     console.log('close');
//   };
//   ws.onerror = () => {
//     console.log('error');
//   };
// }
// websoc();


start();
output();
cashMachine();
renderingAccountLogin();
entranceToTheOffice();
sorting();
accounAdded();
newTransaction();
accountDetails();
enterTheDetailedViewOfTheBalanceHistory();
comeBack();
entranceToTheCurrencyPage();
currencyExchangeRequest();
accountsSort();
