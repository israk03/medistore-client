"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Pill,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
const FOOTER_LINKS = {
  Product: [
    { label: "Browse Medicines", href: "/shop" },
    { label: "Categories", href: "/shop" },
    { label: "Featured Items", href: "/shop" },
    { label: "New Arrivals", href: "/shop" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "/orders" },
    { label: "Return Policy", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  "For Sellers": [
    { label: "Become a Seller", href: "/register" },
    { label: "Seller Dashboard", href: "/seller/dashboard" },
    { label: "Seller Guidelines", href: "#" },
    { label: "Seller Support", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "Youtube" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#6B4FE0] to-[#2D9D78] rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                <span className="text-[#a78bfa]">Medi</span>
                <span className="text-[#6ee7b7]">Store</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Your trusted online pharmacy for authentic over-the-counter
              medicines. Fast delivery, best prices, and 24/7 customer support.
            </p>

            {/* Contact Info */}
            <div className="space-y-2.5">
              {[
                { icon: Phone, text: "+880 1234-567890" },
                { icon: Mail, text: "support@medistore.com" },
                { icon: MapPin, text: "Dhaka, Bangladesh" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#a78bfa]" />
                  </div>
                  <span className="text-slate-400">{text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-[#6B4FE0] flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {title}
              </h3>
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-2.5"
              >
                {links.map((link) => (
                  <motion.li key={link.label} variants={itemVariants}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} MediStore. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}