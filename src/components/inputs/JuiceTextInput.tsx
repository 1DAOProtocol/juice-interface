import { Input, InputProps } from 'antd'
import { classNames } from 'utils/classNames'

export const JuiceInput = (props: InputProps) => {
  return (
    <Input
      {...props}
      className={classNames(
        'rounded-lg border-smoke-300 bg-smoke-50 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-300',
        props.className,
      )}
    />
  )
}
