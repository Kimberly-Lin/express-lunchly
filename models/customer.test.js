"use strict";

const express = require("express");
const db = require("../db");
const Reservation = require("./reservation");
const request = require("supertest");
const app = require("../app");
const Customer = require("./customer");

let custId;

beforeEach(async function () {
  await db.query("DELETE FROM reservations");
  await db.query("DELETE FROM customers");
  await db.query(`
      INSERT INTO customers (first_name,last_name)
          VALUES ('testFirst', 'testLast')
          `);

  let result = await db.query(`SELECT id FROM customers WHERE first_name = 'testFirst'`);
  custId = result.rows[0].id

  await db.query(`
    INSERT INTO reservations (customer_id,start_at,num_guests)
        VALUES ('${custId}', '2018-02-09 11:29:48-08', '3')
        `);
  await db.query(`
    INSERT INTO reservations (customer_id,start_at,num_guests)
        VALUES ('${custId}', '2020-02-09 11:29:48-08', '4')
        `);
});

/** get all customers with Customer.all()*/

describe("Customer class methods", function () {

  test("all() Gets a list of all customers", async function () {
    let customerList = await Customer.all();

    expect(customerList.length).toEqual(1);
    expect(customerList[0]).toBeInstanceOf(Customer);
  });

  test("get(id) Gets a customer by id", async function () {
    let customer = await Customer.get(custId);
    console.log(customer);
    expect(customer.firstName).toEqual("testFirst");
    expect(customer.lastName).toEqual("testLast");
  });

  test("get(id) Gets a customer by invalid id", async function () {
    try {
      await Customer.get(0);
    } catch (err) {
      expect(err.message).toEqual("No such customer: 0");
      expect(err.status).toEqual(404);
    }
  });

  test("find() Gets list of customers by search term", async function () {
    let customers = await Customer.find("test");
    expect(customers[0].firstName).toEqual("testFirst");
    expect(customers[0].lastName).toEqual("testLast");
  });

});