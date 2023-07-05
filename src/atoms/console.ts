import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'

export enum ConsoleEntryType {
  log = 'log',
  error = 'error',
  warn = 'warn'
}

export type ConsoleEntry = {
  type: ConsoleEntryType
  values: any[]
  timestamp: number
}

const consoleAtom = atom<Array<ConsoleEntry>>([])

export const useReadConsole = () => {
  return useAtomValue(consoleAtom)
}

export const useWriteToConsole = () => {
  const setConsole = useSetAtom(consoleAtom)

  const writeToConsole = useCallback(
    (type: ConsoleEntryType, ...values: any[]) => {
      setConsole((prev) => [...prev, { type, values, timestamp: Date.now() }])
    },
    [setConsole]
  )

  const clearConsole = useCallback(() => {
    setConsole([])
  }, [setConsole])

  return [writeToConsole, clearConsole] as const
}
