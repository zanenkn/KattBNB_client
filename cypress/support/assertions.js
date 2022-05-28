class Assertions {
  confirm = (text) => {
    cy.on('window:confirm', (confirmation) => {
      expect(confirmation).to.equal(text);
    });
  };
  alert = (text) => {
    cy.on('window:alert', (alert) => {
      expect(alert).to.equal(text);
    });
  };
}

module.exports = new Assertions();
