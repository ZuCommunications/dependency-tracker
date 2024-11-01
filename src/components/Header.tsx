'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/versions', label: 'Versions' },
    { href: '/actions', label: 'Actions' },
  ]

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Dependency Tracker
          </Link>
          <nav className="hidden sm:block">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'font-bold text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {isMenuOpen && (
          <nav className="mt-4 sm:hidden">
            <ul className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block py-2 transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'font-bold text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
