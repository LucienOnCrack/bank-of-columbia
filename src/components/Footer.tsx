import Link from 'next/link';
import { DollarSign, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary/10 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Bank of Columbia</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Secure banking platform for Roblox users. Building trust through technology and transparency.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="https://github.com/bankofcolumbia" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com/bankofcolumbia" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="mailto:support@bankofcolumbia.com" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold">Services</h3>
            <div className="space-y-2 text-sm">
              <Link href="/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                Banking Dashboard
              </Link>
              <Link href="/properties" className="block text-muted-foreground hover:text-primary transition-colors">
                Property Management
              </Link>
              <Link href="/employee" className="block text-muted-foreground hover:text-primary transition-colors">
                Employee Portal
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/banking/petition" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Support
              </Link>
              <Link href="https://status.bankofcolumbia.com" className="block text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                System Status
              </Link>
              <Link href="/documents" className="block text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/tos" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bank of Columbia. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
} 