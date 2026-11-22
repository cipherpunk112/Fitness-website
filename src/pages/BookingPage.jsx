import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../components/StatusMessage";
import { useFitFlow } from "../context/FitFlowContext";
import { classDate } from "../utils/schedule";
import {
  MAX_TICKETS_PER_CLASS,
  MINIMUM_AGE,
  MINIMUM_BOOKING_TOTAL,
  validateAge,
  validateMinimumTotal,
} from "../rules/bookingRules";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  age: "",
  fitnessLevel: "Beginner",
};

function validateCustomer(form) {
  const errors = {};

  if (!/^[A-Za-z][A-Za-z .'-]{2,}$/.test(form.fullName.trim())) {
    errors.fullName = "Enter a full name using at least three characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter an email address in a valid format.";
  }

  if (!/^03\d{9}$/.test(form.phone.trim())) {
    errors.phone = "Enter an 11-digit Pakistani mobile number starting with 03.";
  }

  const ageResult = validateAge(form.age);
  if (!ageResult.valid) errors.age = ageResult.message;

  return errors;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const {
    selectedRows,
    selectionConflicts,
    subtotal,
    totalPlaces,
    notice,
    updateQuantity,
    removeFromSelection,
    clearSelection,
    completeBooking,
  } = useFitFlow();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  const totalResult = useMemo(() => validateMinimumTotal(subtotal), [subtotal]);
  const canSubmit =
    selectedRows.length > 0 &&
    selectionConflicts.length === 0 &&
    totalResult.valid;

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formErrors = validateCustomer(form);
    setErrors(formErrors);

    if (selectedRows.length === 0) {
      setSubmitMessage("Add at least one class before confirming the booking.");
      return;
    }

    if (selectionConflicts.length > 0) {
      setSubmitMessage("Correct the unavailable quantities before confirming.");
      return;
    }

    if (!totalResult.valid) {
      setSubmitMessage(totalResult.message);
      return;
    }

    if (Object.keys(formErrors).length > 0) {
      setSubmitMessage("Please correct the highlighted form fields. Your other entries have been kept.");
      return;
    }

    const confirmation = completeBooking({ ...form });
    navigate("/confirmation", { state: { confirmation } });
  }

  if (selectedRows.length === 0) {
    return (
      <section className="section">
        <div className="container state-card empty-plan">
          <span className="state-icon" aria-hidden="true">＋</span>
          <h1>Your weekly plan is empty.</h1>
          <p>Browse the schedule and add a class. Your choices will stay saved on this device.</p>
          <Link className="button primary large" to="/classes">Browse fitness classes</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section booking-section">
      <div className="container">
        <div className="page-heading">
          <p className="eyebrow">Review and complete</p>
          <h1>Your weekly fitness plan</h1>
          <p>Check quantities and availability before entering attendee details.</p>
        </div>

        {notice && <StatusMessage>{notice}</StatusMessage>}
        {submitMessage && <StatusMessage type="error">{submitMessage}</StatusMessage>}

        <form className="booking-grid" onSubmit={handleSubmit} noValidate>
          <div className="booking-main">
            <section className="panel" aria-labelledby="selected-classes-heading">
              <div className="panel-heading">
                <div>
                  <span className="step-label">Step 1</span>
                  <h2 id="selected-classes-heading">Selected classes</h2>
                </div>
                <button className="button text-button danger-text" type="button" onClick={clearSelection}>
                  Clear plan
                </button>
              </div>

              <div className="selected-list">
                {selectedRows.map((item) => {
                  const conflict = selectionConflicts.find((entry) => entry.id === item.id);
                  return (
                    <article className="selected-item" key={item.id}>
                      <div className="selected-icon" aria-hidden="true">{item.icon || "◆"}</div>
                      <div className="selected-copy">
                        <h3>{item.name}</h3>
                        <p>{item.day}, {classDate(item)} · {item.time} · {item.duration} min</p>
                        <span>PKR {item.price.toLocaleString()} per place · {item.seatsLeft} available</span>
                        {conflict && (
                          <p className="field-error" id={`conflict-${item.id}`} role="alert">
                            {conflict.message}
                          </p>
                        )}
                      </div>
                      <div className="quantity-control">
                        <label htmlFor={`quantity-${item.id}`}>Places</label>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          max={Math.min(MAX_TICKETS_PER_CLASS, item.seatsLeft || MAX_TICKETS_PER_CLASS)}
                          value={item.quantity}
                          onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                          aria-describedby={conflict ? `conflict-${item.id}` : undefined}
                        />
                        <button className="remove-button" type="button" onClick={() => removeFromSelection(item.id)}>
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <Link className="inline-link" to="/classes">+ Add another class</Link>
            </section>

            <section className="panel" aria-labelledby="attendee-heading">
              <div className="panel-heading">
                <div>
                  <span className="step-label">Step 2</span>
                  <h2 id="attendee-heading">Attendee details</h2>
                </div>
                <span className="required-note">All fields required</span>
              </div>

              <div className="form-grid">
                <div className="field full-field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  {errors.fullName && <span className="field-error" id="fullName-error">{errors.fullName}</span>}
                </div>

                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="phone">Mobile number</label>
                  <input
                    id="phone"
                    name="phone"
                    inputMode="numeric"
                    placeholder="03XXXXXXXXX"
                    value={form.phone}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}
                </div>

                <div className="field">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min={MINIMUM_AGE}
                    max="80"
                    value={form.age}
                    onChange={handleFieldChange}
                    aria-invalid={Boolean(errors.age)}
                    aria-describedby={errors.age ? "age-error" : "age-help"}
                  />
                  <span className="field-help" id="age-help">Minimum age: {MINIMUM_AGE}</span>
                  {errors.age && <span className="field-error" id="age-error">{errors.age}</span>}
                </div>

                <div className="field">
                  <label htmlFor="fitnessLevel">Current fitness level</label>
                  <select id="fitnessLevel" name="fitnessLevel" value={form.fitnessLevel} onChange={handleFieldChange}>
                    <option>Beginner</option>
                    <option>Regular exerciser</option>
                    <option>Experienced</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <aside className="summary-panel" aria-labelledby="summary-heading">
            <span className="step-label">Step 3</span>
            <h2 id="summary-heading">Booking summary</h2>
            <dl className="summary-list">
              <div><dt>Classes</dt><dd>{selectedRows.length}</dd></div>
              <div><dt>Total places</dt><dd>{totalPlaces}</dd></div>
              <div><dt>Subtotal</dt><dd>PKR {subtotal.toLocaleString()}</dd></div>
              <div className="summary-total"><dt>Total</dt><dd>PKR {subtotal.toLocaleString()}</dd></div>
            </dl>

            <div className={`minimum-box ${totalResult.valid ? "met" : "not-met"}`}>
              <strong>{totalResult.valid ? "✓ Minimum reached" : "Online minimum not reached"}</strong>
              <span>{totalResult.valid ? `PKR ${MINIMUM_BOOKING_TOTAL.toLocaleString()} requirement satisfied.` : totalResult.message}</span>
            </div>

            {selectionConflicts.length > 0 && (
              <StatusMessage type="error">Availability changed. Correct the highlighted quantity before confirming.</StatusMessage>
            )}

            <button className="button primary large full-button" type="submit" aria-disabled={!canSubmit}>
              Confirm simulated booking
            </button>
            <p className="secure-note">No payment is taken. This is a frontend student-project simulation.</p>
          </aside>
        </form>
      </div>
    </section>
  );
}
