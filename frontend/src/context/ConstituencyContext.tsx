"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { getConstituency, CONSTITUENCIES, type ConstituencyInfo } from "@/data/constituencies"
import type { ConstituencyDataSet } from "@/data/mock-constituency-data"
import { getConstituencyData } from "@/data/mock-constituency-data"

interface ConstituencyContextValue {
  selectedConstituency: ConstituencyInfo
  data: ConstituencyDataSet
  setConstituency: (name: string) => void
  constituencyList: ConstituencyInfo[]
}

const ConstituencyContext = createContext<ConstituencyContextValue | null>(null)

export function ConstituencyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ConstituencyInfo>(
    getConstituency("North Chennai") || CONSTITUENCIES["North Chennai"],
  )

  const setConstituency = useCallback((name: string) => {
    const info = getConstituency(name) || getConstituency("North Chennai")!
    setSelected(info)
  }, [])

  const data = getConstituencyData(selected.name)
  const constituencyList = Object.values(CONSTITUENCIES)

  return (
    <ConstituencyContext.Provider value={{ selectedConstituency: selected, data, setConstituency, constituencyList }}>
      {children}
    </ConstituencyContext.Provider>
  )
}

export function useConstituency() {
  const ctx = useContext(ConstituencyContext)
  if (!ctx) throw new Error("useConstituency must be used within ConstituencyProvider")
  return ctx
}
