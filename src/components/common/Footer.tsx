"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Pill, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const FOOTER_LINKS = {
  Product: [
    { label: "Browse Medicines", href: "/shop" },
    { label: "Categories", href: "/shop" },
    { label: "Featured Items", href: "/shop" },
    { label: "New Arrivals", href: "/shop" },
  ],

  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Our Mission", href: "#" },
    { label: "Contact", href: "#" },
  ],

  Support: [
    { label: "Help Center", href: "#" },
    { label: "Track Order", href: "/orders" },
    { label: "Return Policy", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-slate-200 bg-white">

      {/* background blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-100 blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 py-20">

          {/* BRAND */}
          <div className="lg:col-span-2">

            <Link
              href="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform duration-300 group-hover:scale-105">
                <Pill className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">
                  MediStore
                </h2>

                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">
                  Trusted Pharmacy
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-600">
              MediStore delivers authentic healthcare products and medicines
              with fast delivery, trusted quality, and reliable customer
              support across Bangladesh.
            </p>

            {/* contact cards */}
            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Phone className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-800">
                    +880 1234-567890
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800">
                    support@medistore.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-medium text-slate-800">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* socials */}
            <div className="mt-8 flex items-center gap-3">

              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900">
                {title}
              </h3>

              <ul className="mt-6 space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-slate-600 transition-colors duration-200 hover:text-indigo-600"
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom */}
        <div className="border-t border-slate-200 py-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} MediStore. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              {["Terms", "Privacy", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm text-slate-500 transition-colors duration-200 hover:text-indigo-600"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}