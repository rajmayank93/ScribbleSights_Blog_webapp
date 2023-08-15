import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./header";

export default function Layout() {
  return (
    <main>
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
}
