import { useContext } from 'react'
import { AuthContext } from '../App'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthContext provider')
  }
  return context
}
