"use server"

import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase/admin"

export interface AuthResponse {
  success: boolean
  error?: string
}

export async function loginAction(idToken: string): Promise<AuthResponse> {
  try {
    // Verify the ID token first to check user email against the allowed list
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const email = decodedToken.email

    if (!email) {
      return { success: false, error: "Authentication failed: Email not found in token." }
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || ""
    const allowedEmails = adminEmailsEnv
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    // Check if user is authorized
    if (allowedEmails.length > 0 && !allowedEmails.includes(email.toLowerCase())) {
      return { success: false, error: "Access denied: User is not authorized." }
    }

    // Create a session cookie (valid for 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn })

    const cookieStore = await cookies()
    cookieStore.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Login action error:", error)
    return { success: false, error: error?.message || "Authentication failed" }
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("__session")
    return { success: true }
  } catch (error: any) {
    console.error("Logout action error:", error)
    return { success: false, error: "Failed to logout session." }
  }
}
