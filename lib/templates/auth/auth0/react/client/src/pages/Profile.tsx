import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Please sign in to view your profile.</p>
        <a href="/login">Sign In</a>
      </div>
    )
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}
