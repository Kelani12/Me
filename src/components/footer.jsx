import primaryLogo from "../../assets/Primary-logo1.png";

const styles = {
  footer: {
    borderTop: "1px solid #f2d9ea",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
    padding: "0px 24px 6px",
    textAlign: "center",
  },
  logoWrap: {
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    /* Rendered taller than logoWrap on purpose — the extra height pushes
       the PNG's built-in transparent margins above/below the mark outside
       the visible box, and overflow:hidden on the wrapper clips them off.
       Raise/lower this if too much or too little of the mark gets cropped. */
    height: "240px",
    width: "auto",
    objectFit: "contain",
  },
  text: {
    fontSize: "13px",
    color: "#6b5b73",
    margin: 0,
  },
};

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.logoWrap}>
        <img src={primaryLogo} alt="MenaCare" style={styles.logo} />
      </div>
      <p style={styles.text}>
        © {new Date().getFullYear()} MenaCare. Made with care for every woman.
      </p>
    </footer>
  );
}

export default Footer;
