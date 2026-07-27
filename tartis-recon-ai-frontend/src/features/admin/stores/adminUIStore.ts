import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AdminUIState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useAdminUIStore = create<AdminUIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'tartis-admin-ui',
    },
  ),
)
