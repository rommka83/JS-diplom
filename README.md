сборка: 'npm run build',
запуск в режиме разработчика: 'npm run dev',
запуск е2е тестов: 'npm run cypress:open',

1. Из задания:... 'График «Соотношение входящих и исходящих транзакций» аналогичен по своему функционалу графику динамики баланса, описанному выше, однако с некоторыми отличиями. Отличие в том, что мы теперь выводим раскрашенные частями полоски, красная часть полоски отражает процент расходных (негативных) транзакций в этом столбике, зелёная часть полоски отражает процент доходных (положительных) транзакций в этом столбике. Справа вводится ещё одна цифра между максимальным и минимальным значением баланса, это цифра, показывающая максимальное значение либо отрицательного, либо положительного соотношения транзакций, смотря какое меньше.'
   ВОПРОС: сумма транзакций - не равна балансу, про какое процентное соотношение идёт речь?
   Моё решение: вместо баланса - общая сумма транзакций.
