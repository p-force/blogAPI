/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        fullName: faker.internet.userName(),
        email: '123@mail.ru',
        password: await bcrypt.hash('password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: faker.internet.userName(),
        email: 'zxc@mail.ru',
        password: await bcrypt.hash('secret', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: faker.internet.userName(),
        email: 'qwer@mail.ru',
        password: await bcrypt.hash('password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const data = [];
    for (let i = 0; i < 60; i++) {
      const obj = {
        content: faker.lorem.paragraph(),
        userId: [1, 2, 3][Math.floor(Math.random() * [1, 2, 3].length)],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      data.push(obj);
    }
    await queryInterface.bulkInsert('BlogPosts', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.bulkDelete('BlogPost', null, {});
  },
};
