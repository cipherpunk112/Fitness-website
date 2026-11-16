import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_TICKETS_PER_CLASS,
  validateTicketQuantity,
} from "../src/rules/bookingRules.js";

test("accepts an ordinary valid ticket quantity", () => {
  const result = validateTicketQuantity(2, 8);

  assert.equal(result.valid, true);
});

test("accepts a quantity exactly at the four-ticket limit", () => {
  const result = validateTicketQuantity(MAX_TICKETS_PER_CLASS, 8);

  assert.equal(result.valid, true);
});

test("rejects a quantity above the four-ticket limit", () => {
  const result = validateTicketQuantity(MAX_TICKETS_PER_CLASS + 1, 8);

  assert.equal(result.valid, false);
  assert.match(result.message, /at most 4/i);
});
