import Header from "@/components/shared/Header";
import CartDock from "@/components/shared/CartDock";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <CartDock />
    </>
  );
}
