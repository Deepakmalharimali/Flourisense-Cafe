import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';

const contactSchema = z.object({
  name: z.string().min(1, 'Name required'),
  phone: z.string().min(10, 'Phone number required'),
  email: z.string().email('Valid email required').optional(),
  message: z.string().min(10, 'Message too short'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);
    // Mock success - create 'contacts' table in Supabase or comment out
    toast({ title: 'Message sent!', description: 'We will contact you soon.' });
    setSubmitting(false);
    reset();
  };


  const whatsappUrl = 'https://wa.me/917020826752?text=Hi Flourisense, I have a query...';
  const callUrl = 'tel:+917020826752';
  const emailUrl = 'mailto:hello@flourisense.com';

  return (
    <main className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold gradient-text">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond within 2 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="space-y-8">
              {/* Contact Cards */}
              <div className="space-y-4">
                <Card className="glass border-0 hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-2xl gradient-warm-bg flex items-center justify-center mb-4 mx-auto">
                      <Phone className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl font-heading text-center mb-2">Call Us</CardTitle>
                    <CardDescription className="text-center text-sm">24/7 Customer Support</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <Button variant="ghost" size="lg" className="h-auto px-0 gap-2 text-lg font-semibold" asChild>
                      <a href={callUrl}>
                        +91 70208 26752
                        <Phone className="w-5 h-5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-0 hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 mx-auto">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-heading text-center mb-2">WhatsApp</CardTitle>
                    <CardDescription className="text-center text-sm">Instant Support</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <Button className="gradient-green text-white w-full font-semibold" asChild>
                      <a href={whatsappUrl} target="_blank" rel="noopener">
                        Chat on WhatsApp <Send className="w-4 h-4 ml-1" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass border-0 hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-heading text-center mb-2">Email</CardTitle>
                    <CardDescription className="text-center text-sm">hello@flourisense.com</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <Button variant="ghost" size="lg" className="h-auto px-0 gap-2 text-lg font-semibold" asChild>
                      <a href={emailUrl}>
                        Send Email
                        <Mail className="w-5 h-5" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Business Info */}
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <MapPin className="w-6 h-6" />
                    Business Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><span className="font-semibold">Registered Name:</span> Flourisense Cafe Pvt Ltd</div>
                  <div><span className="font-semibold">FSSAI:</span> 12345678901234</div>
                  <div><span className="font-semibold">GST:</span> 27ABCDE1234F1Z5</div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Instagram className="w-5 h-5" />
                    <a href="https://instagram.com/flourisense" target="_blank" className="font-semibold hover:text-primary">@flourisense</a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form & Map */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            {/* Contact Form */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="font-heading text-2xl mb-1">Send Message</CardTitle>
                <CardDescription>We respond within 2 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" {...register('phone')} />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email')} />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" rows={5} {...register('message')} />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full gradient-warm-bg text-accent-foreground h-12 font-heading" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Find Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3809.47!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8f5f5f5f5f5%3A0x123456789abcdef!2sMumbai!5e0!3m2!1sen!2sin!4v1690000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '0 0 12px 12px' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Flourisense Cafe Location"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a href={whatsappUrl} className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl gradient-green shadow-2xl flex items-center justify-center text-white z-50 hover:scale-110 transition-all" target="_blank">
        <MessageCircle className="w-7 h-7" />
      </a>

      <Footer />
    </main>
  );
};

export default Contact;
