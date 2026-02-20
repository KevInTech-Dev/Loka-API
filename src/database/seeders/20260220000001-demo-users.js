"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Admin",
        last_name: "Loka",
        email: "admin@loka.com",
        phone: "+33600000000",
        role: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@email.com",
        phone: "+33612345678",
        role: "owner",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Marie",
        last_name: "Martin",
        email: "marie.martin@email.com",
        phone: "+33698765432",
        role: "tenant",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Pierre",
        last_name: "Bernard",
        email: "pierre.bernard@email.com",
        phone: "+33655555555",
        role: "manager",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Sophie",
        last_name: "Laurent",
        email: "sophie.laurent@email.com",
        phone: null,
        role: "tenant",
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
