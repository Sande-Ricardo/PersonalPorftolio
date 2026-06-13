"use client"

import * as React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

import { submitContactForm } from "@/app/actions/contact"

interface FormValues {
  name: string
  email: string
  projectType: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  projectType?: string
  message?: string
}

export const Contact: React.FC = () => {
  const [values, setValues] = React.useState<FormValues>({
    name: "",
    email: "",
    projectType: "frontend",
    message: "",
  })
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = React.useState("")

  const validate = (): boolean => {
    const tempErrors: FormErrors = {}
    let isValid = true

    if (!values.name.trim()) {
      tempErrors.name = "Name is required"
      isValid = false
    } else if (values.name.trim().length < 3) {
      tempErrors.name = "Name must be at least 3 characters"
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!values.email.trim()) {
      tempErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(values.email)) {
      tempErrors.email = "Invalid email format"
      isValid = false
    }

    if (!values.message.trim()) {
      tempErrors.message = "Message is required"
      isValid = false
    } else if (values.message.trim().length < 10) {
      tempErrors.message = "Message must be at least 10 characters"
      isValid = false
    }

    setErrors(tempErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setStatus("submitting")
    setErrorMessage("")

    try {
      const res = await submitContactForm(values)
      if (res.success) {
        setStatus("success")
        setValues({ name: "", email: "", projectType: "frontend", message: "" })
      } else {
        setErrorMessage(res.error || "Submission rejected by system.")
        setStatus("error")
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network transmission failure.")
      setStatus("error")
    }
  }

  return (
    <section className="px-margin-mobile md:px-margin-desktop py-20 border-b border-outline-variant select-none">
      <div className="mb-12">
        <span className="font-technical-label text-technical-label text-on-surface-variant block mb-2">
          [ 05 ] INITIATE_CONTACT
        </span>
        <h2 className="font-display text-[24px] font-medium text-primary uppercase">
          SYSTEM.CONTACT
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 mt-12">
        {/* Left Column - Contact Form */}
        <div className="flex flex-col gap-6 md:border-r md:border-outline-variant md:pr-12">
          {status === "success" ? (
            <div className="border border-outline-variant bg-surface-container-low p-6 rounded-none flex flex-col gap-4 font-mono text-sm">
              <div className="text-primary font-bold">
                &gt; TRANSMISSION_SUCCESSFUL // 200 OK
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Message transmitted successfully. Thank you for initiating contact. I will review the
                telemetry and reply within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="text-left text-xs text-primary underline mt-2 hover:opacity-80 cursor-pointer"
              >
                [ SEND_ANOTHER_MESSAGE ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              {status === "error" && (
                <div className="text-error font-mono text-xs border border-error bg-error/10 p-3 rounded-none">
                  &gt; SUBMISSION_FAILURE // {errorMessage || "Error occurred. Please try again."}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-on-background uppercase">
                  NAME
                </label>
                <Input
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? "border-error focus:border-error" : ""}
                />
                {errors.name && (
                  <span className="font-technical-label text-[10px] text-error uppercase">
                    * {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-on-background uppercase">
                  EMAIL
                </label>
                <Input
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={errors.email ? "border-error focus:border-error" : ""}
                />
                {errors.email && (
                  <span className="font-technical-label text-[10px] text-error uppercase">
                    * {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-on-background uppercase">
                  PROJECT TYPE
                </label>
                <div className="relative">
                  <select
                    name="projectType"
                    value={values.projectType}
                    onChange={handleChange}
                    className="w-full bg-[#191A1E] border border-outline-variant focus:border-white text-primary p-4 rounded-none font-code-snippet text-code-snippet outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="frontend">Frontend Development</option>
                    <option value="backend">Backend Systems</option>
                    <option value="fullstack">Fullstack Architecture</option>
                    <option value="ai">AI Integration</option>
                    <option value="other">Other / Consultation</option>
                  </select>
                  {/* Custom arrow decoration */}
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-on-surface-variant">
                    <span className="font-mono text-xs">[ V ]</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-technical-label text-[10px] text-on-background uppercase">
                  MESSAGE
                </label>
                <Textarea
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Describe the requirements..."
                  className={errors.message ? "border-error focus:border-error" : ""}
                />
                {errors.message && (
                  <span className="font-technical-label text-[10px] text-error uppercase">
                    * {errors.message}
                  </span>
                )}
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={status === "submitting"}
                className="w-full mt-2"
              >
                {status === "submitting" ? "[ TRANSMITTING... ]" : "[ SEND_MESSAGE ]"}
              </Button>
            </form>
          )}
        </div>

        {/* Right Column - Status Panel & Links */}
        <div className="md:pl-12 flex flex-col gap-8">
          <div className="bg-[#191A1E] border border-outline-variant p-6 rounded-none flex flex-col gap-4 font-mono text-xs select-text">
            <div className="font-code-snippet text-primary flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary animate-pulse" />
              STATUS: AVAILABLE_FOR_PROJECTS
            </div>
            <div className="text-on-surface-variant pl-4">&gt; RESPONSE_TIME &lt; 24hs</div>
            <div className="text-on-surface-variant pl-4">&gt; TIMEZONE: UTC-3 (BUENOS AIRES)</div>
          </div>

          <div className="flex flex-col gap-4 font-mono text-xs select-text">
            <a
              href="mailto:hi@sandericardo.com"
              className="text-on-surface-variant hover:text-primary hover:underline decoration-1 underline-offset-4 transition-all duration-200 block"
            >
              &gt; EMAIL: hi@sandericardo.com
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary hover:underline decoration-1 underline-offset-4 transition-all duration-200 block"
            >
              &gt; GITHUB: github.com
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary hover:underline decoration-1 underline-offset-4 transition-all duration-200 block"
            >
              &gt; LINKEDIN: linkedin.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
