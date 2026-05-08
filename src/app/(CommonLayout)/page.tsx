import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { CTASection } from "@/components/sections/CTASection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FeaturedMedicines } from "@/components/sections/FeaturedMedicines";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";

export default function Home() {
  return (
    <main>
    
      <HeroSection />
      <CategoriesSection />
      <FeaturedMedicines />
      <FeaturesSection />
      <TestimonialsSection />
       <StatsSection />
       <FAQSection />
      <CTASection />
      <NewsletterSection />
     
        
    
    </main>
  );
}
