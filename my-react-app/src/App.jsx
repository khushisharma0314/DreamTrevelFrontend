
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// =====================================================
// SCROLL TO TOP HELPER
// =====================================================

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
}

// =====================================================
// HEADER / FOOTER
// =====================================================

import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

// =====================================================
// HOME COMPONENTS
// =====================================================

import HeroSection from "./Components/HeroSection/HeroSection";
import FlightForm from "./Components/FlightForm/FlightForm";
import WhyChooseUs from "./Components/WhyChooseUs/WhyChooseUs";
import Destinations from "./Components/Destinations/Destinations";
import FeaturedCities from "./Components/FeaturedCities/FeaturedCities";
import FlightBenefits from "./Components/FlightBenefits/FlightBenefits";
import TravelFAQ from "./Components/TravelFAQ/TravelFAQ";

// =====================================================
// OTHER PAGES
// =====================================================

import About from "./Components/About/About";
import CancellationRefund from "./Components/CancellationRefund/CancellationRefund";
import ContactUs from "./Components/ContactUs/ContactUs";
import AdvertiserDisclosure from "./Components/AdvertiserDisclosure/AdvertiserDisclosure";
import FareDisclosure from "./Components/FareDisclosure/FareDisclosure";
import CaliforniaPrivacy from "./Components/CaliforniaPrivacy/CaliforniaPrivacy";
import CookiesPolicy from "./Components/CookiesPolicy/CookiesPolicy";
import PrivacyPolicy from "./Components/PrivacyPolicy/PrivacyPolicy";
import TermsConditions from "./Components/TermsConditions/TermsConditions";
import Disclaimer from "./Components/Disclaimer/Disclaimer";

// =====================================================
// FLIGHT / BOOKING
// =====================================================

import FlightResults from "./Components/FlightResults/FlightResults";
import FlightDetails from "./Components/FlightDetails/FlightDetails";
import SeatSelection from "./Components/SeatSelection/SeatSelection";
import AddOns from "./Components/AddOns/AddOns";
import BookingReview from "./Components/BookingReview/BookingReview";
import Payment from "./Components/Payment/Payment";
import BookingConfirmation from "./Components/BookingConfirmation/BookingConfirmation";

// =====================================================
// AUTH
// =====================================================

import Login from "./Components/Login/Login";
import ForgotPassword from "./Components/Login/ForgotPassword";
import ResetPassword from "./Components/Login/ResetPassword";
import MyProfile from "./Components/MyProfile/MyProfile";

// =====================================================
// MANAGE ACCOUNT
// =====================================================

import MyBookings from "./Components/MyBookings/MyBookings";
import AccountSettings from "./Components/AccountSettings/AccountSettings";


import "./App.css";

// =====================================================
// HOME PAGE
// =====================================================

function HomePage() {
  return (
    <>
      <div className="home-hero-band">
        <HeroSection />
        <FlightForm />
      </div>
      <WhyChooseUs />
      <Destinations />

      <FeaturedCities />
      <FlightBenefits />

      <TravelFAQ />
    </>
  );
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// =====================================================
// =====================================================
// APP CONTENT
// =====================================================

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {/* =================================================
          SCROLL TO TOP
      ================================================= */}
      <ScrollToTop />

      {/* =================================================
          HEADER
          Har page pe rahega
      ================================================= */}
      <Header />

      {/* =================================================
          PAGE CONTENT
      ================================================= */}
      <main className={`page-content ${isHomePage ? "home-page-content" : ""}`}>
        <Routes>
          {/* =================================================
              LOGIN
          ================================================= */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* =================================================
              FORGOT PASSWORD
              Public route
          ================================================= */}

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* =================================================
              RESET PASSWORD
              Public route
          ================================================= */}

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* =================================================
              HOME
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/"
            element={<HomePage />}
          />

          {/* =================================================
              FLIGHT RESULTS
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/flight-results"
            element={<FlightResults />}
          />

          {/* =================================================
              FLIGHT DETAILS / PASSENGER DETAILS
              PUBLIC ROUTE (Seamless guest booking flow)
          ================================================= */}

          <Route
            path="/flight-details"
            element={<FlightDetails />}
          />

          {/* =================================================
              SEAT SELECTION
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/seat-selection"
            element={<SeatSelection />}
          />

          {/* =================================================
              ADD-ONS
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/add-ons"
            element={<AddOns />}
          />

          {/* =================================================
              BOOKING REVIEW
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/booking-review"
            element={<BookingReview />}
          />

          {/* =================================================
              PAYMENT
              PROTECTED (Login required before payment/checkout)
          ================================================= */}

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              BOOKING CONFIRMATION
          ================================================= */}

          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              MY PROFILE
          ================================================= */}

          <Route
            path="/manage-account"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              MY BOOKINGS
          ================================================= */}

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ACCOUNT SETTINGS
          ================================================= */}

          <Route
            path="/account-settings"
            element={
              <ProtectedRoute>
                <AccountSettings />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ABOUT
              PUBLIC ROUTE
          ================================================= */}

          <Route
            path="/about"
            element={<About />}
          />

          {/* =================================================
              CANCELLATION / REFUND
              PUBLIC
          ================================================= */}

          <Route
            path="/cancellation-refund-policy"
            element={<CancellationRefund />}
          />

          {/* =================================================
              CONTACT US
              PUBLIC
          ================================================= */}

          <Route
            path="/contact-us"
            element={<ContactUs />}
          />

          {/* =================================================
              ADVERTISER DISCLOSURE
              PUBLIC
          ================================================= */}

          <Route
            path="/advertiser-disclosure"
            element={<AdvertiserDisclosure />}
          />

          {/* =================================================
              FARE DISCLOSURE
              PUBLIC
          ================================================= */}

          <Route
            path="/fare-disclosure-policy"
            element={<FareDisclosure />}
          />

          {/* =================================================
              CALIFORNIA PRIVACY
              PUBLIC
          ================================================= */}

          <Route
            path="/california-consumer-privacy-notice"
            element={<CaliforniaPrivacy />}
          />

          {/* =================================================
              COOKIES POLICY
              PUBLIC
          ================================================= */}

          <Route
            path="/cookies-policy"
            element={<CookiesPolicy />}
          />

          {/* =================================================
              PRIVACY POLICY
              PUBLIC
          ================================================= */}

          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />

          {/* =================================================
              TERMS & CONDITIONS
              PUBLIC
          ================================================= */}

          <Route
            path="/terms-and-conditions"
            element={<TermsConditions />}
          />

          {/* =================================================
              DISCLAIMER
              PUBLIC
          ================================================= */}

          <Route
            path="/disclaimer"
            element={<Disclaimer />}
          />

          {/* =================================================
              UNKNOWN URL
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

      {/* =================================================
          FOOTER
          Har page pe rahega
      ================================================= */}

      <Footer />

    </>
  );
}

// =====================================================
// APP ROOT
// =====================================================

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
