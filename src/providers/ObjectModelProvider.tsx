import { createContext, useContext, useState } from "react";

export type ObjectModelType = "hunyuan" | "sam";

interface ModelContextValue {
  model: ObjectModelType;
  setModel: (model: ObjectModelType) => void;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export function ObjectModelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [model, setModel] = useState<ObjectModelType>("sam");

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useObjectModel() {
  const ctx = useContext(ModelContext);
  if (!ctx) {
    throw new Error("useObjectModel must be used inside <ObjectModelProvider>");
  }
  return ctx;
}
