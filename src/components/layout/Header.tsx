import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, Cannabis, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useTheme } from 'next-themes';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  {
    label: 'Verein',
    href: '/verein',
    children: [
      { label: 'Über uns', href: '/verein' },
      { label: 'Gesundheits- & Jugendschutz', href: '/gesundheitsschutz' },
    ],
  },
  { label: 'Sortiment', href: '/sortiment' },
  { label: 'Standorte', href: '/standorte' },
  { label: 'Mitgliedsanträge', href: '/mitgliedsbeitraege' },
  { label: 'Neuigkeiten', href: '/neuigkeiten' },
];

export function Header() {
  const { isScrolled } = useScrollPosition();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoFullscreen, setIsLogoFullscreen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsLogoFullscreen(true)}
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:rotate-6 hover:scale-105 p-0.5 group"
            >
              <img 
                src="/images/logo.webp" 
                alt="CSCN Logo" 
                className="w-full h-full object-contain"
              />
            </button>
            <Link to="/" className="block group">
              <h1 className="text-foreground font-headline font-black text-[13px] sm:text-xl lg:text-2xl leading-[1.1] sm:leading-[0.9] tracking-tight group-hover:text-primary transition-colors duration-300">
                Cannabis Social Club
                <br />
                Nordheide E.V.
              </h1>
              <p className="text-muted-foreground text-[8px] sm:text-[11px] font-sans uppercase tracking-[0.1em] sm:tracking-[0.2em] mt-1 sm:mt-1.5 font-bold">Vereinswebsite des CSC Nordheide e.V.</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1.5 text-sm font-headline font-black uppercase tracking-widest transition-all hover:text-primary ${
                        isActive(item.href) ? 'text-primary' : 'text-foreground/70'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden py-2"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="block px-5 py-3 text-xs font-headline font-bold uppercase tracking-wider text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`relative text-sm font-headline font-black uppercase tracking-widest transition-all hover:text-primary hover:tracking-[0.15em] ${
                      isActive(item.href) ? 'text-primary' : 'text-foreground/70'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-500 rounded-full ${
                        isActive(item.href) ? 'w-full' : 'w-0'
                      }`}
                    />
                  </Link>
                )}
              </div>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-6 w-11 h-11 rounded-xl border-border bg-background/50 hover:bg-primary/5 hover:border-primary/50 text-primary transition-all duration-500 hover:rotate-[30deg] shadow-lg shadow-black/5"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Cannabis className={`w-6 h-6 transition-all duration-700 ${theme === 'dark' ? 'fill-primary scale-110' : 'scale-90'}`} />
            </Button>
          </nav>

          {/* Mobile Menu */}
          <div className="flex items-center gap-4 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-primary"
            >
              <Cannabis className={`w-6 h-6 ${theme === 'dark' ? 'fill-primary' : ''}`} />
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-foreground/80 hover:text-foreground">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background border-border">
                  <div className="mt-8 mb-6 px-2">
                    <h2 className="text-xl font-headline font-black text-foreground">Menü</h2>
                  </div>
                  <div className="flex flex-col gap-6">
                    {navItems.map((item) => (
                      <div key={item.label}>
                        {item.children ? (
                          <div className="space-y-4">
                            <span className="text-muted-foreground text-xs font-headline font-black uppercase tracking-[0.2em] px-2">{item.label}</span>
                            <div className="space-y-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block text-xl font-headline font-black tracking-tight px-4 py-2 rounded-xl transition-all ${
                                    isActive(child.href) 
                                      ? 'bg-primary/10 text-primary' 
                                      : 'text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block text-3xl font-headline font-black tracking-tighter px-2 transition-all ${
                              isActive(item.href) ? 'text-primary scale-105' : 'text-foreground active:scale-95'
                            }`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Fullscreen Logo Overlay */}
      <AnimatePresence>
        {isLogoFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setIsLogoFullscreen(false)}
          >
            <motion.button
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-8 right-8 p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoFullscreen(false);
              }}
            >
              <X className="w-8 h-8" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="max-w-4xl w-full aspect-square flex items-center justify-center p-8 bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src="/images/logo.webp" 
                alt="CSCN Logo Fullscreen" 
                className="max-w-full max-h-full object-contain drop-shadow-[0_0_50px_rgba(34,197,94,0.3)]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
