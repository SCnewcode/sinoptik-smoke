/// <reference types="cypress" />

describe("Your Test Suite Description", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("development").baseUrl);
  });

  it("should search for Kyiv and verify the response code is 200", () => {
    // Вводимо "Київ" в строку пошуку
    cy.get('[class="_5ajd1F+X"]').type("Київ").should("have.value", "Київ");
    cy.wait(1000);
    cy.get(".Fj7Ei9fA").contains("Київ").click();

    cy.intercept("POST", "**/by_id").as("getData");

    cy.wait("@getData").then((interception) => {
      // Перевіряємо, що статус відповіді — 200
      expect(interception.response.statusCode).to.eq(200);

      // Додатково перевіряємо payload (тіло відповіді)

      const payload = interception.response.body.location;

      expect(payload).to.have.property("id", "kyiv");
    });

    // Масив для локалізації
    const daysOfWeek = [
      "неділя",
      "понеділок",
      "вівторок",
      "середа",
      "четвер",
      "пʼятниця",
      "субота",
    ];

    const dataMonth = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня",
    ];

    // Функція для перевірки вкладок
    const checkTabs = (daysCount) => {
      const today = new Date();

      for (let i = 0; i < daysCount; i++) {
        // Розраховуємо дату для вкладки
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        // Форматуємо очікувані значення
        const expectedDay = daysOfWeek[currentDate.getDay()];
        const expectedDate = currentDate.getDate();
        const expectedMonth = dataMonth[currentDate.getMonth()];

        // Перехоплюємо API-запит для вкладки
        cy.intercept("GET", "**/visit/**").as(`dayTab${i}`);

        cy.log(`Очікувано: ${expectedDay}, ${expectedDate} ${expectedMonth}`);

        // Клікаємо на вкладку
        cy.get(".vV3dvPLZ").eq(i).click();

        // Чекаємо на відповідь API
        cy.wait(`@dayTab${i}`).then((interception) => {
          // Перевіряємо, що статус відповіді — 200
          expect(interception.response.statusCode).to.eq(200);

          // Перевіряємо, що дані у вкладці збігаються з очікуваними
          cy.get(".BzO81ZRx").eq(i).should("contain.text", expectedDay);

          cy.get(".BrJ0wZrO").eq(i).should("contain.text", expectedDate);
        });
      }
    };

    // Перевіряємо вкладки для 7 днів
    checkTabs(7);

    // Перемикаємося на вкладку з 10 днями
    cy.get('[class="_6PGiL3ZC _4BkYU2qP"]').click();
    cy.intercept("GET", "**/visit/**").as("getData10Days");
    cy.wait("@getData10Days").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Перевіряємо вкладки для 10 днів
    checkTabs(10);
  });
});
