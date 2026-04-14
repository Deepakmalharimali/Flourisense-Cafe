import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Users, ArrowRight, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  timings: string;
  capacity: string;
  lat: number;
  lng: number;
  image: string;
  popularItems: string[];
}

const branches: Branch[] = [
  {
    id: 'main',
    name: 'Flourisense Main Branch',
    address: '123 Cafe Street, Downtown, City Center, Mumbai 400001',
    phone: '+91 98765 43210',
    timings: 'Mon-Sun 7AM - 11PM',
    capacity: '50+ seats',
    lat: 19.0760,
    lng: 72.8777,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    popularItems: ['Cappuccino', 'Croissant', 'Club Sandwich']
  },
  {
    id: 'downtown',
    name: 'Flourisense Downtown',
    address: '456 Brew Ave, Commercial District, Mumbai 400002',
    phone: '+91 98765 43211',
    timings: 'Mon-Sat 8AM - 10PM',
    capacity: '40 seats',
    lat: 19.0728,
    lng: 72.8820,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    popularItems: ['Latte', 'Blueberry Muffin', 'Veggie Wrap']
  },
  {
    id: 'beach',
    name: 'Flourisense Beachside',
    address: '789 Wave Road, Juhu Beach, Mumbai 400049',
    phone: '+91 98765 43212',
    timings: 'Daily 9AM - 12AM',
    capacity: '60+ seats',
    lat: 19.0985,
    lng: 72.8264,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
    popularItems: ['Masala Chai', 'Pain au Chocolat', 'Chicken Club']
  },
  {
    id: 'airport',
    name: 'Airport Lounge',
    address: 'Terminal 2, Chhatrapati Shivaji Airport, Mumbai 400099',
    phone: '+91 98765 43213',
    timings: '24/7',
    capacity: '30 seats',
    lat: 19.0906,
    lng: 72.8668,
    image: 'https://images.unsplash.com/photo-1564507592333-a29e8f8f2c5e?w=400&h=300&fit=crop',
    popularItems: ['Americano', 'Almond Danish', 'Gourmet Grilled Cheese']
  }
];

const Locations = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    const mapUrl = `https://www.google.com/maps?q=${branch.lat},${branch.lng}&z=16`;
    window.open(mapUrl, '_blank');
  };

  const masterMapUrl = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d15236.8894!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m2!1b1!2b1!4m2!3d1!4e2!5e0`;

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold gradient-text">
            Our Branches
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover Flourisense locations across the city. Premium coffee awaits at every outlet.
          </p>
        </motion.div>

        {/* View Toggle */}
        <div className="flex justify-center mb-8 gap-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'}
            onClick={() => setView('list')}
            className="gradient-warm-bg text-accent-foreground"
          >
            List View
          </Button>
          <Button 
            variant={view === 'map' ? 'default' : 'outline'}
            onClick={() => setView('map')}
          >
            Map View
          </Button>
        </div>

        {view === 'list' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
          >
            {branches.map((branch, index) => (
              <motion.div
                key={branch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass h-full flex flex-col overflow-hidden group hover:shadow-2xl hover:shadow-warm transition-all duration-300 border-0 hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=224&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  </div>
                  <CardHeader className="pb-3 pt-6 flex-1">
                    <CardTitle className="font-heading text-xl line-clamp-2 mb-2">{branch.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2 text-sm text-primary">
                      <MapPin className="w-4 h-4" />
                      {branch.address}
                    </div>
                    <CardDescription className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${branch.phone}`} className="hover:text-primary">{branch.phone}</a>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {branch.timings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {branch.capacity}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-0 flex-1 flex flex-col">
                    {branch.popularItems.length > 0 && (
                      <div className="mb-3 h-[52px]">
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Popular Here</p>
                    <div className="h-10 flex items-center gap-1 overflow-hidden">
                          {branch.popularItems.slice(0,3).map((item) => (
                            <span key={item} className="px-2 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-xs text-primary backdrop-blur-sm whitespace-nowrap flex-shrink-0 truncate max-w-[80px]">
                              {item}
                            </span>
                          ))}
                          {branch.popularItems.length > 3 && (
                            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-xs text-muted-foreground backdrop-blur-sm whitespace-nowrap">
                              +{branch.popularItems.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 pt-4 pb-6 mt-auto border-t border-border/50 px-4">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-12 p-4 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] font-medium leading-none tracking-tight rounded-lg"
                        onClick={() => handleBranchClick(branch)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Navigation className="w-4 h-4" />
                          Directions
                        </div>
                      </Button>
                      <Button 
                        size="lg"
                        className="h-12 p-4 text-sm font-semibold flex items-center justify-center gap-2 gradient-warm-bg text-accent-foreground shadow-lg hover:shadow-xl hover:shadow-glow transition-all duration-200 hover:scale-[1.01] hover:brightness-105 font-medium leading-none tracking-tight rounded-lg"
                        asChild
                      >
                        <a href={`/menu?branch=${branch.id}`} className="flex items-center justify-center gap-2 w-full h-full">
                          Order Now 
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="font-heading text-2xl font-bold mb-6 text-center">
              All Flourisense Locations
            </h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.474!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8f5f5f5f5f5%3A0x123456789abcdef!2sMumbai!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
              width="100%"
              height="600"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Flourisense Branches Map"
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map((branch) => (
                <Button
                  key={branch.id}
                  variant="outline"
                  className="group flex-1 min-w-0 h-auto p-3 text-left justify-start gap-3 !text-foreground hover:!text-foreground hover:bg-accent/80 hover:shadow-md transition-all"
                  onClick={() => handleBranchClick(branch)}
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center opacity-100 group-hover:opacity-100">
                    {branch.image.split('').slice(-1)[0] || '📍'}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="font-medium line-clamp-1 text-sm text-foreground group-hover:text-card-foreground">{branch.name}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-muted-foreground truncate line-clamp-1">{branch.address}</div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Locations;
