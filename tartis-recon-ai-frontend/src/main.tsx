import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from './app/providers.tsx'

const useMocksStored = localStorage.getItem('VITE_USE_MOCKS')
const useMocks = useMocksStored !== null ? useMocksStored === 'true' : import.meta.env.VITE_USE_MOCKS === 'true'

async function enableMocking() {
  if (useMocks) {
    const { worker } = await import('./testing/mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  )
})

const __ciGateCheck: number = "esto-no-es-un-numero";
