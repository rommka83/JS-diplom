const body = document.querySelector('body');

//   валидация формы
function formValidation() {
  const entryBtn = document.querySelector('.acc-form__btn');
  const login = document.getElementById('login');
  const password = document.getElementById('password');
  const sample = /[^\s.]{6}/i;
  const errMessage = document.querySelector('.acc-form__error');
  login.addEventListener('blur', () => {
    if (sample.test(login.value) === false) {
      login.classList.add('acc-form__inp_err');
      errMessage.textContent =
        'Логин должен содержать не менее 6 символов, введённых без пробелов';
      errMessage.style.opacity = '1';
    } else if (
      sample.test(login.value) === true &&
      sample.test(password.value) === true
    ) {
      entryBtn.removeAttribute('disabled');
    }
  });
  login.addEventListener('keydown', () => {
    login.classList.remove('acc-form__inp_err');
    errMessage.style.opacity = '0';
  });
  password.addEventListener('blur', () => {
    if (sample.test(password.value) === false) {
      password.classList.add('acc-form__inp_err');
      errMessage.textContent =
        'Пароль должен содержать не менее 6 символов, введённых без пробелов';
      errMessage.style.opacity = '1';
    } else if (
      sample.test(login.value) === true &&
      sample.test(password.value) === true
    ) {
      entryBtn.removeAttribute('disabled');
    }
  });
  password.addEventListener('keydown', () => {
    password.classList.remove('acc-form__inp_err');
    errMessage.style.opacity = '0';
  });
}
//   дата транзакции в соответствии с макетом
function transactionDateFormatting(value) {
  if (value === 'нет') {
    return 'нет';
  } else {
    let date = new Date(value);
    let month;
    if (date.getMonth() === 0) month = 'января';
    if (date.getMonth() === 1) month = 'февраля';
    if (date.getMonth() === 2) month = 'марта';
    if (date.getMonth() === 3) month = 'апреля';
    if (date.getMonth() === 4) month = 'мая';
    if (date.getMonth() === 5) month = 'июня';
    if (date.getMonth() === 6) month = 'июля';
    if (date.getMonth() === 7) month = 'августа';
    if (date.getMonth() === 8) month = 'сентября';
    if (date.getMonth() === 9) month = 'октября';
    if (date.getMonth() === 10) month = 'ноября';
    if (date.getMonth() === 11) month = 'декабря';
    return `${date.getDate()} ${month} ${date.getFullYear()}`;
  }
}
//   сортировка
function sorting() {
  let dropdawnText;
  let dropdawnList;
  let dropdawnItems;
  //   открыл список, назначил тип сортировки
  body.addEventListener('click', (event) => {
    dropdawnText = document.querySelector('.dropdawn__text');
    dropdawnList = document.querySelector('.dropdawn__list');
    dropdawnItems = document.querySelectorAll('.dropdawn__item');
    if (event.target.className === 'main-header__select dropdawn') {
      dropdawnList.classList.toggle('dropdawn__list-active');
      dropdawnText.classList.toggle('dropdawn__text-open');
    }
    if (event.target.className === 'dropdawn__item') {
      dropdawnItems.forEach((el) => {
        el.classList.remove('dropdawn__item-active');
      });
      event.target.classList.add('dropdawn__item-active');
      dropdawnText.textContent = event.target.textContent;
      dropdawnList.classList.remove('dropdawn__list-active');
      dropdawnText.classList.remove('dropdawn__text-open');
    }
  });
}

export { formValidation, transactionDateFormatting, sorting };

// 0:
// account: "74213041477477406320783754"
// balance: 1366288.39
// mine: true
// transactions: Array(1)
// 0:
// amount: 399.11
// date: "2022-06-10T06:25:54.610Z"
// from: "05320051274371448747813855"
// to: "74213041477477406320783754"
