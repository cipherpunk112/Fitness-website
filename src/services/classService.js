import { fitnessClasses } from "../data/classes";
import { nextWeekDate } from "../utils/schedule";

const WAIT_TIME = 450;

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function loadFitnessClasses({
  shouldFail = false,
  reduceAvailability = false,
} = {}) {
  await wait(WAIT_TIME);

  if (shouldFail) {
    throw new Error("The class schedule could not be loaded. Please try again.");
  }

  return fitnessClasses.map((fitnessClass) => {
    const weekdayOffset = new Date(`${fitnessClass.date}T12:00:00`).getDay();
    const scheduled = {
      ...fitnessClass,
      date: nextWeekDate((weekdayOffset + 6) % 7),
    };
    if (!reduceAvailability) return scheduled;
    if (fitnessClass.id === "boxing-basics") {
      return { ...scheduled, seatsLeft: 1 };
    }

    if (fitnessClass.id === "strength-foundations") {
      return { ...scheduled, seatsLeft: 0 };
    }

    return scheduled;
  });
}
