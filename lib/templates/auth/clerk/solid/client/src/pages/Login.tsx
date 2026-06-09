import { createSignal, onMount } from 'solid-js'
import Clerk from '@clerk/clerk-js'

export default function Login() {
  const [user, setUser] = createSignal<any>(null)
  const [loaded, setLoaded] = createSignal(false)
  let clerk: Clerk | null = null

  onMount(async () => {
    clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
    await clerk.load()
    setLoaded(true)
    if (clerk.user) setUser(clerk.user as any)
  })

  const signIn = () => clerk?.openSignIn()
  const signOut = () => clerk?.signOut()

  if (!loaded()) return <div>Loading...</div>

  if (user()) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Name: {user().fullName}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={signIn}>Sign In with Clerk</button>
      <p style={{ 'margin-top': '1rem', 'font-size': '0.8rem', color: '#666' }}>Add <code>/login</code> as an Allowed Callback URL in your Clerk dashboard.</p>
    </div>
  )
}
