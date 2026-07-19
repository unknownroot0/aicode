"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Logo from "../../public/images/logo.svg";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaDiscord,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";
import { FiMail, FiPhone } from "react-icons/fi";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/diceymio",
    icon: <FaFacebookF className="size-4" />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/diceymio",
    icon: <FaInstagram className="size-5" />,
  },
  {
    name: "Tiktok",
    href: "https://tiktok.com/@diceymio",
    icon: <FaTiktok className="size-5" />,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@diceymio",
    icon: <FaYoutube className="size-5" />,
  },
  {
    name: "Facebook Group",
    href: "https://www.facebook.com/groups/1308819013556633",
    icon: <FaFacebookF className="size-4" />,
  },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't show footer on dashboard and auth pages
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Simulate subscription
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Thanks for subscribing!");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-linear-to-br from-[#0B1C13] to-[#0B1C13] overflow-hidden px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 sm:py-16 py-10 lg:py-20">
          {/* Brand Column */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              <Image src={Logo} alt="Logo" />
            </Link>
            <p className="text-[#FEF5DECC] text-sm leading-relaxed my-6 sm:max-w-70">
              Enter a world of strategic board games, epic adventures, and
              unforgettable gaming experiences with friends and family.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="size-9.5 rounded-full bg-[#FFFFFF26] hover:bg-[#3a4f34] flex items-center justify-center text-white hover:text-[#EAEA4C] transition-all hover:scale-110 active:scale-95"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2 lg:col-start-5">
            <h3 className="sm:text-base text-sm font-semibold uppercase text-white sm:mb-6 mb-3">
              Useful links
            </h3>
            <ul className="sm:space-y-4 space-y-2">
              {[
                { label: "About Diceymio", href: "/about" },
                { label: "Characters", href: "/characters" },
                { label: "Games", href: "/products" },
                { label: "How to Play", href: "/how-to-play" },
                { label: "Privacy Policy", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="sm:text-sm text-xs text-[#C7C0AF] hover:text-[#d4d4a0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="sm:text-base text-sm font-semibold uppercase text-white sm:mb-6 mb-3">
              Support
            </h3>
            <ul className="sm:space-y-4 space-y-2">
              {[
                { label: "Game Rules", href: "/game-rules" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns", href: "/returns" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="sm:text-sm text-xs text-[#C7C0AF] hover:text-[#d4d4a0] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="lg:col-span-3 lg:col-start-10">
            <h3 className="sm:text-base text-sm font-semibold uppercase text-white">
              Stay Updated
            </h3>

            {/* Contact Info */}
            <div className="space-y-3.5 sm:my-6 my-3">
              <a
                href="mailto:games@diceymio.com"
                className="flex items-center gap-2 w-fit sm:text-sm text-xs text-[#C7C0AF] hover:text-[#d4d4a0] transition-colors group"
              >
                <FiMail className="size-4 shrink-0 text-[#C7C0AF] group-hover:text-[#d4d4a0] transition-colors" />
                games@diceymio.com
              </a>
              <a
                href="tel:+8801740711194"
                className="flex items-center gap-2 w-fit sm:text-sm text-xs text-[#C7C0AF] hover:text-[#d4d4a0] transition-colors group"
              >
                <FiPhone className="size-4 shrink-0 text-[#C7C0AF] group-hover:text-[#d4d4a0] transition-colors" />
                +8801740711194
              </a>
            </div>

            {/* Newsletter */}
            <p className="text-xs text-[#FEF5DE80] mb-3">
              Get updates on new game releases
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 min-w-0 px-4 h-11 bg-transparent border border-[#A1A1A1] rounded-lg text-sm text-[#CDCDCD] placeholder:text-[#CDCDCD] focus:outline-none focus:border-[#6b7b60] transition-colors tracking-wider font-phudu"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 h-11 bg-[#EAEA4C] hover:bg-[#e0e050] text-[#12100A] text-sm font-semibold uppercase tracking-wider rounded-md transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed font-phudu"
              >
                {isSubmitting ? "..." : "JOIN"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 flex flex-wrap justify-between items-center gap-3 border-t border-[#A1A1A133]">
          <p className="text-xs text-[#FEF5DE80]">
            © {new Date().getFullYear()} Diceymio. All rights reserved. |
            Developed by{" "}
            <a
              href="https://naeem.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              JN
            </a>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-[#FEF5DE80] hover:text-[#FEF5DECC] transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-use"
              className="text-xs text-[#FEF5DE80] hover:text-[#FEF5DECC] transition-colors underline underline-offset-2"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
