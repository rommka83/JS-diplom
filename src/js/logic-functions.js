/* eslint-disable prettier/prettier */
import IMask from 'imask';

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
//   функция восполнения недостающих данных в прошедших годах
function dataReplenishment(arr) {
  if (arr.length) {
    if (arr[0].month !== 11) {
      let j = 11 - arr[0].month;
      let bal = arr[0].balance + arr[0].consumption - arr[0].coming;
      for (let i = 1; i <= j; i++) {
        arr.unshift({
          month: arr[0].month + 1, balance: bal, year: arr[0].year, consumption: 0, coming: 0
        });
      }
    }
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].month !== arr[i + 1].month + 1) {
        let obj = {
          month: arr[i].month - 1, balance: arr[i - 1].balance + arr[i - 1].consumption - arr[i - 1].coming, year: arr[i].year, consumption: 0, coming: 0
        };
        arr.splice(i + 1, 0, obj);
      }
    }
    return arr;
  }
}
//   восстанавливаю данные за текущий год
function currentReplenishment(current) {

  let k = current.length - 1;
  if (current.length) {
    if (current[k].month !== 0) {
      let bal = current[k].balance + current[k].consumption - current[k].coming;
      for (let i = current[k].month; i > 0; i--) {
        let obj = {
          month: i - 1, balance: bal, year: current[0].year, consumption: 0, coming: 0
        };
        current.push(obj);
      }
    }
  }
  return current;
}
//   создание массива балансов по месяцам
function creatingAnArrayOfBalancesByMonth(arr, id, balance) {
  if (arr.length) {
    let arrayOfMonthlyBalances = [];
    let balanceMounth = Number(balance);
    let newBalance = Number(balance);
    let extremeMonth = new Date().getMonth();
    let extremeYear = new Date().getFullYear();

    let previous = extremeMonth;
    let consumption = 0;
    let coming = 0;

    //   разбил полученный массив по месяцам
    for (let i = arr.length - 1; i >= 0; i--) {
      let amount = arr[i].amount;
      if (new Date(arr[i].date).getMonth() === previous && i !== 0) {
        if (arr[i].from === id) {
          newBalance = newBalance + amount;
          consumption = consumption + amount;
        } else {
          newBalance = newBalance - amount;
          coming = coming + amount;
        }
      } else if (new Date(arr[i].date).getMonth() === previous && i === 0) {
        if (arr[i].from === id) {
          newBalance = newBalance + amount;
          consumption = consumption + amount;
        } else {
          newBalance = newBalance - amount;
          coming = coming + amount;
        }
        arrayOfMonthlyBalances.push({ month: previous, balance: balanceMounth, year: extremeYear, consumption: consumption, coming: coming, });
      } else {
        arrayOfMonthlyBalances.push({ month: previous, balance: balanceMounth, year: extremeYear, consumption: consumption, coming: coming, });
        balanceMounth = newBalance;
        previous = new Date(arr[i].date).getMonth();
        extremeYear = new Date(arr[i].date).getFullYear();

        if (arr[i].from === id) {
          newBalance = newBalance + amount;
          consumption = amount;
          coming = 0;
        } else {
          newBalance = newBalance - amount;
          coming = amount;
          consumption = 0;
        }
      }
    }
    console.log('Исходный', arrayOfMonthlyBalances);
    //   массив месяцев разделяю на массивы по годам
    let current = [];
    let last = [];
    let past = [];
    arrayOfMonthlyBalances.forEach(el => {
      if (el.year === arrayOfMonthlyBalances[0].year) {
        current.push(el);
      }
      if (el.year == arrayOfMonthlyBalances[0].year - 1) {
        last.push(el);
      }
      if (el.year == arrayOfMonthlyBalances[0].year - 2) {
        past.push(el);
      }
    });

    //   восстанавливаю недостающие данные по месяцам
    currentReplenishment(current);
    dataReplenishment(last);
    dataReplenishment(past);
    //   собираю массив обратно
    arrayOfMonthlyBalances = current.concat(last, past);
    //    присвоение месяцам имён
    arrayOfMonthlyBalances.map(el => {
      if (el.month == 0) {
        return el.month = 'янв';
      }
      if (el.month == 1) {
        return el.month = 'фев';
      }
      if (el.month == 2) {
        return el.month = 'мар';
      }
      if (el.month == 3) {
        return el.month = 'апр';
      }
      if (el.month == 4) {
        return el.month = 'май';
      }
      if (el.month == 5) {
        return el.month = 'июн';
      }
      if (el.month == 6) {
        return el.month = 'июл';
      }
      if (el.month == 7) {
        return el.month = 'авг';
      }
      if (el.month == 8) {
        return el.month = 'сен';
      }
      if (el.month == 9) {
        return el.month = 'окт';
      }
      if (el.month == 10) {
        return el.month = 'нояб';
      }
      if (el.month == 11) {
        return el.month = 'дек';
      }
    });
    return arrayOfMonthlyBalances;
  }
}
//   построение графика "Динамика баланса" за последние шесть месяцев
function constructionBalanceChart(name, arr, id, balance) {
  let arrayOfMonthlyBalances = creatingAnArrayOfBalancesByMonth(arr, id, balance);
  if (arrayOfMonthlyBalances) {
    if (arrayOfMonthlyBalances.length > 6) {
      arrayOfMonthlyBalances = arrayOfMonthlyBalances.slice(0, 6);
    }

    const canvas = document.getElementById(name);
    canvas.width = document.documentElement.clientWidth * 0.4;
    canvas.height = 250;
    canvas.style.paddingTop = 10 + 'px';
    canvas.style.paddingRight = 10 + 'px';
    canvas.style.paddingLeft = 10 + 'px';

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width - 150;

    const PADDINGTOP = 20;
    const PADDINGBOTTOM = 30;
    const INTERVAL = 30;
    let amountMonth = arrayOfMonthlyBalances.length;
    let amountInterval = amountMonth + 1;

    const chartHeight = canvasHeight - PADDINGTOP - PADDINGBOTTOM;
    let heightFactor =
      chartHeight /
      Math.max(
        ...arrayOfMonthlyBalances.map((el) => {
          return el.balance;
        }),
      );
    let widthMonth = (canvasWidth - INTERVAL * amountInterval) / amountMonth;

    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.font = '20px serif';
      let x = INTERVAL;

      for (let i = arrayOfMonthlyBalances.length - 1; i >= 0; i--) {
        let heightBalance = arrayOfMonthlyBalances[i].balance * heightFactor;

        ctx.fillStyle = 'blue';
        ctx.fillRect(
          x,
          canvasHeight - PADDINGBOTTOM - heightBalance,
          widthMonth,
          heightBalance,
        );

        ctx.fillStyle = 'black';
        ctx.fillText(
          `${arrayOfMonthlyBalances[i].month}`,
          x + widthMonth / 2 - 20,
          canvas.height - 10,
        );

        x += widthMonth + INTERVAL;
      }
      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(canvasWidth, PADDINGTOP);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasWidth, PADDINGTOP);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.fillText(
        `${Math.max(
          ...arrayOfMonthlyBalances.map((el) => {
            return el.balance;
          }),
        )} `,
        canvasWidth + 5,
        PADDINGTOP + 5,
      );

      ctx.fillText('0', canvasWidth + 10, canvasHeight - PADDINGBOTTOM + 5);
    }
  }
}
//   построение графика "Динамика баланса" за последние двенадцать месяцев
function constructionBalanceChartYear(name, arr, id, balance) {
  let arrayOfMonthlyBalances = creatingAnArrayOfBalancesByMonth(arr, id, balance);

  if (arrayOfMonthlyBalances) {
    if (arrayOfMonthlyBalances.length > 12) {
      arrayOfMonthlyBalances = arrayOfMonthlyBalances.slice(0, 12);
    }

    const canvas = document.getElementById(name);
    canvas.width = document.documentElement.clientWidth * 0.9;
    canvas.height = 250;
    canvas.style.paddingTop = 10 + 'px';
    canvas.style.paddingRight = 10 + 'px';
    canvas.style.paddingLeft = 10 + 'px';

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width - 150;

    const PADDINGTOP = 20;
    const PADDINGBOTTOM = 30;
    const INTERVAL = 30;
    let amountMonth = arrayOfMonthlyBalances.length;
    let amountInterval = amountMonth + 1;

    const chartHeight = canvasHeight - PADDINGTOP - PADDINGBOTTOM;
    let heightFactor =
      chartHeight /
      Math.max(
        ...arrayOfMonthlyBalances.map((el) => {
          return el.balance;
        }),
      );
    let widthMonth = (canvasWidth - INTERVAL * amountInterval) / amountMonth;

    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.font = '20px serif';
      let x = INTERVAL;

      for (let i = arrayOfMonthlyBalances.length - 1; i >= 0; i--) {
        let heightBalance = arrayOfMonthlyBalances[i].balance * heightFactor;

        ctx.fillStyle = 'blue';
        ctx.fillRect(
          x,
          canvasHeight - PADDINGBOTTOM - heightBalance,
          widthMonth,
          heightBalance,
        );

        ctx.fillStyle = 'black';
        ctx.fillText(
          `${arrayOfMonthlyBalances[i].month}`,
          x + widthMonth / 2 - 20,
          canvas.height - 10,
        );

        x += widthMonth + INTERVAL;
      }
      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(canvasWidth, PADDINGTOP);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasWidth, PADDINGTOP);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.fillText(
        `${Math.round(Math.max(
          ...arrayOfMonthlyBalances.map((el) => {
            return el.balance;
          }),
        ))} `,
        canvasWidth + 5,
        PADDINGTOP + 5,
      );

      ctx.fillText('0', canvasWidth + 10, canvasHeight - PADDINGBOTTOM + 5);
    }
  }
}
//   построение графика соотношения транзакций
function constructionChartTransactionRatio(name, arr, id, balance) {

  let arrayOfMonthlyBalances = creatingAnArrayOfBalancesByMonth(arr, id, balance);

  if (arrayOfMonthlyBalances) {
    if (arrayOfMonthlyBalances.length > 12) {
      arrayOfMonthlyBalances = arrayOfMonthlyBalances.slice(0, 12);
    }

    const canvas = document.getElementById(name);
    canvas.width = document.documentElement.clientWidth * 0.9;
    canvas.height = 250;
    canvas.style.paddingTop = 10 + 'px';
    canvas.style.paddingRight = 10 + 'px';
    canvas.style.paddingLeft = 10 + 'px';

    const canvasHeight = canvas.height;
    const canvasWidth = canvas.width - 150;

    const PADDINGTOP = 20;
    const PADDINGBOTTOM = 30;
    const INTERVAL = 30;
    let amountMonth = arrayOfMonthlyBalances.length;
    let amountInterval = amountMonth + 1;

    const chartHeight = canvasHeight - PADDINGTOP - PADDINGBOTTOM;
    let heightFactor =
      chartHeight /
      Math.max(
        ...arrayOfMonthlyBalances.map((el) => {
          return el.consumption + el.coming;
        }),
      );
    let minTransaction = Math.round(Math.max(
      ...arrayOfMonthlyBalances.map((el) => {
        return el.consumption;
      }),
    ));
    let widthMonth = (canvasWidth - INTERVAL * amountInterval) / amountMonth;

    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.font = '20px serif';
      let x = INTERVAL;

      for (let i = arrayOfMonthlyBalances.length - 1; i >= 0; i--) {
        let heightComing = arrayOfMonthlyBalances[i].coming * heightFactor;
        let heightConsumption = arrayOfMonthlyBalances[i].consumption * heightFactor;

        ctx.fillStyle = 'red';
        ctx.fillRect(
          x,
          canvasHeight - PADDINGBOTTOM - heightComing - heightConsumption,
          widthMonth,
          heightConsumption,
        );

        ctx.fillStyle = 'green';
        ctx.fillRect(
          x,
          canvasHeight - PADDINGBOTTOM - heightComing,
          widthMonth,
          heightComing,
        );

        ctx.fillStyle = 'black';
        ctx.fillText(
          `${arrayOfMonthlyBalances[i].month}`,
          x + widthMonth / 2 - 20,
          canvas.height - 10,
        );

        x += widthMonth + INTERVAL;
      }
      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(canvasWidth, PADDINGTOP);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasWidth, PADDINGTOP);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.lineTo(canvasWidth, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, PADDINGTOP);
      ctx.lineTo(0, canvasHeight - PADDINGBOTTOM);
      ctx.stroke();

      if (minTransaction !== 0) {
        ctx.fillText(
          `${minTransaction}`,
          canvasWidth + 10,
          canvasHeight - PADDINGBOTTOM - minTransaction * heightFactor - 5,
        );
      }

      ctx.fillText(
        `${Math.round(Math.max(
          ...arrayOfMonthlyBalances.map((el) => {
            return el.consumption + el.coming;
          }),
        ))} `,
        canvasWidth + 5,
        PADDINGTOP + 5,
      );

      ctx.fillText('0', canvasWidth + 10, canvasHeight - PADDINGBOTTOM + 5);
    }
  }
}
//   "раскрашиваю" транзакции в графике
function transactionColor(id) {
  const amounts = document.querySelectorAll('.amount');
  amounts.forEach(el => {
    if (el.parentElement.firstElementChild.textContent == id) {
      el.classList.add('amount_red');
    } else {
      el.classList.add('amount_green');
    }
  });
}
//   валидация новой транзакции
function validationOfAnewTransaction() {
  const recipient = document.getElementById('recipient-number');
  const amount = document.getElementById('transfer-amount');
  const btn = document.querySelector('.detailing-form__btn');
  IMask(recipient, { mask: Number });
  IMask(amount, { mask: Number });
  recipient.addEventListener('blur', () => {
    if (recipient.value && amount.value) {
      btn.removeAttribute('disabled');
    }
  });
  amount.addEventListener('blur', () => {
    if (recipient.value && amount.value) {
      btn.removeAttribute('disabled');
    }
  });
}
//   запись номера счёта в локальное хранилище для дальнейшего автодополнения
function writeAccountNumberToLocalStorage(recipient, arrAccounts) {
  if (arrAccounts.includes(recipient) === false) {
    arrAccounts.push(recipient);
    localStorage.setItem("accounts", JSON.stringify(arrAccounts));
  }
}
//   обновление элементов списка автодополнения
function updatingAutocompleteListItems(arrAccounts) {
  let dataList = document.getElementById('account-number');
  while (dataList.firstChild) {
    dataList.removeChild(dataList.firstChild);
  };
  arrAccounts.forEach(el => {
    dataList.innerHTML += `<option class="autocomplit-option" value=${el}></option>`;
  });
}
//   делю массив транзакций на подмассивы для страниц
function sliceIntoChunks(arr, chunkSize) {
  arr = arr.reverse();
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}



export {
  formValidation,
  transactionDateFormatting,
  sorting,
  constructionBalanceChart,
  transactionColor,
  validationOfAnewTransaction,
  writeAccountNumberToLocalStorage,
  updatingAutocompleteListItems,
  constructionBalanceChartYear,
  constructionChartTransactionRatio,
  sliceIntoChunks
};
