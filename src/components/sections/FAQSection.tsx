"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, Minus, MessageCircle, User, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const CUSTOMER_FAQS = [
  {
    question: "Are the medicines sold on MediStore authentic?",
    answer: "Absolutely. We only partner with licensed pharmacies and verified manufacturers like Square Pharma and Incepta. Every product undergoes a strict quality check.",
  },
  {
    question: "How does delivery work on MediStore?",
    answer: "Each pharmacy handles its own deliveries. When you place an order, the seller will dispatch their delivery person or a courier to your address. Delivery times may vary depending on the specific pharmacy's location.",
  },
  {
    question: "Do I need a prescription to order?",
    answer: "For Prescription Only (POM) medicines, a valid upload is required. OTC products like vitamins do not require a prescription.",
  },
  {
    question: "Is MediStore responsible for the delivery process?",
    answer: "MediStore acts as a platform to connect you with verified sellers. The seller is directly responsible for the safe and timely delivery of your medicines. However, our support team is always here to help mediate if issues arise.",
  },
];

const SELLER_FAQS = [
  {
    question: "How do I register my pharmacy as a seller?",
    answer: "Getting started is instant! You don't need to upload any documents during registration. Simply sign up as a seller, and you can begin setting up your shop. MediStore will send a verification email later to finalize your professional credentials.",},
  {
    question: "What are the commission rates for sellers?",
    answer: "We charge a flat 5% platform fee on successful orders. There are no hidden listing fees or monthly subscription costs for verified pharmacies.",
  },
  {
    question: "How and when do I get paid for my sales?",
    answer: "Payments are processed every Monday. Funds are transferred directly to your linked bank account or mobile financial service (bKash/Nagad) once the customer receives the order.",
  },
  {
    question: "What is the policy for returned medicines?",
    answer: "Sellers must accept returns if the wrong product was sent or if the item is near expiry. We recommend recording a video while packing orders to ensure protection against fraudulent return claims.",
  },
  {
    question: "Who is responsible for delivering the orders?",
    answer: "As a seller, you are responsible for managing your own logistics. You can use your own delivery staff or any local courier service to get the products to the customer safely.",
  },
  
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function FAQSection() {
  const [activeTab, setActiveTab] = useState<"customer" | "seller">("customer");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentFaqs = activeTab === "customer" ? CUSTOMER_FAQS : SELLER_FAQS;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Common <span className="bg-linear-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Questions</span>
          </h2>
          
          {/* TAB SWITCHER */}
          <div className="flex p-1 bg-slate-100 rounded-2xl w-fit mx-auto mt-8">
            <button
              onClick={() => { setActiveTab("customer"); setOpenIndex(0); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === "customer" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <User className="w-4 h-4" /> For Customers
            </button>
            <button
              onClick={() => { setActiveTab("seller"); setOpenIndex(0); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === "seller" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Store className="w-4 h-4" /> For Sellers
            </button>
          </div>
        </div>

        {/* FAQ LIST */}
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="show"
          variants={{
            show: { transition: { staggerChildren: 0.1 } }
          }}
          className="space-y-4"
        >
          {currentFaqs.map((faq, index) => (
            <motion.div 
              key={faq.question}
              variants={itemVariants}
              className={cn(
                "rounded-4xl border transition-all duration-300",
                openIndex === index ? "bg-white border-indigo-100 shadow-xl shadow-indigo-100/30" : "bg-slate-50/50 border-transparent"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <span className={cn("text-lg font-bold", openIndex === index ? "text-indigo-600" : "text-slate-900")}>
                  {faq.question}
                </span>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  openIndex === index ? "bg-indigo-600 text-white" : "bg-white text-slate-400"
                )}>
                  {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
              </button>

              <div>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                      <div className="h-px w-full bg-slate-100 mb-6" />
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FOOTER ACTION */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
            Need more help? 
            <button className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> Contact {activeTab === "customer" ? "Support" : "Merchant Desk"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}