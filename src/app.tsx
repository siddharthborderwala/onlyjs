import { useThemeSync, useThemeValue, useToggleTheme } from './atoms/settings'
import { Editor } from './components/editor'
import { ToggleSwitch } from './components/toggle-switch'

export const App = () => {
  const theme = useThemeValue()
  const toggleTheme = useToggleTheme()
  useThemeSync()

  return (
    <div className="w-screen h-screen">
      <div className="h-full">
        <div className="flex flex-col w-full h-full bg-gray-50 dark:bg-[#202124]">
          <div className="col-span-2 flex bg-gray-100 dark:bg-[#292A2D] justify-between items-center py-2 px-2 border-y border-gray-300 dark:border-gray-700">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-50 font-mono">
              onlyjs
            </p>
            <div>other elems</div>
          </div>
          <Editor />
        </div>
      </div>
    </div>
  )
}
