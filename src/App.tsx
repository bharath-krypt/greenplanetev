import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductDetailProvider } from "./context/ProductDetailContext";
import { ProductFilterProvider } from "./context/ProductFilterContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { PartFinder } from "./components/PartFinder";
import { HorizontalCategoryMenu } from "./components/HorizontalCategoryMenu";
import { CategoryQuickGrid } from "./components/CategoryQuickGrid";
import { Products } from "./components/Products";
import { Features } from "./components/Features";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { SearchModal } from "./components/SearchModal";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { OnboardingTutorial } from "./components/OnboardingTutorial";

function App() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <ThemeProvider>
    <CartProvider>
    <ProductDetailProvider>
    <ProductFilterProvider>
      <Header onSearchOpen={() => setSearchOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <PartFinder />
        <div id="home-content">
          <div id="quick-order-list">
            <CategoryQuickGrid />
            <HorizontalCategoryMenu />
            <Products />
          </div>
        </div>
        <Features />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <ProductDetailModal />
      <WhatsAppButton />
      <OnboardingTutorial />
    </ProductFilterProvider>
    </ProductDetailProvider>
    </CartProvider>
    </ThemeProvider>
  );
}

export default App;
