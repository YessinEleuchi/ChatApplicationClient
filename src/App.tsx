import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/router'
import { queryClient } from './app/queryClient'
import { useEffect } from 'react'
import { useAuthStore } from './domains/auth/store/authStore'
import AuthEventListener from './app/AuthEventListener'

function App() {
    const hydrate = useAuthStore((state) => state.hydrate)

    useEffect(() => {
        hydrate()
    }, [hydrate])

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthEventListener />
                     <AppRouter />
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
