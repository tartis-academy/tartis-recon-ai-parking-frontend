import { useState } from 'react'
import {
  stayService,
  type CheckInResponse,
  type CheckOutResponse,
  type VehicleType,
} from '@/features/entry-exit'

type ApiError = {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export function TotemPage() {
  const [activeTab, setActiveTab] = useState<'checkin' | 'checkout'>('checkin')
  const [licensePlate, setLicensePlate] = useState('')
  const [vehicleType, setVehicleType] = useState<VehicleType>('CAR')
  const [ticketIdOrPlate, setTicketIdOrPlate] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [checkInResult, setCheckInResult] = useState<CheckInResponse | null>(null)
  const [checkOutResult, setCheckOutResult] = useState<CheckOutResponse | null>(null)

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!licensePlate.trim()) {
      setErrorMsg('Por favor ingrese una matrícula válida.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)
    setCheckInResult(null)

    const plateUpper = licensePlate.trim().toUpperCase()

    try {
      const response = await stayService.checkIn({
        plate: plateUpper,
        vehicleType,
      })
      setCheckInResult(response)
    } catch (err: unknown) {
      console.error('Error during check-in:', err)
      const apiErr = err as ApiError
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          'Error al realizar el check-in.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketIdOrPlate.trim()) {
      setErrorMsg('Por favor ingrese el ID del ticket o la matrícula.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)
    setCheckOutResult(null)

    try {
      const inputVal = ticketIdOrPlate.trim()
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inputVal)
      const payload = isUuid ? { entryTicketId: inputVal } : { plate: inputVal.toUpperCase() }
      const response = await stayService.checkOut(payload)
      setCheckOutResult(response)
    } catch (err: unknown) {
      console.error('Error during check-out:', err)
      const apiErr = err as ApiError
      setErrorMsg(
        apiErr.response?.data?.message ||
          apiErr.message ||
          'Error al realizar el check-out.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const checkInDateStr = checkInResult?.entryTicket?.issuedAt || checkInResult?.checkIn

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Background Decorative Blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Header / Brand */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Tartis Recon AI</span> • <span>Tótem Inteligente</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Simulador de Entrada / Salida
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulación de escaneo y emisión de tickets de aparcamiento
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('checkin')
              setErrorMsg(null)
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'checkin'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Entrada (Check-in)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('checkout')
              setErrorMsg(null)
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'checkout'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Salida (Check-out)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'checkin' ? (
            <form onSubmit={handleCheckIn} className="space-y-6">
              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-slate-300 mb-2">
                  Matrícula del Vehículo *
                </label>
                <input
                  id="licensePlate"
                  type="text"
                  placeholder="Ej. 1234ABC o ABC-999"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all uppercase tracking-widest"
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Vehículo
                </label>
                <select
                  id="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="CAR">Coche (CAR)</option>
                  <option value="CAR_PMR">Coche PMR (CAR_PMR)</option>
                  <option value="MOTORBIKE">Moto (MOTORBIKE)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Emitiendo Ticket...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>Emitir EntryTicket (Check-in)</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCheckOut} className="space-y-6">
              <div>
                <label htmlFor="ticketIdOrPlate" className="block text-sm font-medium text-slate-300 mb-2">
                  ID de Ticket o Matrícula *
                </label>
                <input
                  id="ticketIdOrPlate"
                  type="text"
                  placeholder="Ingrese número de ticket o matrícula"
                  value={ticketIdOrPlate}
                  onChange={(e) => setTicketIdOrPlate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all tracking-wider"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Procesando Salida...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Procesar Salida (Check-out)</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Ticket Visualizer Result (Check-in) */}
          {checkInResult && (
            <div className="mt-8 bg-slate-950 border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-400 font-bold text-sm uppercase tracking-wide">
                    Ticket Emitido Exitosamente
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  {checkInDateStr ? new Date(checkInDateStr).toLocaleTimeString() : ''}
                </span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">ID Ticket:</span>
                  <span className="text-white font-bold">{checkInResult.entryTicket?.ticketId || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">ID Estancia (Stay):</span>
                  <span className="text-slate-300">{checkInResult.stayId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Matrícula:</span>
                  <span className="text-emerald-400 font-bold text-base tracking-widest">{checkInResult.plate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Fecha / Hora:</span>
                  <span className="text-slate-300">
                    {checkInDateStr ? new Date(checkInDateStr).toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Barcode Mock */}
              <div className="mt-6 pt-4 border-t border-dashed border-slate-800 text-center">
                <div className="inline-block bg-white text-black p-3 rounded font-mono font-bold tracking-widest text-lg shadow-inner">
                  {checkInResult.entryTicket?.barCode || '||| | |||| | || ||| || ||| |'}
                </div>
                <p className="text-xs text-slate-500 mt-1 font-mono">{checkInResult.entryTicket?.barCode || checkInResult.entryTicket?.ticketId || checkInResult.stayId}</p>
              </div>
            </div>
          )}

          {/* Checkout Visualizer Result */}
          {checkOutResult && (
            <div className="mt-8 bg-slate-950 border border-indigo-500/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
                  <span className="text-indigo-400 font-bold text-sm uppercase tracking-wide">
                    Resumen de Salida (Check-out)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {checkOutResult.status || 'FINISHED'}
                </span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Matrícula:</span>
                  <span className="text-indigo-400 font-bold text-base tracking-widest">{checkOutResult.plate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Entrada:</span>
                  <span className="text-slate-300">{new Date(checkOutResult.checkIn).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Salida:</span>
                  <span className="text-slate-300">{new Date(checkOutResult.checkOut).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-slate-300 font-bold">Total a Cobrar:</span>
                  <span className="text-2xl font-extrabold text-white">
                    {checkOutResult.amount ? checkOutResult.amount.toFixed(2) : '0.00'} EUR
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TotemPage
