/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, FileText, Menu, X, User, Settings, LogOut } from 'lucide-react'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-red-600">
                <span className='text-3xl'>C</span>
                <span className='italic'>BC</span>
                K
              </span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
            {status === "authenticated" ? (
              <UserProfile session={session} />
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 transition duration-300 transform hover:scale-105"
              >
                Entrar
              </button>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className="sm:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink href="/" icon={<Home />}>Home</MobileNavLink>
          <MobileNavLink href="/form" icon={<FileText />}>Form</MobileNavLink>
          {status === "authenticated" ? (
            <>
              <MobileNavLink href="/profile" icon={<User />}>Profile</MobileNavLink>
              <MobileNavLink href="/settings" icon={<Settings />}>Settings</MobileNavLink>
              <button
                onClick={() => signOut()}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
              >
                <LogOut className="mr-2" />
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
            >
              Entrar
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  )
}

function MobileNavLink({ href, children, icon }: { href: string, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  )
}

function UserProfile({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 text-gray-700 hover:text-red-600 focus:outline-none"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-red-500 rounded-full transform rotate-3"></div>
          <Image
            src={session.user?.image || "https://avatar.vercel.sh/user"}
            alt={session.user?.name || 'User'}
            width={48}
            height={48}
            className="rounded-full border-4 border-yellow-300 relative z-10"
          />
        </div>
        <span className="font-medium">{session.user?.name}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <button
              onClick={() => signOut()}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="inline-block w-4 h-4 mr-2" />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}