'use client'

import { useEffect, useMemo } from 'react'
import { useRerender } from './hooks'

type Tuple<T = unknown> = T[] | readonly T[]
type Cache<Key extends Tuple = Tuple> = {
  promise?: Promise<unknown>
  key: Key
  error?: unknown
  data?: unknown
  onNotifies: ((...args: unknown[]) => unknown)[]
}
type CacheAction = { reset: () => void }
type SuspenseCache<TData extends unknown = unknown> = CacheAction & { data: TData }

class Observer {
  public cache = new Map<Tuple, Cache>()

  public reset = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.clear()
      return
    }

    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
  }

  public errorClear = <TKey extends Tuple>(key?: TKey) => {
    if (key === undefined || key.length === 0) {
      this.cache.forEach((value, key, map) => {
        map.set(key, { ...value, promise: undefined, error: undefined })
      })
      return
    }

    const entry = this.cache.get(key)
    if (entry) {
      this.cache.set(key, { ...entry, promise: undefined, error: undefined })
    }
  }

  public suspendWithCache = <TKey extends Tuple, TData extends unknown>(key: TKey, fn: () => Promise<TData>): TData => {
    const entry = this.cache.get(key)

    if (entry?.error) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw entry.error
    }
    if (entry?.data) {
      return entry.data as TData
    }

    if (entry?.promise) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw entry.promise
    }

    const newEntry: Cache<TKey> = {
      key,
      promise: fn()
        .then((data) => {
          newEntry.data = data
        })
        .catch((error) => {
          newEntry.error = error
        }),
      onNotifies: [],
    }

    this.cache.set(key, newEntry)
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw newEntry.promise
  }

  public getData = <TKey extends Tuple>(key: TKey) => this.cache.get(key)?.data

  public keyNotifiesMap = new Map<Tuple, ((...args: unknown[]) => unknown)[]>()

  public attach<TKey extends Tuple>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const keyNotifies = this.keyNotifiesMap.get(key)
    this.keyNotifiesMap.set(key, [...(keyNotifies ?? []), onNotify])
  }

  public detach<TKey extends Tuple>(key: TKey, onNotify: (...args: unknown[]) => unknown) {
    const keyNotifies = this.keyNotifiesMap.get(key)

    if (keyNotifies) {
      this.keyNotifiesMap.set(
        key,
        keyNotifies.filter((notify) => notify !== onNotify)
      )
    }
  }

  public notifyToAttacher = <TKey extends Tuple>(key: TKey) =>
    this.keyNotifiesMap.get(key)?.forEach((notify) => notify())
}

export const observer = new Observer()

export const suspenseCache = <TKey extends Tuple, TData extends unknown, TArgs extends unknown[]>(
  key: TKey,
  fn: (...args: TArgs) => Promise<TData>
) =>
  ({
    useCache: (...args: TArgs): SuspenseCache<TData> => {
      const data = observer.suspendWithCache(key, () => fn(...args))

      const localRerender = useRerender()

      useEffect(() => {
        observer.attach(key, localRerender)
        return () => observer.detach(key, localRerender)
      }, [])

      return useMemo(
        () => ({
          data,
          reset: () => {
            observer.reset(key)
            observer.notifyToAttacher(key)
          },
        }),
        [data]
      )
    },
    errorClear: () => observer.errorClear(key),
    getData: () => observer.getData(key),
  } as const)
