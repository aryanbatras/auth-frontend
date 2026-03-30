import { useUser, Show } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn, user } = useUser()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center p-8">
        <Show 
          when="signed-in"
          fallback={
            <div className="flex flex-col items-center gap-6">
              <h1 className="text-4xl font-bold text-black dark:text-white">
                Welcome to Your App
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                Please sign in or sign up to access your personalized dashboard.
              </p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
              You're successfully authenticated. Your dashboard and protected content will appear here.
            </p>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">User Info</h2>
              <div className="text-left space-y-2 text-zinc-600 dark:text-zinc-400">
                <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Created:</strong> {user?.createdAt?.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Show>
      </main>
    </div>
  )
}
