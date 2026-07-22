import { useState } from 'react'
import { TariffForm } from './TariffForm'

export const TariffListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in">
      {/* Header con botón de Crear Tarifa al mismo nivel */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tarifas</h1>
          <p className="text-sm text-gray-400">Administración · Tarifas de Aparcamiento</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Crear tarifa
        </button>
      </div>

      {/* Modal de Formulario de Tarifa */}
      {isModalOpen && <TariffForm onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
