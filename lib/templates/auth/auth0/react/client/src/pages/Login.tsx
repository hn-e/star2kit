import { useAuth0 } from '@auth0/auth0-react'

export default function Login() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div>Loading...</div>

  if (isAuthenticated && user) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Sign Out</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => loginWithRedirect()}>Sign In with Auth0</button>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>Add <code>/login</code> as an Allowed Callback URL in your Auth0 dashboard, to see profile details and Sign Out button after logging in.</p>
    </div>
  )
}
