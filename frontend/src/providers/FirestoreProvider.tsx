import { createContext, useContext } from "react";
import { db } from "./firebase";
import type { Firestore } from "firebase/firestore";

const FirestoreContext = createContext<Firestore | null>(null);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirestoreContext.Provider value={db}>{children}</FirestoreContext.Provider>
  );
}

export function useFirestore() {
  const ctx = useContext(FirestoreContext);
  if (!ctx) {
    throw new Error("useFirestore must be used inside <FirestoreProvider>");
  }
  return ctx;
}
