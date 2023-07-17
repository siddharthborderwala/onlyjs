import MonacoEditor, { useMonaco } from '@monaco-editor/react'
import Split from '@uiw/react-split'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { Play, X } from '@phosphor-icons/react'
import { useEditorThemeValue, useThemeValue } from '../atoms/settings'
import { useCode } from '../atoms/code'
import { ConsoleEntryType, useWriteToConsole } from '../atoms/console'
import { ConsoleView } from './console-view'
import { Loader } from './loader'
import { generateThemeConfig, getThemeType } from '../themes'

export const Editor = () => {
  const theme = useThemeValue()
  const [code, setCode] = useCode('main')
  const editorTheme = useEditorThemeValue()
  // do not remove as it is used in eval
  const [writeToConsole, clearConsole] = useWriteToConsole()
  const [splitMode, setSplitMode] = useState<'horizontal' | 'vertical'>(() => {
    return matchMedia?.('(max-width: 640px)').matches
      ? 'vertical'
      : 'horizontal' ?? 'horizontal'
  })

  const handleExec = useCallback(
    (code: string) => {
      try {
        const fn = new Function(
          'writeToConsole',
          'clearConsole',
          `
          // security reset
          const blockedProperties = ['referrer', 'cookie', 'domain', 'location', 'opener']
          const document = new Proxy(window.document, {
            get: (obj, prop) => {
              if (blockedProperties.includes(prop)) {
                return 'cannot access ' + obj.constructor.name + '.' + prop + ' for security reasons'
              }
              return obj[prop]
            }
          })

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
              writeToConsole('error', e.toString())
            }
          }
        `
        )
        fn(writeToConsole, clearConsole)
      } catch (e) {
        if (e instanceof Error) {
          writeToConsole(ConsoleEntryType.error, e.toString())
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [writeToConsole]
  )

  const monaco = useMonaco()

  useEffect(() => {
    if (!monaco || editorTheme === 'vs-dark' || editorTheme === 'light') {
      return
    }
    import(`../themes/${editorTheme}.json`).then(({ default: theme }) => {
      monaco.editor.defineTheme(
        editorTheme,
        generateThemeConfig(theme, getThemeType(editorTheme))
      )
      monaco.editor.setTheme(editorTheme)
    })
  }, [monaco, editorTheme])

  useEffect(() => {
    // listen to window resize and change split mode using matchMedia
    const mediaQuery = matchMedia('(max-width: 640px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSplitMode(e.matches ? 'vertical' : 'horizontal')
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <Split
      className="border-b border-b-gray-300 dark:border-gray-700 h-full"
      mode={splitMode}
      renderBar={({ onMouseDown, className, ...props }) => {
        return (
          <div
            {...props}
            className={classNames(className, '!bg-transparent !shadow-none', {
              '!w-[6px]': splitMode === 'horizontal',
              '!h-[6px]': splitMode === 'vertical'
            })}
          >
            <div
              onMouseDown={onMouseDown}
              className={classNames(
                'bg-gray-200/20 dark:bg-gray-700/20 backdrop-blur-3xl !shadow-none group/dragger',
                {
                  '!w-[6px]': splitMode === 'horizontal',
                  '!h-[6px]': splitMode === 'vertical'
                }
              )}
            >
              <div
                onMouseDown={onMouseDown}
                className={classNames(
                  'transition-colors bg-gray-300 group-hover/dragger:bg-blue-500/30 dark:bg-gray-700 group-hover/dragger:dark:bg-blue-700/30',
                  {
                    'w-[1px] translate-x-[2.5px] h-full':
                      splitMode === 'horizontal',
                    'h-[1px] translate-y-[2.5px] w-full':
                      splitMode === 'vertical'
                  }
                )}
              />
            </div>
          </div>
        )
      }}
    >
      <div className="w-full h-2/3 sm:h-full sm:w-3/5 ">
        <MonacoEditor
          loading={
            <div className="flex flex-col gap-2 items-center justify-center">
              <Loader theme={theme} />
              <p className="text-gray-700 dark:text-gray-300">Loading Editor</p>
            </div>
          }
          height="100%"
          language="javascript"
          className="overflow-x-auto overflow-y-auto font-mono"
          theme={editorTheme}
          options={{
            fontSize: 14,
            fontFamily: 'monospace',
            fontLigatures: true,
            minimap: {
              enabled: false
            }
          }}
          value={code}
          onChange={(value) => {
            setCode(value ?? '')
          }}
        />
      </div>
      <div
        className="w-full h-1/3 sm:h-full sm:w-2/5 overflow-x-auto"
        id="console-container"
      >
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
