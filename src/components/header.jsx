import { Link } from "react-router-dom";
import secondaryLogo from "../../assets/Secondary-logo2.png";

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    width: "100%",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 250, 253, 0.85)",
    borderBottom: "1px solid rgba(255, 153, 216, 0.25)",
  },
  inner: {
    maxWidth: "1152px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 24px",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    height: "60px",
    overflow: "visible",
  },
  logo: {
    height: "100%",
    width: "auto",
    display: "block",
    objectFit: "contain",
    objectPosition: "left center",
    /* translateY is applied AFTER scale (rightmost function runs first),
       so this is a clean, fixed 10px nudge down regardless of scale size —
       change the scale factor freely without the offset drifting. */
    transform: "translateY(10px) scale(2.4)",
    transformOrigin: "left center",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  },
  featuresLink: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b5b73",
    textDecoration: "none",
  },
  ctaButton: {
    borderRadius: "9999px",
    backgroundColor: "#64007D",
    color: "#fff8fb",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 24px 60px -28px rgba(100, 0, 125, 0.45)",
    transition: "opacity 0.2s ease",
  },
};

function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logoLink}>
          <img src={secondaryLogo} alt="MenaCare" style={styles.logo} />
        </Link>
        <nav style={styles.nav}>
          <a href="/#features" style={styles.featuresLink} className="header-features-link">
            Features
          </a>
          <Link
            to="/signup"
            className="btn btn-primary"
            style={styles.ctaButton}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
