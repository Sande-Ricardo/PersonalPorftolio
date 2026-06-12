"use client"

import * as React from "react"
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase/client"
import { loginAction } from "@/app/actions/auth"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Email and Password are required.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Authenticate with Firebase Client Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // 2. Get ID Token
      const idToken = await user.getIdToken()

      // 3. Set Session Cookie via Server Action
      const result = await loginAction(idToken)

      if (result.success) {
        // Redirect to admin panel
        window.location.href = "/admin"
      } else {
        setError(result.error || "Authentication failed.")
        await auth.signOut() // Sign out client if server rejects
      }
    } catch (err: any) {
      console.error("Firebase Login Error:", err)
      // Provide a generic error message as required by SRS
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.")
      } else if (err.code === "auth/too-many-requests") {
        setError("Access temporarily blocked due to too many failed attempts. Try again later.")
      } else {
        setError("An unexpected authentication error occurred.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user
      const idToken = await user.getIdToken()

      const result = await loginAction(idToken)

      if (result.success) {
        window.location.href = "/admin"
      } else {
        setError(result.error || "Access denied.")
        await auth.signOut()
      }
    } catch (err: any) {
      console.error("Google Login Error:", err)
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google authentication popup closed.")
      } else {
        setError("An error occurred during Google authentication.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-[#191A1E] border border-outline-variant p-8 relative rounded-none select-none">
      {/* Corner markers */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white"></div>

      <div className="mb-6 border-b border-outline-variant pb-4">
        <span className="font-technical-label text-[10px] text-on-surface-variant block mb-1">
          [ AUTH_SYS_INITIALIZATION ]
        </span>
        <h2 className="font-display text-lg font-medium text-primary uppercase">
          SECURE_LOGIN.EXE
        </h2>
      </div>

      {error && (
        <div className="mb-6 font-technical-label text-xs text-error border border-error bg-error/10 p-3 rounded-none">
          &gt; ERROR: {error}
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-on-background uppercase">
            EMAIL
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sandericardo.com"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-technical-label text-[10px] text-on-background uppercase">
            PASSWORD
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <Button type="submit" variant="primary" disabled={loading} className="w-full mt-2">
          {loading ? "[ LOGIN_PROCESS_RUNNING... ]" : "[ EXECUTE_LOGIN ]"}
        </Button>
      </form>

      <div className="my-6 flex items-center justify-between gap-4">
        <span className="h-[1px] bg-outline-variant flex-grow" />
        <span className="font-technical-label text-[10px] text-outline uppercase">OR</span>
        <span className="h-[1px] bg-outline-variant flex-grow" />
      </div>

      <Button
        onClick={handleGoogleLogin}
        variant="secondary"
        disabled={loading}
        className="w-full"
      >
        [ SIGN_IN_WITH_GOOGLE ]
      </Button>
    </div>
  )
}
