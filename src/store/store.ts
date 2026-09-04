import { configureStore } from "@reduxjs/toolkit";
import lifeOsReducer from "@/store/life-os-slice";

export const makeStore = () => configureStore({ reducer: { lifeOs: lifeOsReducer } });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
