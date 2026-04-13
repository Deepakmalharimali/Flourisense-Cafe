import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Camera, Coffee, Users, MapPin, Heart, Share, Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const categories = ['All', 'Store', 'Menu', 'Seating', 'Staff', 'Customers'];

  const images = [
    // Store - 4 images
    { id: 'store1', src: 'https://images.unsplash.com/photo-1416879595882-3378e9049882?w=1200&h=800&fit=crop', alt: 'Warm inviting store interior', category: 'Store' },
    { id: 'store2', src: 'https://images.unsplash.com/photo-1444080748397-f442aa95c9cb?w=1200&h=800&fit=crop', alt: 'Modern minimalist cafe design', category: 'Store' },
    { id: 'store3', src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca1e87?w=1200&h=800&fit=crop', alt: 'Cozy reading corner setup', category: 'Store' },
    { id: 'store4', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop', alt: 'Evening ambiance lighting', category: 'Store' },
    
    // Menu - 5 images
    { id: 'menu1', src: 'https://images.unsplash.com/photo-1509043759401-9f5a4f8e69e2?w=1200&h=800&fit=crop', alt: 'Artisan coffee menu board', category: 'Menu' },
    { id: 'menu2', src: 'https://images.unsplash.com/photo-1511671782779-cb56e9ed1c6f?w=1200&h=800&fit=crop', alt: 'Fresh baked pastries display', category: 'Menu' },
    { id: 'menu3', src: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&h=800&fit=crop', alt: 'Latte art masterpiece collection', category: 'Menu' },
    { id: 'menu4', src: 'https://images.unsplash.com/photo-1577117879318-6d8c2a4d4bf1?w=1200&h=800&fit=crop', alt: 'Signature cold brew lineup', category: 'Menu' },
    { id: 'menu5', src: 'https://images.unsplash.com/photo-1505788437181-9c78bcda4bf8?w=1200&h=800&fit=crop', alt: 'Seasonal dessert specials', category: 'Menu' },
    
    // Seating - 4 images
    { id: 'seating1', src: 'https://images.unsplash.com/photo-1576086974614-dff3b4d1e31e?w=1200&h=800&fit=crop', alt: 'Cozy window seating nook', category: 'Seating' },
    { id: 'seating2', src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop', alt: 'Outdoor terrace with greenery', category: 'Seating' },
    { id: 'seating3', src: 'https://images.unsplash.com/photo-1444858291041-10ef4e6c4e69?w=1200&h=800&fit=crop', alt: 'Communal wooden tables', category: 'Seating' },
    { id: 'seating4', src: 'https://images.unsplash.com/photo-1591076482163-d674df754f58?w=1200&h=800&fit=crop', alt: 'VIP lounge corner', category: 'Seating' },
    
    // Staff - 4 images
    { id: 'staff1', src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop', alt: 'Barista serving with smile', category: 'Staff' },
    { id: 'staff2', src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&h=800&fit=crop', alt: 'Team crafting perfect pour-over', category: 'Staff' },
    { id: 'staff3', src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca1e87?w=1200&h=800&fit=crop', alt: 'Pastry chef at work', category: 'Staff' },
    { id: 'staff4', src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop', alt: 'Customer service team', category: 'Staff' },
    
    // Customers - 5 images
    { id: 'customers1', src: 'https://images.unsplash.com/photo-1509043759401-9f5a4f8e69e2?w=1200&h=800&fit=crop', alt: 'Friends celebrating', category: 'Customers' },
    { id: 'customers2', src: 'https://images.unsplash.com/photo-1512568400610-42b9a82902bd?w=1200&h=800&fit=crop', alt: 'Family coffee time', category: 'Customers' },
    { id: 'customers3', src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop', alt: 'Solo work session', category: 'Customers' },
    { id: 'customers4', src: 'https://images.unsplash.com/photo-1511893443745-69b7a4e6f632?w=1200&h=800&fit=crop', alt: 'Date night coffee', category: 'Customers' },
    { id: 'customers5', src: 'https://images.unsplash.com/photo-1577117879318-6d8c2a4d4bf1?w=1200&h=800&fit=crop', alt: 'Group meeting spot', category: 'Customers' }
  ];

  const filteredImages = activeFilter === 'All' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-black/70" />
            <img 
              src="https://images.unsplash.com/photo-1444080748397-f442aa95c9cb?w=1920&h=1080&fit=crop" 
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          >
            <Badge className="inline-flex px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30 mb-6">
              <Camera className="w-4 h-4 mr-2" />
              50+ Beautiful Moments
            </Badge>
            <motion.h1 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight"
            >
              Flourisense
              <span className="block bg-gradient-to-r from-primary via-caramel to-orange-400 bg-clip-text text-transparent">Moments</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Capture the essence of perfect coffee experiences
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('All')}
                className="px-10 py-4 rounded-2xl bg-white text-foreground font-bold shadow-2xl hover:shadow-3xl transition-all"
              >
                Explore Gallery
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-2xl glass border-2 border-white/50 backdrop-blur-xl text-white font-bold hover:bg-white/10 transition-all"
              >
                Download Catalog
                <Download className="w-5 h-5 ml-2 inline" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Filter Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-center mb-24"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(category)}
                className={`px-8 py-4 rounded-3xl font-semibold text-lg transition-all duration-300 shadow-xl ${
                  activeFilter === category
                    ? 'gradient-warm-bg text-accent-foreground shadow-2xl'
                    : 'glass bg-white/70 hover:shadow-2xl border hover:border-primary/50'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Infinite Scroll Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 mb-24">
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -10,
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.3)'
                  }}
                  onClick={() => {
                    setSelectedImage(image);
                    setLightboxOpen(true);
                  }}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 to-white shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Category Badge */}
                  <motion.div 
                    className="absolute top-6 left-6 z-20"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Badge variant="secondary" className="backdrop-blur-sm px-4 py-2 text-sm font-bold">
                      {image.category}
                    </Badge>
                  </motion.div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div className="text-white w-full">
                      <h3 className="text-xl font-bold mb-2 leading-tight">{image.alt}</h3>
                      <div className="flex gap-4 opacity-90">
                        <button className="p-2 hover:scale-110">
                          <Heart className="w-6 h-6" />
                        </button>
                        <button className="p-2 hover:scale-110">
                          <Share className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center py-24 mb-24"
          >
            {[
              { num: '500+', label: 'Photos' },
              { num: '10K+', label: 'Likes' },
              { num: '50+', label: 'Categories' },
              { num: '24/7', label: 'Open' }
            ].map((stat, index) => (
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-caramel bg-clip-text text-transparent mb-4">
                  {stat.num}
                </div>
                <p className="text-lg font-semibold text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50/50 py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,199,112,0.3),transparent)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Badge className="text-lg px-6 py-3 bg-gradient-to-r from-primary to-caramel font-bold mb-8 inline-flex">
                Join the Community
              </Badge>
              <h2 className="font-heading text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-foreground via-primary to-orange-600 bg-clip-text text-transparent leading-tight">
                Capture Your
                <span className="block">Flourisense Moments</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Share your coffee experience and be featured in our gallery
              </p>
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-12">
                <Button size="lg" className="text-xl px-12 py-8 font-bold shadow-2xl rounded-3xl h-auto">
                  Upload Your Photo
                </Button>
                <Button variant="outline" size="lg" className="text-xl px-12 py-8 font-bold border-2 rounded-3xl h-auto backdrop-blur-sm">
                  Follow @flourisense
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
          >
            <div className="max-w-6xl w-full max-h-screen flex flex-col" onClick={e => e.stopPropagation()}>
              {/* Image */}
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={images[currentIndex]?.src} 
                  alt={images[currentIndex]?.alt}
                  className="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between p-8 bg-black/50 rounded-b-3xl backdrop-blur-sm mt-8">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{images[currentIndex]?.alt}</h3>
                    <p className="text-muted-foreground text-sm opacity-90">{images[currentIndex]?.category}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-12 w-12 rounded-xl p-0">
                    <Share className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-12 w-12 rounded-xl p-0">
                    <Download className="w-6 h-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-xl p-0"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/20 h-12 w-12 rounded-xl p-0"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Gallery;

