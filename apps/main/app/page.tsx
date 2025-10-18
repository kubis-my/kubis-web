import Header from "@/component/pages/landing-page/header";
import Hero from "../components/pages/landing-page/hero";
import Footer from "../components/pages/landing-page/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
