"use client";
import * as React from 'react';

import { store } from ".";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
