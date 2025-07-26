import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    Users,
    BookOpen,
    Calendar,
    MessageSquare,
    Star,
    ChevronRight,
    Menu,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation handlers
    const handleSignIn = () => {
        navigate('/login');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    const features = [
        {
            icon: <BookOpen size={40} />,
            title: "Academic Management",
            description: "Access grades, assignments, and course materials in one centralized platform."
        },
        {
            icon: <Calendar size={40} />,
            title: "Event Scheduling",
            description: "Stay updated with campus events, exam schedules, and important deadlines."
        },
        {
            icon: <Users size={40} />,
            title: "Community Connect",
            description: "Connect with fellow students, faculty, and staff across departments."
        },
        {
            icon: <MessageSquare size={40} />,
            title: "Communication Hub",
            description: "Seamless messaging and announcements between students and administration."
        }
    ];

    const reviews = [
        {
            name: "Priya Sharma",
            role: "Computer Science Student",
            userType: "student",
            rating: 5,
            comment: "CampusLink has revolutionized how I manage my academic life. Everything I need is just a click away!"
        },
        {
            name: "Dr. Rajesh Kumar",
            role: "Professor, Mechanical Engineering",
            userType: "staff",
            rating: 5,
            comment: "An excellent platform that bridges the gap between faculty and students. Highly efficient and user-friendly."
        },
        {
            name: "Ananya Patel",
            role: "Final Year ECE Student",
            userType: "student",
            rating: 5,
            comment: "The best campus utility app I've used. Makes staying organized and connected so much easier."
        },
        {
            name: "Prof. Meera Iyer",
            role: "Head of Department, CSE",
            userType: "staff",
            rating: 5,
            comment: "CampusLink streamlines our administrative processes and enhances student engagement significantly."
        }
    ];

    return (
        <div className="landing-page">
            <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #FFF5E0 0%, #FFEBEB 50%, #FFF5E0 100%);
        }

        /* Navigation Styles */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 2rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 105, 105, 0.1);
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideInLeft 0.8s ease-out;
          cursor: pointer;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FF6969, #BB2525);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: pulse 2s infinite;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: #BB2525;
          background: linear-gradient(135deg, #BB2525, #FF6969);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-buttons {
          display: flex;
          gap: 16px;
          animation: slideInRight 0.8s ease-out;
        }

        .nav-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          border: none;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sign-in-btn {
          background: transparent;
          color: #BB2525;
          border: 2px solid #FF6969;
        }

        .sign-in-btn:hover {
          background: #FF6969;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 105, 105, 0.3);
        }

        .sign-up-btn {
          background: linear-gradient(135deg, #FF6969, #BB2525);
          color: white;
          animation: buttonPulse 2s infinite;
        }

        .sign-up-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 105, 105, 0.4);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #BB2525;
          cursor: pointer;
          padding: 8px;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          z-index: 999;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
          animation: fadeIn 0.3s ease-out;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-menu-btn-large {
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          min-width: 200px;
        }

        .mobile-sign-in {
          background: transparent;
          color: #BB2525;
          border: 2px solid #FF6969;
        }

        .mobile-sign-up {
          background: linear-gradient(135deg, #FF6969, #BB2525);
          color: white;
        }

        /* Hero Section */
        .hero-section {
          padding: 120px 2rem 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-message {
          margin-bottom: 60px;
          animation: fadeInUp 1s ease-out 0.3s both;
        }

        .welcome-title {
          font-size: 3.5rem;
          font-weight: 800;
          color: #BB2525;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #BB2525, #FF6969);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-subtitle {
          font-size: 1.4rem;
          color: #666;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .quote-section {
          font-size: 1.1rem;
          font-style: italic;
          color: #888;
          position: relative;
          padding: 20px 0;
        }

        .quote-section::before,
        .quote-section::after {
          content: '"';
          font-size: 2rem;
          color: #FF6969;
          font-weight: bold;
        }

        /* Call to Action Buttons in Hero */
        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 40px;
          animation: fadeInUp 1s ease-out 0.5s both;
        }

        .cta-btn {
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cta-primary {
          background: linear-gradient(135deg, #FF6969, #BB2525);
          color: white;
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 105, 105, 0.4);
        }

        .cta-secondary {
          background: transparent;
          color: #BB2525;
          border: 2px solid #FF6969;
        }

        .cta-secondary:hover {
          background: #FF6969;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(255, 105, 105, 0.4);
        }

        /* Features Section */
        .features-section {
          padding: 80px 2rem;
          background: rgba(255, 255, 255, 0.5);
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #BB2525;
          margin-bottom: 20px;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 105, 105, 0.1);
          animation: fadeInUp 0.8s ease-out;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }

        .feature-icon {
          color: #FF6969;
          margin-bottom: 20px;
          animation: float 3s ease-in-out infinite;
        }

        .feature-title {
          font-size: 1.4rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 16px;
        }

        .feature-description {
          color: #666;
          line-height: 1.6;
        }

        /* Reviews Section */
        .reviews-section {
          padding: 80px 2rem;
        }

        .reviews-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .review-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 105, 105, 0.1);
          animation: fadeInUp 0.8s ease-out;
        }

        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 16px;
        }

        .reviewer-info h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .reviewer-role {
          font-size: 0.9rem;
          color: #666;
        }

        .user-type-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .student-badge {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: white;
        }

        .staff-badge {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .rating {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }

        .star {
          color: #fbbf24;
        }

        .review-comment {
          color: #555;
          line-height: 1.6;
          font-style: italic;
        }

        /* Animations */
        @keyframes slideInLeft {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes buttonPulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(255, 105, 105, 0.3); }
          50% { box-shadow: 0 6px 20px rgba(255, 105, 105, 0.5); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-buttons {
            display: none;
          }

          .mobile-menu-btn {
            display: block;
          }

          .welcome-title {
            font-size: 2.5rem;
          }

          .welcome-subtitle {
            font-size: 1.2rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .hero-section {
            padding: 100px 1rem 60px;
          }

          .features-section,
          .reviews-section {
            padding: 60px 1rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 1rem;
          }

          .welcome-title {
            font-size: 2rem;
          }

          .quote-section {
            font-size: 1rem;
          }
        }
      `}</style>

            {/* Navigation */}
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="logo-section" onClick={() => navigate('/')}>
                        <div className="logo-icon">
                            <GraduationCap size={24} />
                        </div>
                        <div className="logo-text">CampusLink</div>
                    </div>

                    <div className="nav-buttons">
                        <button className="nav-btn sign-in-btn" onClick={handleSignIn}>
                            Sign In
                        </button>
                        <button className="nav-btn sign-up-btn" onClick={handleSignUp}>
                            Sign Up <ChevronRight size={16} style={{ marginLeft: '4px' }} />
                        </button>
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="mobile-menu-btn-large mobile-sign-in" onClick={handleSignIn}>
                    Sign In
                </button>
                <button className="mobile-menu-btn-large mobile-sign-up" onClick={handleSignUp}>
                    Sign Up
                </button>
            </div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="welcome-message">
                        <h1 className="welcome-title">Welcome to CampusLink</h1>
                        <p className="welcome-subtitle">Your Gateway to Academic Excellence</p>
                        <div className="quote-section">
                            Empowering education through seamless connectivity and innovation
                        </div>

                        {/* Call to Action Buttons */}
                        <div className="cta-buttons">
                            <button className="cta-btn cta-primary" onClick={handleSignUp}>
                                Get Started <ChevronRight size={20} />
                            </button>
                            <button className="cta-btn cta-secondary" onClick={handleSignIn}>
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-container">
                    <h2 className="section-title">How CampusLink Works</h2>
                    <p className="section-subtitle">Discover the powerful features that make campus life easier</p>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.2}s` }}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="reviews-container">
                    <h2 className="section-title">What Our Community Says</h2>
                    <p className="section-subtitle">Hear from students and staff who love using CampusLink</p>

                    <div className="reviews-grid">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-card" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <h4>{review.name}</h4>
                                        <p className="reviewer-role">{review.role}</p>
                                    </div>
                                    <span className={`user-type-badge ${review.userType}-badge`}>
                                        {review.userType}
                                    </span>
                                </div>

                                <div className="rating">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="star" fill="currentColor" />
                                    ))}
                                </div>

                                <p className="review-comment">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;