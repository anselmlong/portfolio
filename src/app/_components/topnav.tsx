import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'


export function TopNav() {
  return (
    <nav className="flex items-center justify-between w-full p-4 text-xl font-bold border-b border-white/10">
      <div>Gallery</div>
      <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
    </nav>
  )
}