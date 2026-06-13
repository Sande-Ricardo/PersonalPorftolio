"use server"

import { adminDb } from "@/lib/firebase/admin"

export interface ContactFormData {
  name: string
  email: string
  projectType: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  error?: string
}

export async function submitContactForm(data: ContactFormData): Promise<ContactFormResponse> {
  try {
    const { name, email, projectType, message } = data

    // 1. Validation
    if (!name || name.trim().length < 3) {
      return { success: false, error: "Name must be at least 3 characters long." }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Please provide a valid email address." }
    }

    if (!message || message.trim().length < 10) {
      return { success: false, error: "Message must be at least 10 characters long." }
    }

    // 2. Save to Firestore
    await adminDb.collection("messages").add({
      name: name.trim(),
      email: email.trim(),
      projectType,
      message: message.trim(),
      status: "unread",
      createdAt: new Date().toISOString(),
    })

    // 3. Send email notification via Resend REST API
    const resendKey = process.env.RESEND_API_KEY
    const adminEmailTo = process.env.EMAIL_ADMIN_TO || "ricardosande101@gmail.com"

    if (resendKey) {
      const emailBody = {
        // Resend Sandbox requires sending from onboarding@resend.dev unless a domain is verified
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: adminEmailTo,
        subject: `New Lead: ${name.trim()} (${projectType})`,
        html: `
          <div style="font-family: monospace; border: 1px solid #333; padding: 20px; background-color: #f9f9f9; max-width: 600px;">
            <h2 style="border-bottom: 1px solid #333; padding-bottom: 10px; color: #111;">[ NEW_CONTACT_FORM_SUBMISSION ]</h2>
            <p><strong>Sender Name:</strong> ${name.trim()}</p>
            <p><strong>Sender Email:</strong> <a href="mailto:${email.trim()}">${email.trim()}</a></p>
            <p><strong>Project Type:</strong> ${projectType.toUpperCase()}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <div style="margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 15px;">
              <p><strong>Message:</strong></p>
              <blockquote style="white-space: pre-wrap; font-style: italic; background: #fff; padding: 10px; border-left: 3px solid #333; margin: 0;">${message.trim()}</blockquote>
            </div>
            <p style="margin-top: 30px; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px;">
              * Check the Admin Panel messages inbox to reply directly.
            </p>
          </div>
        `,
      }

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify(emailBody),
      })

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text()
        console.error("Resend API failed to transmit email:", errorText)
        // We do not fail the submission response if only email notification fails, 
        // since the record was successfully written to Firestore database.
      }
    } else {
      console.warn("RESEND_API_KEY is not configured. Email notification skipped.")
    }

    return { success: true }
  } catch (error: any) {
    console.error("Failed to process contact form submission:", error)
    return { success: false, error: error?.message || "Internal server error." }
  }
}
