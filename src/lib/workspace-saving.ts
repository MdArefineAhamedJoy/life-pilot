"use client";
import { createContext, useContext } from "react";
export const WorkspaceSavingContext = createContext(false);
export const useWorkspaceSaving = () => useContext(WorkspaceSavingContext);
