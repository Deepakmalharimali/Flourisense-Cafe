import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="font-heading text-xl font-bold">
            Flourisense<span className="text-primary">.</span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Artisan coffee & dining experience. Scan, order, enjoy.
          </p>
        </div>
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/menu" className="text-sm text-foreground hover:text-primary transition-colors">Menu</Link>
<Link to="/about" className="text-sm text-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/gallery" className="text-sm text-foreground hover:text-primary transition-colors">Gallery</Link>
            <Link to="/locations" className="text-sm text-foreground hover:text-primary transition-colors">Locations</Link>
            <Link to="/contact" className="text-sm text-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider text-muted-foreground">Contact</h4>
          <p className="text-sm text-muted-foreground">hello@flourisense.cafe</p>
          <p className="text-sm text-muted-foreground">+91 98765 43210</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground">© 2026 Flourisense Cafe. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
