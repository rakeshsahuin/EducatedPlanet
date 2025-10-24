import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedTutors from "@/components/FeaturedTutors";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedTutors />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
