"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// ThemeProviderProps removed to fix build error

export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
