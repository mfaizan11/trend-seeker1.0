
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AppFooter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        toast({
          title: "Message Sent!",
          description: "Thanks for your message! We'll be in touch soon.",
        });
        setTimeout(() => setIsSubmitted(false), 5000); // Reset message after 5 seconds
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Error Sending Message",
          description: errorData.message || "Could not send your message. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not send your message. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full border-t border-border/40 bg-background mt-12 py-8 px-4 md:px-8 text-sm text-muted-foreground">
      <div className="container max-w-screen-lg mx-auto">
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-lg">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pb-3 pt-0 text-center">
                <CardTitle className="text-xl text-foreground">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {isSubmitted && !isSubmitting ? (
                  <p className="text-green-500 text-center py-4">Thanks for your message! We'll be in touch soon.</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="footer-name" className="text-xs">Name</Label>
                      <Input
                        type="text"
                        id="footer-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Name"
                        className="bg-card h-9 text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="footer-email" className="text-xs">Email</Label>
                      <Input
                        type="email"
                        id="footer-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Your Email"
                        className="bg-card h-9 text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="footer-message" className="text-xs">Message</Label>
                      <Textarea
                        id="footer-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Your Message"
                        rows={3}
                        className="bg-card text-sm"
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
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
