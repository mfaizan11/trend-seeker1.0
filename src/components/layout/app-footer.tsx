
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

export function AppFooter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this data to a backend.
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 3000); // Reset message after 3 seconds
  };

  return (
    <footer className="w-full border-t border-border/40 bg-background mt-12 py-8 px-4 md:px-8 text-sm text-muted-foreground">
      <div className="container max-w-screen-lg mx-auto">
        {/* Form Section - Centered */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-lg"> {/* Constrains form width and allows centering */}
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pb-3 pt-0 text-center"> {/* Centered title */}
                <CardTitle className="text-xl text-foreground">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {isSubmitted ? (
                  <p className="text-green-500 text-center">Thanks for your message! We'll be in touch soon.</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs">Name</Label>
                      <Input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                        placeholder="Your Name" 
                        className="bg-card h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">Email</Label>
                      <Input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        placeholder="Your Email" 
                        className="bg-card h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="message" className="text-xs">Message</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        required 
                        placeholder="Your Message" 
                        rows={3} 
                        className="bg-card text-sm"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full md:w-auto">Send Message</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Separator className="my-6 bg-border/60" />
      <div className="container max-w-screen-lg mx-auto text-center">
        <p>&copy; {currentYear} Trend Seeker. All rights reserved.</p>
        <p className="mt-1">
          <Link href="https://muhammad-faizan-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-green-500 font-mono hover:text-green-400 transition-colors duration-200">
            Developed by Muhammad Faizan
          </Link>
        </p>
      </div>
    </footer>
  );
}
