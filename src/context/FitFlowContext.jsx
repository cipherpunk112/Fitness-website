import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadFitnessClasses } from "../services/classService";
import { validateTicketQuantity } from "../rules/bookingRules";

const STORAGE_KEY = "fitflow-selection";
const FitFlowContext = createContext(null);

function readSavedSelection() {
  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = savedValue ? JSON.parse(savedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function FitFlowProvider({ children }) {
  const [classes, setClasses] = useState([]);
  const [selection, setSelection] = useState(readSavedSelection);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availabilityReduced, setAvailabilityReduced] = useState(false);
  const [notice, setNotice] = useState("");
  const [lastConfirmation, setLastConfirmation] = useState(null);

  const loadSchedule = useCallback(async (options = {}) => {
    setLoading(true);
    setError("");

    try {
      const loadedClasses = await loadFitnessClasses(options);
      setClasses(loadedClasses);
      setAvailabilityReduced(Boolean(options.reduceAvailability));
    } catch (loadError) {
      setClasses([]);
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
  }, [selection]);

  useEffect(() => {
    if (loading || error || classes.length === 0) return;

    const validIds = new Set(classes.map((fitnessClass) => fitnessClass.id));
    const missingItems = selection.filter((item) => !validIds.has(item.id));

    if (missingItems.length > 0) {
      setSelection((current) =>
        current.filter((item) => validIds.has(item.id)),
      );
      setNotice(
        "A saved class no longer exists and was removed from your plan.",
      );
    }
  }, [classes, error, loading, selection]);

  const selectedRows = useMemo(
    () =>
      selection
        .map((item) => {
          const fitnessClass = classes.find(
            (classItem) => classItem.id === item.id,
          );
          return fitnessClass ? { ...fitnessClass, quantity: item.quantity } : null;
        })
        .filter(Boolean),
    [classes, selection],
  );

  const selectionConflicts = useMemo(
    () =>
      selectedRows
        .map((item) => {
          const result = validateTicketQuantity(item.quantity, item.seatsLeft);
          return result.valid
            ? null
            : { id: item.id, message: result.message };
        })
        .filter(Boolean),
    [selectedRows],
  );

  const totalPlaces = selectedRows.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const subtotal = selectedRows.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function addToSelection(id) {
    const fitnessClass = classes.find((item) => item.id === id);
    if (!fitnessClass || fitnessClass.seatsLeft === 0) {
      setNotice("This class is not currently available.");
      return;
    }

    setSelection((current) => {
      const existing = current.find((item) => item.id === id);
      const nextQuantity = existing ? existing.quantity + 1 : 1;
      const validation = validateTicketQuantity(
        nextQuantity,
        fitnessClass.seatsLeft,
      );

      if (!validation.valid) {
        setNotice(validation.message);
        return current;
      }

      setNotice(`${fitnessClass.name} was added to your weekly plan.`);

      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: nextQuantity } : item,
        );
      }

      return [...current, { id, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    setSelection((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  }

  function removeFromSelection(id) {
    setSelection((current) => current.filter((item) => item.id !== id));
    setNotice("The class was removed from your weekly plan.");
  }

  function clearSelection() {
    setSelection([]);
  }

  async function simulateLoadingFailure() {
    setNotice("Demo: a schedule-loading failure is being simulated.");
    await loadSchedule({ shouldFail: true });
  }

  async function simulateAvailabilityChange() {
    setNotice(
      "Demo: availability changed. Review any conflict in your weekly plan.",
    );
    await loadSchedule({ reduceAvailability: true });
  }

  async function restoreSchedule() {
    setNotice("The normal class schedule has been restored.");
    await loadSchedule();
  }

  function completeBooking(customer) {
    const confirmation = {
      reference: `FF-${Date.now().toString().slice(-6)}`,
      customer,
      items: selectedRows,
      totalPlaces,
      subtotal,
    };

    setLastConfirmation(confirmation);
    clearSelection();
    return confirmation;
  }

  const value = {
    classes,
    selection,
    selectedRows,
    selectionConflicts,
    loading,
    error,
    notice,
    availabilityReduced,
    totalPlaces,
    subtotal,
    lastConfirmation,
    addToSelection,
    updateQuantity,
    removeFromSelection,
    clearSelection,
    loadSchedule,
    simulateLoadingFailure,
    simulateAvailabilityChange,
    restoreSchedule,
    completeBooking,
    setNotice,
  };

  return (
    <FitFlowContext.Provider value={value}>
      {children}
    </FitFlowContext.Provider>
  );
}

export function useFitFlow() {
  const context = useContext(FitFlowContext);

  if (!context) {
    throw new Error("useFitFlow must be used inside FitFlowProvider");
  }

  return context;
}
