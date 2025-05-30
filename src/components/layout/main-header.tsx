
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Menu,
  Globe,
  Mail,
  Loader2,
  Lightbulb,
  Calculator,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useRegion } from "@/contexts/region-context";
import { cn } from "@/lib/utils";
import { useState, type FormEvent, createElement } from "react";
import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/contexts/auth-context"; // useAuth removed

// Define a mapping from icon names (strings) to actual Lucide icon components
const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb: Lightbulb,
  Calculator: Calculator,
  Target: Target,
};

export interface NavItem {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
}

interface MainHeaderProps {
  navItems: NavItem[];
}

export function MainHeader({ navItems }: MainHeaderProps) {
  const pathname = usePathname();
  const { selectedRegion, setSelectedRegion, availableRegions } = useRegion();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormState, setContactFormState] = useState({ name: '', email: '', message: ''});
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const { toast } = useToast();
  // const { user, signOut, isFirebaseConfigured } = useAuth(); // useAuth logic removed

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormState({ ...contactFormState, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Contact form submitted:", contactFormState);
    toast({ title: "Message Sent!", description: "We'll get back to you soon." });
    setContactFormState({ name: '', email: '', message: '' });
    setIsContactModalOpen(false); // Close modal on submit
    setIsSubmittingContact(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-8">
        {/* Left Section: Mobile Menu Trigger & Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 hover:bg-neutral-800 hover:text-primary">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-background p-4 pt-10">
              <nav className="grid gap-3">
                {navItems.map((item) => {
                  const IconComponent = iconMap[item.iconName];
                  const isActive = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.label}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        asChild
                        className={cn(
                          "justify-start text-base py-3 flex items-center w-full",
                           isActive ? "" : "hover:bg-neutral-800 hover:text-primary"
                        )}
                        size="lg"
                      >
                        <Link href={item.href} className="flex items-center w-full">
                          {IconComponent && <IconComponent className="mr-3 h-5 w-5" />}
                          {item.label}
                        </Link>
                      </Button>
                    </SheetClose>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <TrendingUp className="h-7 w-7" />
            <span className="font-bold inline-block text-xl">Trend Seeker</span>
          </Link>
        </div>

        {/* Center Section: Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center">
          <nav className="flex gap-2 items-center">
            {navItems.map((item) => {
              const IconComponent = iconMap[item.iconName];
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "text-sm font-medium rounded-full px-4 py-2",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-neutral-800 hover:text-primary"
                  )}
                >
                  <Link href={item.href} className="flex items-center">
                    {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-neutral-800 hover:text-primary">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Change region</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>Region / Currency</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={selectedRegion.code}
                onValueChange={(value) => {
                  const region = availableRegions.find(r => r.code === value);
                  if (region) setSelectedRegion(region);
                }}
              >
                {availableRegions.map((region) => (
                  <DropdownMenuRadioItem key={region.code} value={region.code}>
                    {region.name} ({region.currency})
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-neutral-800 hover:text-primary hover:border-primary">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Contact Us</DialogTitle>
                <DialogDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleContactSubmit} className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" name="name" value={contactFormState.name} onChange={handleContactFormChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" name="email" type="email" value={contactFormState.email} onChange={handleContactFormChange} required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea id="contact-message" name="message" value={contactFormState.message} onChange={handleContactFormChange} required rows={4} />
                </div>
                <DialogFooter className="mt-2">
                   <Button type="button" variant="ghost" onClick={() => setIsContactModalOpen(false)} className="hover:bg-neutral-800 hover:text-primary">Cancel</Button>
                  <Button type="submit" disabled={isSubmittingContact}>
                    {isSubmittingContact && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmittingContact ? "Sending..." : "Send Message"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
