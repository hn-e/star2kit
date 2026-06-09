import { createSignal, onMount } from 'solid-js'
import { createAuth0Client } from '@auth0/auth0-spa-js'

export default function Login() {
  const [user, setUser] = createSignal<any>(null)
  const [loaded, setLoaded] = createSignal(false)
  let client: any = null

  onMount(async () => {
    client = await createAuth0Client({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: { redirect_uri: window.location.origin + '/login' },
    })
    setLoaded(true)
    const u = await client.getUser()
    if (u) setUser(u)
  })

  const login = () => client?.loginWithRedirect()
  const logout = () => client?.logout({ logoutParams: { returnTo: window.location.origin } })

  if (!loaded()) return <div>Loading...</div>

  if (user()) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={login}>Sign In with Auth0</button>
      <p style={{ 'margin-top': '1rem', 'font-size': '0.8rem', color: '#666' }}>Add <code>/login</code> as an Allowed Callback URL in your Auth0 dashboard.</p>
    </div>
  )
}
