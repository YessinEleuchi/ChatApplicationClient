import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/router'
import { queryClient } from './app/queryClient'
import { useEffect } from 'react'
import { useAuthStore } from './domains/auth/store/authStore'

function App() {
    const hydrate = useAuthStore((state) => state.hydrate)

    useEffect(() => {
        hydrate()
    }, [hydrate])

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
