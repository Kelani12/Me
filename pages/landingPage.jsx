import { CalendarHeart, HeartHandshake, Sparkles, ShieldCheck } from "lucide-react";

import Header from "../src/components/header";
import Footer from "../src/components/footer";
import heroWoman from "../assets/hero-woman.jpg";
import "./landingPage.css";

const features = [
  {
    icon: CalendarHeart,
    title: "Cycle tracking",
    body: "Log your period in seconds and see your next phase before it arrives.",
  },
  {
    icon: Sparkles,
    title: "Symptom insight",
    body: "Mood, cramps, sleep — patterns explained in plain, kind language.",
  },
  {
    icon: HeartHandshake,
    title: "Real support",
    body: "Guidance shaped with clinicians who take women's health seriously.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    body: "Your data stays yours. Always encrypted, never sold.",
  },
];

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-copy fade-up" style={{ animationDelay: "0ms" }}>
            <span className="eyebrow fade-up" style={{ animationDelay: "60ms" }}>
              MenaCare
            </span>
            <h1 className="hero-title">
              <span className="hero-title-ghost fade-up" style={{ animationDelay: "120ms" }}>
                Your body.
              </span>
              <br />
              <span className="hero-title-ghost fade-up" style={{ animationDelay: "200ms" }}>
                Your journey.
              </span>
              <br />
              <span className="hero-title-accent fade-up" style={{ animationDelay: "280ms" }}>
                We're here for you.
              </span>
            </h1>
            <p className="hero-subtitle fade-up" style={{ animationDelay: "360ms" }}>
              Track your period, learn your patterns and feel confident every step of the way —
              because her future shouldn't pause.
            </p>
            <div id="start" className="hero-actions fade-up" style={{ animationDelay: "440ms" }}>
              <a href="/signup" className="btn btn-primary">
                Get Started
              </a>
              <a href="/login" className="btn btn-outline">
                I already have an account
              </a>
            </div>
          </div>

          <div className="hero-image-wrap fade-in" style={{ animationDelay: "200ms" }}>
            <div className="hero-image-glow" aria-hidden="true" />
            <div className="hero-image-card">
              <img
                src={heroWoman}
                alt="Illustration of a woman smiling and hugging herself surrounded by blossoms"
                width={1024}
                height={1024}
                className="hero-image"
              />
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="features-inner">
            <h2 className="features-title fade-up">Gentle care, built around your cycle</h2>
            <div className="features-grid">
              {features.map(({ icon: Icon, title, body }, index) => (
                <div
                  key={title}
                  className="feature-card fade-up"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="feature-icon">
                    <Icon size={24} />
                  </span>
                  <h3 className="feature-card-title">{title}</h3>
                  <p className="feature-card-body">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-box fade-up">
            <h2 className="cta-title">
              Because her future <span className="cta-title-accent">shouldn't pause</span>
            </h2>
            <p className="cta-subtitle">
              Join the women learning their bodies with MenaCare — one calm, confident day at a time.
            </p>
            <a href="/signup" className="btn btn-secondary">
              Start free today
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
