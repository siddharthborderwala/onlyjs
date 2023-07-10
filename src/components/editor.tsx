import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import Split from '@uiw/react-split'
import classNames from 'classnames'
import { useThemeValue } from '../atoms/settings'
import { useCode } from '../atoms/code'
import { ConsoleEntryType, useWriteToConsole } from '../atoms/console'
import { useCallback } from 'react'
import { ConsoleView } from './console-view'
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
    <Split
      className="border-b border-b-gray-300 dark:border-gray-700 h-full"
      mode="horizontal"
      renderBar={({ onMouseDown, className, ...props }) => {
        return (
          <div
            {...props}
            className={classNames(
              className,
              '!bg-transparent !shadow-none !w-[6px]'
            )}
          >
            <div
              onMouseDown={onMouseDown}
              className=" bg-gray-200/20 w-full dark:bg-gray-700/20 backdrop-blur-3xl !shadow-none group/dragger"
            >
              <div className="w-[1px] translate-x-[2px] h-full transition-colors dark:bg-blue-200/20 group-hover/dragger:dark:bg-blue-700/30" />
            </div>
          </div>
        )
      }}
    >
      <CodeMirror
        id="editor-container"
        height="100%"
        className="w-3/5 overflow-x-auto overflow-y-auto"
        extensions={[javascript({ jsx: true })]}
        theme={theme === 'dark' ? githubDark : githubLight}
        value={code}
        onChange={setCode}
      />
      <div className="w-2/5" id="console-container">
        <div className="py-1 px-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#292A2D] flex items-center justify-between">
          <p className="font-mono text-xs text-gray-700 dark:text-gray-50">
            main.js
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
    </Split>
  )
}
