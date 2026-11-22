import test from "node:test";
import assert from "node:assert/strict";
import { classDate, nextWeekDate } from "../src/utils/schedule.js";

test("next complete week begins on the coming Monday", () => {
  assert.equal(nextWeekDate(0, new Date(2026, 10, 22, 12)), "2026-11-23");
  assert.equal(nextWeekDate(6, new Date(2026, 10, 22, 12)), "2026-11-29");
  assert.equal(nextWeekDate(0, new Date(2026, 10, 23, 12)), "2026-11-30");
});

test("missing class dates have a useful fallback", () => {
  assert.equal(classDate({}), "Date to be confirmed");
});
