import {
  ConsoleEntry,
  ConsoleEntryType,
  useReadConsole
} from '../atoms/console'
import { memo, useEffect, useRef } from 'react'

const getLogClasses = (type: ConsoleEntryType) => {
  switch (type) {
    case 'log':
      return 'text-gray-700 dark:text-gray-300'
    case 'error':
      return 'text-red-500 dark:text-red-400 bg-red-400/10'
    case 'warn':
      return 'text-yellow-500 dark:text-yellow-400 bg-yellow-400/10'
    default:
      return 'text-gray-700 dark:text-gray-300'
  }
}

const renderValue = (value: any, i: number, entryType: ConsoleEntryType) => {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return (
        <span key={i}>
          <span className="text-gray-400 dark:text-gray-500">[</span>
          {value.map((v, i) => (
            <span key={i}>
              {renderValue(v, i, entryType)}
              {i !== value.length - 1 && (
                <em className="text-gray-400 dark:text-gray-500">, </em>
              )}
            </span>
          ))}
          <span className="text-gray-400 dark:text-gray-500">]</span>
        </span>
      )
    }
    return (
      <span key={i}>
        <span className="text-gray-400 dark:text-gray-500 mr-1">{'{'}</span>
        {Object.entries(value).map(([key, value], i, self) => (
          <span key={i}>
            <em>{key}:</em> {renderValue(value, i, entryType)}
            {i !== self.length - 1 && (
              <em className="text-gray-400 dark:text-gray-500">, </em>
            )}
          </span>
        ))}
        <span className="text-gray-400 dark:text-gray-500 ml-1">{'}'}</span>
      </span>
    )
  }
  if (typeof value === 'string') {
    return (
      <span
        key={i}
        className={entryType === ConsoleEntryType.log ? 'text-green-500' : ''}
      >
        {entryType === ConsoleEntryType.log ? `'${value}'` : value}
      </span>
    )
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return (
      <span
        key={i}
        className={entryType === ConsoleEntryType.log ? 'text-indigo-500' : ''}
      >
        {value.toString()}
      </span>
    )
  }
  if (typeof value === 'bigint') {
    return (
      <span
        key={i}
        className={entryType === ConsoleEntryType.log ? 'text-amber-500' : ''}
      >
        {value.toString()}n
      </span>
    )
  }
  if (typeof value === 'symbol') {
    return (
      <span
        key={i}
        className={
          entryType === ConsoleEntryType.log
            ? 'text-teal-500 dark:text-teal-400'
            : ''
        }
      >
        {value.toString()}
      </span>
    )
  }
  if (typeof value === 'function') {
    return (
      <span key={i}>
        <em className="text-gray-400 dark:text-gray-500">f </em>
        {value.toString()}
      </span>
    )
  }
  if (value === undefined) {
    return <strong key={i}>undefined</strong>
  }
  if (value === null) {
    return <strong key={i}>null</strong>
  }
}

const ConsoleEntryView = ({ log }: { log: ConsoleEntry }) => {
  if (log.values.length === 0) {
    return null
  }

  return (
    <div
      className={`px-2 py-1 space-x-2 border-b border-b-gray-300 dark:border-b-gray-700 font-mono text-xs ${getLogClasses(
        log.type
      )}`}
    >
      {log.values.map((l, i) => renderValue(l, i, log.type))}
    </div>
  )
}

const MemoizedConsoleEntry = memo(ConsoleEntryView)

export const ConsoleView = () => {
  const consoleEntries = useReadConsole()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [consoleEntries])

  return (
    <div
      className="overflow-y-auto bg-gray-50 dark:bg-[#202124] pb-16"
      style={{ height: 'calc(100% - 3rem)' }}
    >
      {consoleEntries.map((log, i) => (
        <MemoizedConsoleEntry key={`${i}_${log.timestamp}`} log={log} />
      ))}
      <div ref={ref} />
    </div>
  )
}
