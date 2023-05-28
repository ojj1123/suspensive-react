'use client'

import { ComponentProps } from 'react'
import { ErrorBoundary, ErrorBoundaryGroup, Suspense, suspenseCache } from '@suspensive/react'
import { Area, Box, Button } from '../../components/uis'

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('finish')
    }, ms)
  })

const mock1 = suspenseCache(['mock1'] as const, async (maxMs: number) => {
  await delay(maxMs * Math.random())
  if (Math.random() > 0.5) {
    throw new Error('error in fetchMock')
  }

  return 'Success in mock1 in suspensive cache 🎉' as const
})

const mock3 = suspenseCache(['mock3'] as const, async (maxMs: number) => {
  await delay(maxMs * Math.random())
  if (Math.random() > 0.5) {
    throw new Error('error in fetchMock')
  }

  return 'Success in mock3 in suspensive cache 🎉' as const
})

const Mock1User1 = () => {
  const mock1Cache = mock1.useCache(3000)
  console.log('Mock1User1: rerender')

  return (
    <Box.Success>
      <Button onClick={mock1Cache.reset}>↻</Button>
      {mock1Cache.data}
    </Box.Success>
  )
}
const Mock1User2 = () => {
  const mock1Cache = mock1.useCache(1500)
  console.log('Mock1User2: rerender')

  return (
    <Box.Success>
      <Button onClick={mock1Cache.reset}>↻</Button>
      {mock1Cache.data}
    </Box.Success>
  )
}
const Mock3User = () => {
  const mock3Cache = mock3.useCache(1000)
  console.log('Mock3User: rerender')

  return (
    <Box.Success>
      <Button onClick={mock3Cache.reset}>↻</Button>
      {mock3Cache.data}
    </Box.Success>
  )
}

const BoundaryPage = () => (
  <Area title="ErrorBoundaryGroup">
    <button
      type="button"
      onClick={() => {
        console.log(mock1.getData())
      }}
    >
      getData
    </button>
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset trigger={(group) => <Button onClick={group.reset}>↻</Button>} />
      <Area title="suspenseCache: Mock1User1">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Mock1User1 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="suspenseCache: Mock1User2">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Mock1User2 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="suspenseCache: Mock3User">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Mock3User />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
    </ErrorBoundaryGroup>
  </Area>
)

const ErrorBoundaryFallback: ComponentProps<typeof ErrorBoundary>['fallback'] = (caught) => (
  <Box.Error>
    <ErrorBoundaryGroup.Reset trigger={(group) => <Button onClick={group.reset}>↻</Button>} />
    {caught.error.message}
  </Box.Error>
)

export default BoundaryPage
