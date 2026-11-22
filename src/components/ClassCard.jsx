import { Link } from "react-router-dom";
import { classDate } from "../utils/schedule";

export default function ClassCard({ fitnessClass, onAdd }) {
  const isFull = fitnessClass.seatsLeft === 0;

  return (
    <article className={`class-card ${isFull ? "is-unavailable" : ""}`}>
      <div className="card-visual" aria-hidden="true">
        <span>{fitnessClass.icon || "◆"}</span>
        <small>{fitnessClass.category || "Fitness"}</small>
      </div>
      <div className="card-content">
        <div className="card-topline">
          <span className="level-pill">{fitnessClass.level}</span>
          <span className={isFull ? "availability full" : "availability"}>
            {isFull ? "Full" : `${fitnessClass.seatsLeft} places left`}
          </span>
        </div>
        <h2>{fitnessClass.name}</h2>
        <p>{fitnessClass.shortDescription || "More class information will be available soon."}</p>
        <dl className="quick-facts">
          <div>
            <dt>When</dt>
            <dd>
              {fitnessClass.day}, {classDate(fitnessClass)} at {fitnessClass.time}
            </dd>
          </div>
          <div>
            <dt>Coach</dt>
            <dd>{fitnessClass.coach || "Coach to be confirmed"}</dd>
          </div>
          <div>
            <dt>Price</dt>
            <dd>PKR {fitnessClass.price.toLocaleString()}</dd>
          </div>
        </dl>
        <div className="card-actions">
          <Link className="button secondary" to={`/classes/${fitnessClass.id}`}>
            View details
          </Link>
          <button
            className="button primary"
            type="button"
            disabled={isFull}
            onClick={() => onAdd(fitnessClass.id)}
          >
            {isFull ? "Unavailable" : "Add to plan"}
          </button>
        </div>
      </div>
    </article>
  );
}
