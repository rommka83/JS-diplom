/* eslint-disable prettier/prettier */
import { el, mount, setChildren } from 'redom';
import {
  transactionDateFormatting,
  constructionBalanceChart,
  constructionBalanceChartYear,
  constructionChartTransactionRatio,
  transactionColor,
  sliceIntoChunks
} from './logic-functions';

const header = el('header.header.container', el('a.headr__logo.logo', 'Coin.'));
const main = el('main.container');
//   точка входа
function start() {
  mount(document.body, header);
  mount(document.body, main);
}
//   отрисовка окна входа в аккаунт
function renderingAccountLogin() {
  const accountLogin = el('.account-login', [
    el('h2.subtitle.account-login__subtitle', 'Вход в аккаунт'),
    el('form.account-login__form.acc-form.form', [
      el(
        'label.acc-form__label.form__label',
        'Логин',
        el('input#login.acc-form__inp.form__inp', {
          type: 'text',
          autofocus: true,
          placeholder: 'Введите логин',
        }),
      ),
      el(
        'label.acc-form__label.form__label',
        'Пароль',
        el('input#password.acc-form__inp.form__inp', {
          type: 'text',
          autofocus: true,
          placeholder: 'Введите пароль',
        }),
      ),
      el('p.acc-form__error.form__error', 'Ошибка'),
      el(
        'button.acc-form__btn.btn.btn_primary.form__btn',
        { disabled: 'disabled' },
        'Войти',
      ),
    ]),
  ]);
  mount(main, accountLogin);
}
//   отрисовка блока кнопок шапки
function renderingHeaderBlokButton() {
  const blokBtn = el('.header__blok-btn.blok-btn', [
    el('button.blok-btn__btn.btn.btn_white.cash-machine', 'Банкоматы'),
    el('button.blok-btn__btn.btn.btn_white.btn-accounts', 'Счета'),
    el('button.blok-btn__btn.btn.btn_white.btn-cyrrency', 'Валюта'),
    el('button.blok-btn__btn.btn.btn_white.output', 'Выйти'),
  ]);
  mount(header, blokBtn);
}
//   отрисовка основной страницы личного кабинета
function renderMainPageOfPersonalAccount(arr) {
  const mainBody = document.querySelector('main');
  const mainHeder = el('.main-header', [
    el('h2.subtitle.main-header__title', 'Ваши счета'),
    el('.main-header__select.dropdawn.dropdawn_primary', { 'data-as': 'sort' }, [
      el('p.dropdawn__text', { 'data-drt': 'sort' }, 'Сортировка'),
      el('ul.dropdawn__list', { 'data-drl': 'sort' }, [
        el('li.dropdawn__item', 'По номеру'),
        el('li.dropdawn__item', 'По балансу'),
        el('li.dropdawn__item', 'По последней транзакции'),
      ]),
    ]),
    el('button.btn.btn_primary.main-header__btn', 'Создать новый счёт'),
  ]);
  const accounts = el('ul.accounts');
  arr.forEach((e) => {
    let transation;
    if (e.transactions.length >= 1) {
      let i = e.transactions.length - 1;
      transation = e.transactions[i].date;
    } else {
      transation = 'нет';
    }
    const account = el('li.accounts-item.account', [
      el('h3.account__title', `${e.account}`),
      el('p.account__balance', `${e.balance} `),
      el('h4.account__transaction', 'Последняя транзакция'),
      el(
        'p.account__transaction-content',
        `${transactionDateFormatting(transation)}`,
      ),
      el('button.account__btn.btn.btn_primary', 'Открыть'),
    ]);
    mount(accounts, account);
  });
  if (mainBody.firstChild) {
    while (mainBody.firstChild) {
      mainBody.removeChild(mainBody.firstChild);
    }
  }
  setChildren(main, [mainHeder, accounts]);
}
//   отрисовка таблицы с историей транзакций
function renderingEdgeTransactionTable(arr, id) {
  const historyTable = document.querySelector('.history-table');
  function renderRow(i, j) {
    const row = el('tr.history-table__row', [
      el('td.history-table__td', `${arr[i][j].from}`),
      el('td.history-table__td', `${arr[i][j].to}`),
      el('td.history-table__td.amount', `${arr[i][j].amount} `),
      el(
        'td.history-table__td',
        `${new Date(arr[i][j].date).getDate()}.${new Date(arr[i][j].date).getMonth() + 1
        }.${new Date(arr[i][j].date).getFullYear()}`,
      ),
    ]);
    mount(historyTable, row);
  }

  let headerTitle = document.querySelector('.main-header__title').textContent;
  if (arr.length) {
    arr = sliceIntoChunks(arr, 25);
    let i, j;

    if (headerTitle === 'Просмотр счёта' && arr[0].length > 10) {
      for (i = 0, j = 0; j < 10; j++) {
        renderRow(i, j);
      }
    }
    else if (headerTitle === 'Просмотр счёта' && arr[0].length < 10) {
      for (i = 0, j = 0; j < arr[0].length - 1; j++) {
        renderRow(i, j);
      }
    }
    if (headerTitle === 'История баланса') {
      if (arr.length > 1) {
        const transactionBlockBtn = document.querySelector('.transaction-block-btn');
        const btnBack = document.querySelector('.btn-back');
        const btnForward = document.querySelector('.btn-forward');
        transactionBlockBtn.classList.add('transaction-block-btn-active');
        btnBack.setAttribute('disabled', 'disabled');
        i = 0;
        sessionStorage.setItem('transationPage', JSON.stringify(i));
        btnForward.addEventListener('click', () => {
          btnBack.removeAttribute('disabled', 'disabled');
          i = JSON.parse(sessionStorage.getItem('transationPage')) + 1;
          if (i === arr.length - 1) {
            btnForward.setAttribute('disabled', 'disabled');
            TransactionTableClear();
            for (i, j = 0; j < arr[i].length - 1; j++) {
              renderRow(i, j);
              transactionColor(id);
            }
          } else {
            sessionStorage.setItem('transationPage', JSON.stringify(i));
            TransactionTableClear();
            for (i, j = 0; j < arr[i].length - 1; j++) {
              renderRow(i, j);
              transactionColor(id);
            }
          }
        });

        btnBack.addEventListener('click', () => {
          if (btnForward.hasAttribute('disabled')) {
            btnForward.removeAttribute('disabled');
          }
          i = JSON.parse(sessionStorage.getItem('transationPage')) - 1;
          if (i === 0) {
            btnBack.setAttribute('disabled', 'disabled');
            TransactionTableClear();
            for (i, j = 0; j < arr[i].length - 1; j++) {
              renderRow(i, j);
              transactionColor(id);
            }
          } else {
            sessionStorage.setItem('transationPage', JSON.stringify(i));
            TransactionTableClear();
            for (i, j = 0; j < arr[i].length - 1; j++) {
              renderRow(i, j);
              transactionColor(id);
            }
          }
        });
      }
      for (i = 0, j = 0; j < arr[i].length; j++) {
        renderRow(i, j);
      }
    }
  }
  transactionColor(id);

}
//   отрисовка кнопок постраничной навигации транзакций
function renderPaginationTransactionButtons() {
  const blockBtn = el('.transaction-block-btn', [
    el('button.transaction-btn.btn-back', [
      el('.transaction-btn-back'),
    ]),
    el('button.transaction-btn.btn-forward', [
      el('.transaction-btn-forward'),
    ]),
  ]);
  mount(main, blockBtn);
}
//   очистка таблицы с историей транзакций
function TransactionTableClear() {
  const historyTable = document.querySelector('.history-table');
  while (historyTable.firstChild) {
    historyTable.firstChild.remove();
  }
}
//   отрисовка детализации счёта
function accountDetailsRendering(res, arr, id, balance) {
  const mainHeder = el('.main-header.main-header_detaling', [
    el('.main-header__account-number', [
      el('h2.subtitle.main-header__title', 'Просмотр счёта'),
      el('p.main-header__number', `${res.account}`),
    ]),
    el('.auxiliaryBlock', [
      el(
        'button.btn.btn_primary.main-header__btn.main-header__btn_detaling',
        'Вернуться назад',
      ),
      el('h3.detailing-title.auxiliaryBlock__title', 'Баланс'),
      el('p.balance', `${res.balance}`),
    ]),
  ]);
  const detaling = el('.detaling', [
    el('article.detaling__article.detaling__article_gray.new-translation', [
      el('h3.detailing-title', 'Новый перевод'),
      el('form.detailing__form.form', [
        el(
          'label.detailing__label.form__label',
          'Номер счёта получателя',
          el('input#recipient-number.detailing__inp.form__inp', {
            type: 'text',
            autofocus: true,
            placeholder: 'Введите номер счёта получателя',
            list: 'account-number'
          }),
          el('datalist#account-number.account-autocomplit',
            [el('option.autocomplit-option', {
              value: '111222333',
            }),]),
        ),
        el(
          'label.detailing__label.form__label',
          'Сумма перевода',
          el('input#transfer-amount.detailing__inp.form__inp', {
            type: 'text',
            autofocus: true,
            placeholder: 'Введите сумму перевода',
          }),
        ),
        el('p.detailing-form__error.form__error', 'Ошибка'),
        el(
          'button.detailing-form__btn.btn.btn_primary.form__btn',
          { disabled: 'disabled' },
          'Отправить',
        ),
      ]),
    ]),
    el('article.detaling__article.balance-dynamics.detaling__article_white', [
      el('h3.detailing-title', 'Динамика баланса'),
      el('.half-a-year', el('canvas#balance-chart.balance-chart')),
      el('.year.chart-off', el('canvas#balance-chart-year.balance-chart.balance-chart-year')),
    ]),
    el('article.detaling__article.balance-ratio.detaling__article_white', [
      el('h3.detailing-title', 'Соотношение входящих исходящих транзакций'),
      el('.transaction-ratio', el('canvas#ratio.balance-chart')),
    ]),
    el('article.detaling__article.detaling__article_gray.translation-history', [
      el('h3.detailing-title', 'История переводов'),
      el('table.translation-history__table.history-table', [
        el('tr.history-table__row.history-table__row-head', [
          el('th.history-table__th.history-table__th-left', 'Счёт отправителя'),
          el('th.history-table__th.th2', 'Счёт получателя'),
          el('th.history-table__th.th3', 'Сумма'),
          el('th.history-table__th.history-table__th-right', 'Дата'),
        ]),
      ]),
    ]),
  ]);
  setChildren(main, [mainHeder, detaling]);
  constructionBalanceChart('balance-chart', arr, id, balance);
  constructionBalanceChartYear('balance-chart-year', arr, id, balance);
  constructionChartTransactionRatio('ratio', arr, id, balance);
  renderPaginationTransactionButtons();
  // renderingEdgeTransactionTable(arr);
  // transactionColor(id);
}
//   отрисовка валютной страницы
function currencyPageRendering() {
  const mainHeder = el('.main-header.main-header_currency', [
    el('h2.subtitle.main-header__title', 'Валютный обмен'),
  ]);
  const currency = el('.currency', [
    el('article.detaling__article.detaling__article_white.my-currency', [
      el('h3.detailing-title', 'Ваши валюты'),
      el('ul.my-currency-list'),
    ]),
    el('article.detaling__article.detaling__article_white.exchange-currency', [
      el('h3.detailing-title', 'Обмен валюты'),
      el('form.exchange', [
        el('label.exchange__span.exchange__span_from', 'Из', el('.exchange__select.dropdawn.dropdawn_grey', { 'data-as': 'from' }, [
          el('p.dropdawn__text.dropdawn__text_exchange', { 'data-drt': 'from' },),
          el('ul.dropdawn__list.dropdawn-exchange', { 'data-drl': 'from' },),
        ])),
        el('label.exchange__span..exchange__span_to', 'в', el('.exchange__select.dropdawn.dropdawn_grey', { 'data-as': 'to' }, [
          el('p.dropdawn__text.dropdawn__text_exchange', { 'data-drt': 'to' }),
          el('ul.dropdawn__list.dropdawn-exchange', { 'data-drl': 'to' }),
        ])),
        el('label.exchange__span.exchange__span_amount', 'Сумма', [el('input.exchange__inp'),]),
        el('button.button.btn.btn_primary.exchange__btn', { 'disabled': 'disabled' }, 'Обменять'),
      ])
    ]),
    el('article.detaling__article.detaling__article_gray.changes-currency', [
      el('h3.detailing-title', 'Изменение курсов в реальном времени'),
      el('ul.changes-currency-list'),
    ]),
  ]);
  setChildren(main, [mainHeder, currency]);
}
//   добавляю имеющиеся валютные счета пользователя в список
function fillingTheListOfUserCurrencies(res) {
  const myCurrencyList = document.querySelector('.my-currency-list');
  let arr = [];
  for (let r in res) {
    arr.push(res[r]);
  };
  arr = arr.filter(el => el.amount != 0);
  arr.forEach(elem => {
    const myCurrencyItem = el('li.my-currency-item', [
      el('span.current-name', `${elem.code}`),
      el('.current-line'),
      el('span.current-name.current-amount', `${elem.amount}`),
    ]);
    mount(myCurrencyList, myCurrencyItem);
  });
}
//   отрисовка изменения курсов валют
function drawingChangesInExchangeRates() {
  let exchangeRateChanges = [
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "NZD",
      "to": "CHF",
      "rate": 62.79,
      "change": -1
    }, {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "NZD",
      "to": "CHF",
      "rate": 62.79,
      "change": -1
    }, {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 0
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "NZD",
      "to": "CHF",
      "rate": 62.79,
      "change": -1
    }, {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "NZD",
      "to": "CHF",
      "rate": 62.79,
      "change": -1
    }, {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 0
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },
    {
      "type": "EXCHANGE_RATE_CHANGE",
      "from": "BTC",
      "to": "ETH",
      "rate": 6.3123545131,
      "change": 1
    },

  ];
  let change;

  const changesCurrency = document.querySelector('.changes-currency-list');
  exchangeRateChanges.forEach(elem => {
    if (elem.change === 1) {
      change = 'promotion';
    } else if (elem.change === -1) {
      change = 'downgrade';
    } else {
      change = 'unaltered';
    }
    const exchangeКateСhangesItem = el('li.my-currency-item', [
      el('span.current-name', `${elem.from}/${elem.to}`),
      el('span.current-line'),
      el('span.current-name.current-amount', `${elem.rate}`),
      el(`span.triangle.${change}`)
    ]);
    mount(changesCurrency, exchangeКateСhangesItem);
  });
}
//   добавляю список достпуных к обмену валют
function exchangeList(res) {
  const dropdawnExchange = document.querySelectorAll('.dropdawn-exchange');
  const dropdawnTextExchange = document.querySelectorAll('.dropdawn__text_exchange');
  dropdawnExchange.forEach(el => {
    res.forEach(elem => {
      el.innerHTML += `<li class="dropdawn__item">${elem}</li>`;
    });
  });
  dropdawnTextExchange.forEach(el => {
    el.textContent = res[0];
  });

  // <li class="dropdawn__item">AAA</li>



}
//   отрисовка страницы с картой банкоматов
function mapPageRendering() {
  const mainBody = document.querySelector('main');
  const mainHeder = el('.main-header', el('h2.subtitle.main-header__title', 'Карта банкоматов'));
  const map = el('.my-map#map', {
    // style: { width: '200px', height: '200px' }
  });
  setChildren(mainBody, [mainHeder, map]);
}
export {
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
  mapPageRendering
};
