/* eslint-disable no-undef */
/// <reference types='cypress'/>

describe('Проверка возможности авторизоваться', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/');
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
  });

  // it('Проверка возмзжности просмотреть список счетов', () => {
  //   cy.get('.accounts').should('be.visible');
  // });

  it('Проверка возможности перевода средств между счетами', () => {
    cy.get('.account__btn').first().click();
    cy.get('#recipient-number').type('41768263167684805848581582');
    cy.get('#transfer-amount').type('100');
    cy.get('.detailing-form__btn').click();
  });

  it('Проверка возможности создания нового счёта', () => {
    cy.contains('Создать новый счёт').click();
  });
});
