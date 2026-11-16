export const MAX_TICKETS_PER_CLASS = 4;
export const MINIMUM_AGE = 16;
export const MINIMUM_BOOKING_TOTAL = 2000;

export function validateTicketQuantity(
  quantity,
  seatsLeft,
  maximum = MAX_TICKETS_PER_CLASS,
) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, message: "Choose at least one place." };
  }

  if (quantity > maximum) {
    return {
      valid: false,
      message: `A booking can include at most ${maximum} places per class.`,
    };
  }

  if (quantity > seatsLeft) {
    return {
      valid: false,
      message: `Only ${seatsLeft} ${seatsLeft === 1 ? "place is" : "places are"} currently available.`,
    };
  }

  return { valid: true, message: "Quantity is available." };
}

export function validateAge(age) {
  const numericAge = Number(age);

  if (!age && age !== 0) {
    return { valid: false, message: "Enter the attendee’s age." };
  }

  if (!Number.isInteger(numericAge) || numericAge < MINIMUM_AGE) {
    return {
      valid: false,
      message: `Attendees must be at least ${MINIMUM_AGE} years old.`,
    };
  }

  return { valid: true, message: "Age requirement met." };
}

export function validateMinimumTotal(subtotal) {
  if (subtotal < MINIMUM_BOOKING_TOTAL) {
    return {
      valid: false,
      amountNeeded: MINIMUM_BOOKING_TOTAL - subtotal,
      message: `Add PKR ${(MINIMUM_BOOKING_TOTAL - subtotal).toLocaleString()} more to reach the PKR ${MINIMUM_BOOKING_TOTAL.toLocaleString()} online-booking minimum.`,
    };
  }

  return { valid: true, amountNeeded: 0, message: "Minimum total reached." };
}
