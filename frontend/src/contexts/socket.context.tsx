'use client'

import { createContext, useContext, type ReactNode } from 'react'

// NoiThat2026: no Socket.io — stub context
const SocketContext = createContext<null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  return <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
