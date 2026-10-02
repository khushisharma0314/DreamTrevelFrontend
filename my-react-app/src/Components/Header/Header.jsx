import { useState, useRef, useEffect } from "react";
import {
  PhoneCall,
  Menu,
  X,
  User,
  Plane,
  Settings,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/logo.jpg";
import footerLogo from "../../assets/footer-logo.png";
import AuthModal from "../AuthModal/AuthModal";

const Header = () => {
  const [open, setOpen] = useState(false);

  // Desktop account dropdown
  const [accountOpen, setAccountOpen] = useState(false);

  // Mobile account dropdown - SEPARATE STATE
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const accountRef = useRef(null);

  // =====================================================
  // GET LOGGED-IN USER & REACTIVE AUTH STATE
  // =====================================================

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentToken, setCurrentToken] = useState(() =>
    localStorage.getItem("token")
  );

  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const stored = localStorage.getItem("user");
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }

      setCurrentToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const user = currentUser;
  const token = currentToken;

  // =====================================================
  // CLOSE DESKTOP ACCOUNT DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("googleUser");

    setCurrentUser(null);
    setCurrentToken(null);

    setOpen(false);
    setAccountOpen(false);
    setMobileAccountOpen(false);

    window.dispatchEvent(new Event("authChange"));

    if (
      [
        "/manage-account",
        "/my-bookings",
        "/account-settings",
        "/payment"
      ].includes(location.pathname)
    ) {
      navigate("/");
    }
  };

  // =====================================================
  // ACCOUNT MENU NAVIGATION
  // =====================================================

  const handleAccountNavigation = (path) => {
    setAccountOpen(false);
    setMobileAccountOpen(false);
    setOpen(false);

    navigate(path);
  };

  // =====================================================
  // MOBILE ACCOUNT TOGGLE
  // =====================================================

  const handleMobileAccountToggle = () => {
    setMobileAccountOpen((prev) => !prev);
  };

  // =====================================================
  // MOBILE MENU TOGGLE
  // =====================================================

  const handleMobileMenuToggle = () => {
    setOpen((prev) => {
      const nextState = !prev;

      // Menu close hone par account submenu bhi close
      if (prev) {
        setMobileAccountOpen(false);
      }

      return nextState;
    });
  };

  return (
    <div
      className={`header-wrapper ${isHomePage ? "is-home-header" : ""
        }`}
    >

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <header className="header">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <button
          type="button"
          className="logo logo-button"
          onClick={() => navigate("/")}
        >
          <img
            src={isHomePage ? footerLogo : logo}
            alt="Dream Travel"
          />
        </button>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="nav-links">

          <button
            type="button"
            onClick={() => navigate("/about")}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>

          <button
            type="button"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>

        </nav>


        {/* =====================================================
            PHONE
        ===================================================== */}

        <a
          href="tel:+18887526024"
          className="phone-box"
          aria-label="Call Dream Travel at +1-888-752-6024"
        >

          <div className="phone-icon-wrapper">

            <PhoneCall
              size={18}
              strokeWidth={2.2}
            />

          </div>

          <div className="phone-text">

            <span className="phone-title">
              Call Now
            </span>

          </div>

        </a>


        {/* =====================================================
            DESKTOP MANAGE ACCOUNT
        ===================================================== */}

        <div
          className="account-wrapper"
          ref={accountRef}
        >

          <button
            type="button"
            className="manage-account-btn"
            onClick={() => setAccountOpen((prev) => !prev)}
            aria-expanded={accountOpen}
            aria-label="Manage Account"
            title="Manage Account"
          >

            <User size={20} />

            <ChevronDown
              size={16}
              className={
                accountOpen
                  ? "account-chevron open"
                  : "account-chevron"
              }
            />

          </button>


          {/* =====================================================
              DESKTOP ACCOUNT DROPDOWN
          ===================================================== */}

          {accountOpen && (

            <div className="account-dropdown">

              {token ? (
                <>
                  {/* USER INFORMATION */}

                  <div className="account-user-info">

                    <div className="account-avatar">
                      <User size={20} />
                    </div>

                    <div className="account-user-details">

                      <span className="account-user-name">
                        {user?.name ||
                          user?.fullName ||
                          "User"}
                      </span>

                      <span className="account-user-email">
                        {user?.email ||
                          "Logged in user"}
                      </span>

                    </div>

                  </div>


                  <div className="account-divider" />


                  {/* MY PROFILE */}

                  <button
                    type="button"
                    className="account-menu-item"
                    onClick={() =>
                      handleAccountNavigation(
                        "/manage-account"
                      )
                    }
                  >

                    <User size={18} />

                    <span>
                      My Profile
                    </span>

                  </button>


                  {/* MY BOOKINGS */}

                  <button
                    type="button"
                    className="account-menu-item"
                    onClick={() =>
                      handleAccountNavigation(
                        "/my-bookings"
                      )
                    }
                  >

                    <Plane size={18} />

                    <span>
                      My Bookings
                    </span>

                  </button>


                  {/* ACCOUNT SETTINGS */}

                  <button
                    type="button"
                    className="account-menu-item"
                    onClick={() =>
                      handleAccountNavigation(
                        "/account-settings"
                      )
                    }
                  >

                    <Settings size={18} />

                    <span>
                      Account Settings
                    </span>

                  </button>


                  <div className="account-divider" />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="account-menu-item account-logout-item"
                    onClick={handleLogout}
                  >

                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>

                  </button>
                </>
              ) : (

                <div className="account-signin-wrap">

                  <button
                    type="button"
                    className="account-menu-item account-signin-item"
                    onClick={() => {
                      setAccountOpen(false);
                      setAuthModalOpen(true);
                    }}
                  >

                    <User size={18} />

                    <span>
                      Sign In / Register
                    </span>

                  </button>

                </div>

              )}

            </div>

          )}

        </div>


        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          type="button"
          className="menu-btn"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle Menu"
          aria-expanded={open}
        >

          {open ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}

        </button>

      </header>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (

        <div className="mobile-menu">

          {/* ABOUT */}

          <button
            type="button"
            onClick={() => {
              navigate("/about");
              setOpen(false);
              setMobileAccountOpen(false);
            }}
          >
            About Us
          </button>


          {/* MY BOOKINGS */}

          <button
            type="button"
            onClick={() => {
              navigate("/my-bookings");
              setOpen(false);
              setMobileAccountOpen(false);
            }}
          >
            My Bookings
          </button>


          {/* CONTACT */}

          <button
            type="button"
            onClick={() => {
              navigate("/contact-us");
              setOpen(false);
              setMobileAccountOpen(false);
            }}
          >
            Contact Us
          </button>


          {/* =====================================================
              MOBILE MANAGE ACCOUNT
          ===================================================== */}

          <button
            type="button"
            className="mobile-account-toggle"
            onClick={handleMobileAccountToggle}
            aria-expanded={mobileAccountOpen}
          >

            <span>
              Manage Account
            </span>

            <ChevronDown
              size={17}
              className={
                mobileAccountOpen
                  ? "account-chevron open"
                  : "account-chevron"
              }
            />

          </button>


          {/* =====================================================
              MOBILE ACCOUNT OPTIONS
          ===================================================== */}

          {mobileAccountOpen && (

            <div className="mobile-account-menu">

              {token ? (
                <>

                  {/* MY PROFILE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAccountNavigation(
                        "/manage-account"
                      )
                    }
                  >

                    <User size={17} />

                    <span>
                      My Profile
                    </span>

                  </button>


                  {/* MY BOOKINGS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAccountNavigation(
                        "/my-bookings"
                      )
                    }
                  >

                    <Plane size={17} />

                    <span>
                      My Bookings
                    </span>

                  </button>


                  {/* ACCOUNT SETTINGS */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAccountNavigation(
                        "/account-settings"
                      )
                    }
                  >

                    <Settings size={17} />

                    <span>
                      Account Settings
                    </span>

                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="mobile-logout-btn"
                    onClick={handleLogout}
                  >

                    <LogOut size={18} />

                    <span>
                      Logout
                    </span>

                  </button>

                </>
              ) : (

                <button
                  type="button"
                  className="mobile-signin-btn"
                  onClick={() => {
                    setOpen(false);
                    setMobileAccountOpen(false);
                    setAuthModalOpen(true);
                  }}
                >

                  <User size={17} />

                  <span>
                    Sign In / Register
                  </span>

                </button>

              )}

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          AUTH POPUP MODAL
      ===================================================== */}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
        }}
      />

    </div>
  );
};

export default Header;