/* eslint-disable no-undef */
describe('My First Test', () => {
  const baseUrl = 'http://localhost:8080/'
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })

  it('start slide show', () => {
    cy.visit(baseUrl)
    // cy.contains('Let\'s share your smile!').click()
    cy.get('.start_phrase').click()
    cy.wait(6000)
    cy.url().should('include', '/slide_show')
  })

  it('start content', () => {
    cy.visit(baseUrl + '#/start_contest')
    cy.get('.start_button').click()
  })
})
