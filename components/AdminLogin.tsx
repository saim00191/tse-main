"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, ArrowRight } from "lucide-react"
import Image from "next/image"
import Logo from "@/public/image.png"

const AdminLogin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        // Store authentication state
        localStorage.setItem("isAuthenticated", "true")
        // Redirect to dashboard
        router.push("/")
      } else {
        setError("Invalid username or password")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row">
        {/* Left side - Branding */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-8">
              <div className="relative h-[60px] w-[60px] overflow-hidden bg-white rounded-2xl">
                <Image src={Logo || "/placeholder.svg"} alt="Company Logo" fill className="object-contain h-[60px] w-[60px]" priority />
              </div>
              <h1 className="text-white text-2xl font-bold">AdminPanel</h1>
            </div>

            <div className="mt-auto">
              <h2 className="text-3xl md:text-[33px] font-bold text-white leading-tight">
                Welcome to your Admin Dashboard
              </h2>
              <p className="mt-4 text-indigo-100 text-lg">
                 Monitor transactions, generate reports, and ensure compliance — your complete billing and TSE management hub is ready.
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        </div>

        {/* Right side - Login form */}
        <div className="bg-white w-full md:w-7/12 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center md:text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Login</h2>
              <p className="mt-2 text-gray-600">Please sign in to access your admin account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Mail size={16} className="text-indigo-600" />
                  Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all duration-300 pl-4 bg-gray-50 group-hover:border-gray-300"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Lock size={16} className="text-indigo-600" />
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 transition-all duration-300 pl-4 bg-gray-50 group-hover:border-gray-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex cursor-pointer items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                <span>Sign In</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                {isLoading && (
                  <svg
                    className="animate-spin ml-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminLogin