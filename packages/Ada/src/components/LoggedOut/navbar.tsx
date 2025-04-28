'use client';

import { Button } from '@/components/ui/button';
import { getUserId } from '@/lib';
import { motion } from 'framer-motion';
import { Bot, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user_id, setUserId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    return setUserId(getUserId() ?? null);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
      >
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={'/logo_white_notext.png'}
            width={40}
            height={40}
            alt="Logo"
          />
          <span className="text-white font-medium text-xl">KairosAI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/faqs">FAQs</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user_id ? (
            <Link href={'/dashboard'}>
              <Button className="text-white hover:text-purple-400">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href={'/login'}>
                <Button
                  variant="ghost"
                  className="text-white hover:text-purple-400"
                >
                  Sign In
                </Button>
              </Link>
              <Link href={'/signup'}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </motion.nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-purple-900/20 backdrop-blur-sm py-4 px-6 border-b border-white/10"
        >
          <div className="flex flex-col space-y-4">
            <MobileNavLink href="/" onClick={toggleMenu}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/about" onClick={toggleMenu}>
              About Us
            </MobileNavLink>
            <MobileNavLink href="/faqs" onClick={toggleMenu}>
              FAQs
            </MobileNavLink>
            <MobileNavLink href="/pricing" onClick={toggleMenu}>
              Pricing
            </MobileNavLink>

            <div className="pt-4 border-t border-white/10 mt-2">
              {user_id ? (
                <Link href={'/dashboard'} onClick={toggleMenu}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href={'/login'} onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-purple-400"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href={'/signup'} onClick={toggleMenu}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-900/20 border-purple-500/20 transition-all group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="text-white text-center text-lg py-2 border-b bg-purple-900/20 border-purple-500/20 last:border-none rounded-md"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
