import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";

function Layout({ children }) {

  return (

    <div className="app-wrapper">

      <Navbar />

      <MobileMenu />

      <main className="main-content">
        {children}
      </main>

      <Footer />

    </div>

  );
}

export default Layout;