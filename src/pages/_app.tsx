import '@/styles/globals.css'
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        padding: '16px 24px', 
        height: '64px',
        borderBottom: '1px solid #333333',
        background: '#000000'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* <SignInButton 
            mode="modal"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-transparent text-white border border-white hover:bg-white hover:text-black transition-all duration-200'
              }
            }}
          /> */}
          <SignUpButton 
            mode="modal"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-white text-black border border-white hover:bg-transparent hover:text-white transition-all duration-200'
              }
            }}
          >
            <button style={{
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '0px solid #ffffff',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Sign Up
            </button>
          </SignUpButton>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: 'w-10 h-10',
                userButtonPopoverCard: 'bg-gray-900 border border-gray-800',
                userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-800',
                userButtonPopoverActionButtonText: 'text-gray-300',
                userButtonPopoverMain: 'bg-gray-900'
              }
            }}
          />
        </div>
      </header>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
