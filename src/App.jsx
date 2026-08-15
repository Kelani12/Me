import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './lib/firebase'
import Login from './pages/login'
import SignUp from './pages/signUp'
import OnBoarding from './pages/onBoarding'
import Dashboard from './pages/dashboard'
import PeriodTracker from './pages/periodTracker'
import Profile from './pages/profile'
import GuardianConsent from './pages/guardianConsent'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            loading ? (
              <div>Loading...</div>
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignUp />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <OnBoarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/period-tracker"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <PeriodTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user} loading={loading}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guardian-consent/:guardianId"
          element={<GuardianConsent />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App