'use client'

import { ComponentProps } from 'react'
import { ErrorBoundary, ErrorBoundaryGroup, Suspense, suspenseCache } from '@suspensive/react'
import { api } from '../../api'
import { Area, Box, Button } from '../../components/uis'

const manual1 = suspenseCache(['manual1'] as const, api.manual)
const manual3 = suspenseCache(['manual3'] as const, api.manual)

const Manual1User1 = () => {
  const manual1Cache = manual1.useCache({ successPercentage: 50, waitMs: 500 })

  return (
    <Box.Success>
      <Button onClick={manual1Cache.reset}>↻</Button>
      {manual1Cache.data}
    </Box.Success>
  )
}
const Manual1User2 = () => {
  const manual1Cache = manual1.useCache({ successPercentage: 50, waitMs: 500 })

  return (
    <Box.Success>
      <Button onClick={manual1Cache.reset}>↻</Button>
      {manual1Cache.data}
    </Box.Success>
  )
}
const Manual3User = () => {
  const manual3Cache = manual3.useCache({ successPercentage: 50, waitMs: 500 })

  return (
    <Box.Success>
      <Button onClick={manual3Cache.reset}>↻</Button>
      {manual3Cache.data}
    </Box.Success>
  )
}

const BoundaryPage = () => (
  <Area title="ErrorBoundaryGroup">
    <button
      type="button"
      onClick={() => {
        console.log(manual1.getData())
      }}
    >
      getData
    </button>
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset trigger={(group) => <Button onClick={group.reset}>↻</Button>} />
      <Area title="suspenseCache: Manual1User1">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Manual1User1 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="suspenseCache: Manual1User2">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Manual1User2 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="suspenseCache: Manual3User">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <Manual3User />
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
