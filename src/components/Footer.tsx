import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            AI-powered productivity for doctors. Spend more time with patients.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Resources</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
            <li><a className="hover:text-foreground" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-foreground" href="#">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Follow</h4>
          <div className="mt-3 flex gap-3">
            <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5" /></a>
            <a href="#" aria-label="X" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MedSorts. For licensed healthcare professionals.
      </div>
    </footer>
  );
}
