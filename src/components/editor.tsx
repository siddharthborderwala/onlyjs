import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { Play, X } from '@phosphor-icons/react'
import { useThemeValue } from '../atoms/settings'
import { useCode } from '../atoms/code'
import {
  ConsoleEntry,
  ConsoleEntryType,
  useReadConsole,
  useWriteToConsole
} from '../atoms/console'
import { memo, useCallback, useEffect, useRef } from 'react'

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

const ConsoleEntryView = ({ log }: { log: ConsoleEntry }) => {
  return (
    <div
      className={`px-2 py-1 border-b border-b-gray-300 dark:border-b-gray-700 font-mono text-xs ${getLogClasses(
        log.type
      )}`}
    >
      {log.values.map((value, i) => {
        if (typeof value === 'object' && value !== null) {
          return (
            <pre key={`${i}_${log.timestamp}`}>
              {JSON.stringify(value, null, 2)}
            </pre>
          )
        }
        if (typeof value === 'string') {
          return (
            <span key={`${i}_${log.timestamp}`} className="text-green-600">
              {value}
            </span>
          )
        }
        if (typeof value === 'number' || typeof value === 'boolean') {
          return (
            <span key={`${i}_${log.timestamp}`} className="text-indigo-500">
              {value.toString()}
            </span>
          )
        }
        if (typeof value === 'bigint') {
          return (
            <span key={`${i}_${log.timestamp}`} className="text-amber-500">
              {value.toString()}n
            </span>
          )
        }
        if (typeof value === 'symbol') {
          return (
            <span
              key={`${i}_${log.timestamp}`}
              className="text-teal-500 dark:text-teal-400"
            >
              {value.toString()}
            </span>
          )
        }
        if (typeof value === 'function') {
          return (
            <span key={`${i}_${log.timestamp}`}>
              <em className="text-gray-400 dark:text-gray-500">f </em>
              {value.toString()}
            </span>
          )
        }
        if (value === undefined) {
          return <strong key={`${i}_${log.timestamp}`}>undefined</strong>
        }
        if (value === null) {
          return <strong key={`${i}_${log.timestamp}`}>null</strong>
        }
      })}
    </div>
  )
}

const MemoizedConsoleEntry = memo(ConsoleEntryView)

const ConsoleView = () => {
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

export const Editor = () => {
  const theme = useThemeValue()
  const [code, setCode] = useCode('main')
  // do not remove as it is used in eval
  const [writeToConsole, clearConsole] = useWriteToConsole()

  const handleExec = useCallback(
    (code: string) => {
      try {
        eval(`
        const console = {
          log: (...args) => {
            writeToConsole('log', ...args)
          },
          error: (...args) => {
            writeToConsole('error', ...args)
          },
          warn: (...args) => {
            writeToConsole('warn', ...args)
          },
        }
        ${code}
      `)
      } catch (e) {
        console.error(e)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [writeToConsole]
  )

  return (
    <div className="flex w-full h-full">
      <CodeMirror
        height="calc(100vh - 64px)"
        className="flex-[3] border border-gray-300 dark:border-gray-700"
        extensions={[javascript({ jsx: true })]}
        theme={theme === 'dark' ? githubDark : githubLight}
        value={code}
        onChange={setCode}
      />
      <div className="flex-[2] h-full">
        <div className="bg-gray-50 dark:bg-[#202124] h-full">
          <div className="flex dark:bg-[#292A2D] justify-between items-center py-2 px-2 border-y border-gray-300 dark:border-gray-700">
            <p className="text-sm text-gray-900 dark:text-gray-50 font-mono">
              Console
            </p>
            <div>
              <button
                className="py-1 px-2 border border-gray-200 dark:border-gray-700 rounded-bl-lg rounded-tl-lg outline-none hover:bg-gray-200 hover:dark:bg-gray-700 focus-visible:ring-1 text-gray-700 dark:text-gray-300"
                onClick={clearConsole}
              >
                <X size={16} weight="bold" />
              </button>
              <button
                className="-ml-[1px] py-1 px-2 border border-gray-200 dark:border-gray-700 rounded-br-lg rounded-tr-lg outline-none hover:bg-gray-200 hover:dark:bg-gray-700 focus-visible:ring-1 text-gray-700 dark:text-gray-300"
                onClick={() => handleExec(code)}
              >
                <Play size={16} weight="bold" />
              </button>
            </div>
          </div>
          <ConsoleView />
        </div>
      </div>
    </div>
  )
}
