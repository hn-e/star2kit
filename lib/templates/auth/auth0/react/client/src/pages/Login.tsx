import { useAuth0 } from '@auth0/auth0-react'

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Sign In</h1>
      {isAuthenticated ? (
        <p>You are signed in. <a href="/profile">Go to profile</a></p>
      ) : (
        <button onClick={() => loginWithRedirect()}>Sign In with Auth0</button>
      )}
    </div>
  )
}
