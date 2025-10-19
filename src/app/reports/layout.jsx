import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReportsLayout({ children }) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
