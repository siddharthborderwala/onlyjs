import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { Play, X } from '@phosphor-icons/react'
// import { format } from 'prettier/standalone'
// import prettierBabelPlugin from 'prettier/plugins/babel'
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import prettierEstreePlugin from 'prettier/plugins/estree'
// format(code, {
//   parser: 'babel',
//   plugins: [prettierBabelPlugin, prettierEstreePlugin]
// }).then((formatted) => {
//   setCode(formatted)
// })

import { useThemeValue } from '../atoms/settings'
import { useCode } from '../atoms/code'
import { ConsoleEntryType, useWriteToConsole } from '../atoms/console'
import { useCallback } from 'react'
import { ConsoleView } from './console-view'

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
          clear: clearConsole,
          assert: (condition, ...args) => {
            if (!condition) {
              writeToConsole('error', ...args)
            }
          }
        }
        try {
          ${code}
        } catch (e) {
          if (e instanceof Error) {
            writeToConsole('error', e.stack)
          }
        }
      `)
      } catch (e) {
        if (e instanceof Error) {
          writeToConsole(ConsoleEntryType.error, `${e.stack}`)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [writeToConsole]
  )

  return (
    <div className="flex w-full h-full">
      <CodeMirror
        height="calc(100vh - 64px)"
        className="flex-[3] overflow-x-auto border border-gray-300 dark:border-gray-700"
        extensions={[javascript({ jsx: true })]}
        theme={theme === 'dark' ? githubDark : githubLight}
        value={code}
        onChange={setCode}
      />
      <div className="flex-[2] flex-shrink-0 h-full">
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
