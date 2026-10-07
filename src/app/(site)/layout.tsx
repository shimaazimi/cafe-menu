import Header from "@/components/shared/Header";
import CartDock from "@/components/shared/CartDock";
import Footer from "@/components/shared/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDock />
    </>
  );
}
