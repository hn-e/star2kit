import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react'

export default function Login() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return <div>Loading...</div>

  if (isSignedIn && user) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Name: {user.fullName}</p>
        <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
        <SignOutButton><button>Sign Out</button></SignOutButton>
      </div>
    )
  }

  return (
    <div>
      <h1>Sign In</h1>
      <SignInButton mode="redirect"><button>Sign In with Clerk</button></SignInButton>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>Add <code>/login</code> as an Allowed Callback URL in your Clerk dashboard.</p>
    </div>
  )
}
