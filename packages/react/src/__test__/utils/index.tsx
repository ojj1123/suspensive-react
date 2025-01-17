import { PropsWithChildren, ReactNode, useEffect, useState } from 'react'

const suspendIsNeed = { current: true }
type SuspendProps = { during: number; toShow?: ReactNode }
export const Suspend = ({ during, toShow }: SuspendProps) => {
  if (suspendIsNeed.current) {
    throw new Promise((resolve) =>
      setTimeout(() => {
        suspendIsNeed.current = false
        resolve('resolved')
      }, during)
    )
  }
  return <>{toShow}</>
}
Suspend.reset = () => {
  suspendIsNeed.current = true
}

const throwErrorIsNeed = { current: false }
type ThrowErrorProps = PropsWithChildren<{ message: string; after: number }>
export const ThrowError = ({ message, after, children }: ThrowErrorProps) => {
  const [isNeedError, setIsNeedError] = useState(throwErrorIsNeed.current)
  if (isNeedError) {
    throw new Error(message)
  }
  useEffect(() => {
    setTimeout(() => setIsNeedError(true), after)
  }, [after])
  return <>{children}</>
}
ThrowError.reset = () => {
  throwErrorIsNeed.current = false
}

export const TEXT = 'TEXT'
export const ERROR_MESSAGE = 'ERROR_MESSAGE'
export const FALLBACK = 'FALLBACK'
export const MS_100 = 100
