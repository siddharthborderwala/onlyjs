import {
  ConsoleEntry,
  ConsoleEntryType,
  useReadConsole
} from '../atoms/console'
import { memo, useEffect, useRef, useState } from 'react'

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

type PromiseStateType<T> =
  | {
      state: 'pending'
      result: undefined
      error: undefined
    }
  | {
      state: 'resolved'
      result: T
      error: undefined
    }
  | {
      state: 'rejected'
      result: undefined
      error: Error
    }

const RenderPromise = <T,>({ promise }: { promise: Promise<T> }) => {
  const [promiseState, setPromiseState] = useState<PromiseStateType<T>>({
    state: 'pending',
    result: undefined,
    error: undefined
  })

  useEffect(() => {
    promise
      .then((result) => {
        setPromiseState({
          state: 'resolved',
          result,
          error: undefined
        })
      })
      .catch((error: Error) => {
        setPromiseState({
          state: 'rejected',
          result: undefined,
          error
        })
      })
  }, [promise])

  return (
    <div>
      <span className="text-gray-400 dark:text-gray-500 mr-2">Promise</span>
      <span className="text-gray-400 dark:text-gray-500 mr-1">{'{'}</span>
      <br />
      <div className="ml-4">
        <span>
          <em className="text-gray-400 dark:text-gray-500 mr-1">state:</em>
          {promiseState.state},
        </span>
        <br />
        {promiseState.state === 'resolved' ? (
          <span>
            <em className="text-gray-400 dark:text-gray-500 mr-1">result:</em>
            {renderValue(promiseState.result, 0, ConsoleEntryType.log)}
          </span>
        ) : null}
        {promiseState.state === 'rejected' ? (
          <span>
            <em className="text-gray-400 dark:text-gray-500 mr-1">error:</em>
            {renderValue(promiseState.error, 0, ConsoleEntryType.error)}
          </span>
        ) : null}
      </div>
      <span className="text-gray-400 dark:text-gray-500 mr-1">{'}'}</span>
    </div>
  )
}

const renderArray = (
  value: Array<any>,
  i: number,
  entryType: ConsoleEntryType
) => {
  return (
    <span key={i}>
      <span className="text-gray-400 dark:text-gray-500">[</span>
      {value.map((v, i) => (
        <span key={i}>
          {renderValue(v, i, entryType)}
          {i !== value.length - 1 && (
            <em className="text-gray-400 dark:text-gray-500 mr-1">,</em>
          )}
        </span>
      ))}
      <span className="text-gray-400 dark:text-gray-500">]</span>
    </span>
  )
}

const renderValue = (
  value: any,
  i: number,
  entryType: ConsoleEntryType
): JSX.Element => {
  if (typeof value === 'object' && value !== null) {
    const objName = value.constructor.name
    if (objName === 'Array') {
      return renderArray(value, i, entryType)
    }
    if (objName === 'Promise') {
      return <RenderPromise promise={value} />
    }
    if (objName === 'Date') {
      return (
        <span>
          <em className="text-gray-400 dark:text-gray-500 mr-2">{objName}</em>
          <span>{value.toISOString()}</span>
        </span>
      )
    }
    if (objName.includes('Error')) {
      return (
        <span className="text-red-500 dark:text-red-400">
          {renderValue(value.toString(), i, ConsoleEntryType.error)}
        </span>
      )
    }
    const entries = Object.entries(value)
    return (
      <span key={i}>
        {objName === 'Object' ? null : (
          <em className="text-gray-400 dark:text-gray-500 mr-2">{objName}</em>
        )}
        <span className="text-gray-400 dark:text-gray-500 mr-1">{'{'}</span>
        {entries.length > 1 ? (
          <>
            <br />
            <div className="ml-4">
              {entries.map(([key, value], i, self) => (
                <span key={i}>
                  <em>{key}:</em> {renderValue(value, i, entryType)}
                  {i !== self.length - 1 && (
                    <em className="text-gray-400 dark:text-gray-500">,</em>
                  )}
                  <br />
                </span>
              ))}
            </div>
          </>
        ) : null}
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
        <em className="text-gray-400 dark:text-gray-500 mr-1">f</em>
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
  return <strong key={i}>unknown</strong>
}

const ConsoleEntryView = ({ log }: { log: ConsoleEntry }) => {
  if (log.values.length === 0) {
    return null
  }

  return (
    <div
      className={`px-2 py-1 space-x-2 border-b border-b-gray-300 dark:border-b-gray-700 font-mono text-xs ${getLogClasses(
        log.type
      )} break-words`}
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
