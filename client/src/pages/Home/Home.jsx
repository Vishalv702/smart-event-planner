// src/pages/Home.jsx
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className='home'>
      <Navbar />
      
      <header className="banner bg-gradient-primary">
        <div className="banner-content animate-fadeInUp">
          <h1 className="text-gradient-primary" style={{ color: 'white', WebkitTextFillColor: 'white' }}>
            Plan Your Perfect Event
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Smart weather insights & seamless planning
          </p>
          <a href="/events" className="btn-theme-primary cta-button">
            Explore Events →
          </a>
        </div>
      </header>
      
      <section className="how-it-works">
        <h2 className="text-gradient-primary">How It Works</h2>
        <div className="steps">
          <div className="card-theme animate-fadeInUp">
            <h3>📅 Create Your Event</h3>
            <p>Fill in event details like name, location, and date</p>
          </div>
          <div className="card-theme animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <h3>🔍 Check Weather</h3>
            <p>We analyze weather and suggest better dates if needed</p>
          </div>
          <div className="card-theme animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <h3>🌟 Plan Seamlessly</h3>
            <p>Track updates, get tips, and manage your events easily</p>
          </div>
        </div>
      
      </section>

      <section className="why-choose-us">
        <h2 className="text-gradient-primary">Why EventEase?</h2>
        <div className="features-grid">
          <div className="feature-item animate-fadeInUp">
            <span className="text-success">✅</span>
            <span>Weather analysis</span>
          </div>
          <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <span className="text-success">✅</span>
            <span>Real-time suggestions</span>
          </div>
          <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <span className="text-success">✅</span>
            <span>Smooth event flow</span>
          </div>
          <div className="feature-item animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <span className="text-success">✅</span>
            <span>Free to use</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;