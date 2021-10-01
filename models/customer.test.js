"use strict";

const express = require("express");
const db = require("../db");
const Reservation = require("./reservation");
const request = require("supertest");
const app = require("../app");
const Customer = require("./customer");

let custId;

beforeEach(async function(){
    await db.query("DELETE FROM reservations");
    await db.query("DELETE FROM customers");
    await db.query(`
      INSERT INTO customers (first_name,last_name)
          VALUES ('testFirst', 'testLast')
          `);
    
    let result = await db.query(`SELECT id FROM customers WHERE first_name = 'testFirst'`);
    custId = result.rows[0].id

    console.log("this is cust Id before each",custId)

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
    test("Gets a list of all customers", async function () {
        let customerList = await Customer.all();

      expect(customerList.length).toEqual(1);
      expect(customerList[0]).toBeInstanceOf(Customer);
    });
  });