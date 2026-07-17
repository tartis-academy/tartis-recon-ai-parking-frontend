import { Link } from '@tanstack/react-router'

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/vehicles">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl mb-3">
                🚗
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Vehículos</h2>
              <p className="text-sm text-gray-600">Gestiona los vehículos del parking</p>
            </div>
          </Link>
          <Link to="/admin/spots">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-3">
                🅿️
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Plazas</h2>
              <p className="text-sm text-gray-600">Gestiona las plazas del parking</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
