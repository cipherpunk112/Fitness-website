import { fitnessClasses } from "../data/classes";

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

  if (!reduceAvailability) {
    return fitnessClasses.map((fitnessClass) => ({ ...fitnessClass }));
  }

  return fitnessClasses.map((fitnessClass) => {
    if (fitnessClass.id === "boxing-basics") {
      return { ...fitnessClass, seatsLeft: 1 };
    }

    if (fitnessClass.id === "strength-foundations") {
      return { ...fitnessClass, seatsLeft: 0 };
    }

    return { ...fitnessClass };
  });
}
