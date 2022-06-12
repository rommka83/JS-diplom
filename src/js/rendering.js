import { el, mount, setChildren } from 'redom';
import { transactionDateFormatting } from './logic-functions';

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
    el('form.account-login__form.acc-form', [
      el(
        'label.acc-form__label',
        'Логин',
        el('input#login.acc-form__inp', {
          type: 'text',
          autofocus: true,
          placeholder: 'Введите логин',
        }),
      ),
      el(
        'label.acc-form__label',
        'Пароль',
        el('input#password.acc-form__inp', {
          type: 'text',
          autofocus: true,
          placeholder: 'Введите пароль',
        }),
      ),
      el('p.acc-form__error', 'Ошибка'),
      el(
        'button.acc-form__btn.btn.btn_primary',
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
    el('button.blok-btn__btn.btn.btn_white', 'Банкоматы'),
    el('button.blok-btn__btn.btn.btn_white', 'Счета'),
    el('button.blok-btn__btn.btn.btn_white', 'Валюта'),
    el('button.blok-btn__btn.btn.btn_white', 'Выйти'),
  ]);
  mount(header, blokBtn);
}
//   отрисовка основной страницы личного кабинета
function renderMainPageOfPersonalAccount(arr) {
  const mainBody = document.querySelector('main');
  const mainHeder = el('.main-header', [
    el('h2.subtitle.main-header__title', 'Ваши счета'),
    el('.main-header__select.dropdawn', [
      el('p.dropdawn__text', 'Сортировка'),
      el('ul.dropdawn__list', [
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
    if (e.transactions > 0) {
      transation = e.transactions[0].date;
    } else {
      transation = 'нет';
    }
    const account = el('li.accounts-item.account', [
      el('h3.account__title', `${e.account}`),
      el('p.account__balance', `${e.balance} ₽`),
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
  setChildren(main, mainHeder);
  mount(main, accounts);
}

export {
  start,
  renderingHeaderBlokButton,
  renderingAccountLogin,
  renderMainPageOfPersonalAccount,
};
