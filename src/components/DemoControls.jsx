import { useFitFlow } from "../context/FitFlowContext";

export default function DemoControls() {
  const {
    availabilityReduced,
    simulateLoadingFailure,
    simulateAvailabilityChange,
    restoreSchedule,
  } = useFitFlow();

  return (
    <details className="demo-panel">
      <summary>Assignment demonstration controls</summary>
      <p>
        Use these controls to reproduce the required loading-failure and changed-availability edge cases.
      </p>
      <div className="demo-actions">
        <button className="button secondary" type="button" onClick={simulateLoadingFailure}>
          Simulate loading failure
        </button>
        <button
          className="button secondary"
          type="button"
          onClick={simulateAvailabilityChange}
          disabled={availabilityReduced}
        >
          Reduce availability
        </button>
        <button className="button text-button" type="button" onClick={restoreSchedule}>
          Restore normal schedule
        </button>
      </div>
    </details>
  );
}
