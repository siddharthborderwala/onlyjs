import React, { useId } from 'react'

type ToggleSwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label: _label
}) => {
  const id = useId()

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={() => {
          onChange(!checked)
        }}
        className="relative rounded-full bg-gray-500 dark:bg-gray-700 w-11 h-6"
      >
        <div
          className={`after:top-[2px] after:absolute after:inline-block after:transition-transform after:h-5 after:w-5 after:bg-gray-50 after:rounded-full ${
            checked
              ? 'after:bg-blue-500 after:translate-x-[22px]'
              : 'after:translate-x-[2px]'
          }`}
        />
      </div>
      <label htmlFor={id} className="text-gray-900 dark:text-gray-300">
        {_label}
      </label>
    </div>
  )
}
