/**
 * SustainAI Tips Frontend
 * 
 * Main page component for the SustainAI Tips application.
 * Provides a user interface for generating personalized sustainability tips
 * based on location and habits. Features a responsive design with
 * animated cards and category-based organization.
 */

import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  // State management for form inputs and API response
  const [location, setLocation] = useState('');
  const [habits, setHabits] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form submission and API call to generate tips
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTips([]);

    try {
      // Make API request to backend
      const response = await axios.post('http://localhost:5000/api/tips', {
        location,
        habits,
      });
      setTips(response.data.tips);
    } catch (err) {
      setError('Failed to generate tips. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render tips organized in category-based cards
   * @returns JSX element containing the organized tips
   */
  const renderTipCards = () => {
    // Initialize categories for organizing tips
    const categories: { [key: string]: string[] } = {
      'Quick Wins': [],
      'Sustainable Living': [],
      'Transportation & Mobility': [],
      'Community & Social Impact': [],
      'Environmental Protection': [],
    };

    // Track current category and its tips
    let currentCategory = '';
    let currentTips: string[] = [];

    // Organize tips into categories
    tips.forEach((tip) => {
      // Check if this is a category header
      if (tip.startsWith('## ')) {
        // Extract category name from the header (e.g., "## 1. Quick Wins" -> "Quick Wins")
        const categoryMatch = tip.match(/## \d+\.\s*(.*?)(?:\s*\(.*\))?$/);
        if (categoryMatch) {
          currentCategory = categoryMatch[1];
          currentTips = [];
        }
      } else if (currentCategory && Object.keys(categories).includes(currentCategory)) {
        // Add the tip to the current category
        currentTips.push(tip);
        categories[currentCategory] = currentTips;
      }
    });

    // Render category cards
    return (
      <Row xs={1} md={2} lg={3} className="g-4 tips-container">
        {Object.entries(categories).map(([category, categoryTips]) => (
          categoryTips.length > 0 && (
            <Col key={category}>
              <Card className="tip-card h-100">
                <Card.Header className="category-header">
                  <div className="category-icon">
                    {getCategoryIcon(category)}
                  </div>
                  <Card.Title className="m-0">{category}</Card.Title>
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                  <div className="tip-content">
                    <ReactMarkdown>
                      {categoryTips.join('\n\n')}
                    </ReactMarkdown>
                  </div>
                  <div className="tip-footer">
                    <small className="text-muted">
                      {categoryTips.length} sustainable {categoryTips.length === 1 ? 'tip' : 'tips'}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        ))}
      </Row>
    );
  };

  /**
   * Get the appropriate icon for each category
   * @param category - Category name
   * @returns Emoji icon for the category
   */
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Quick Wins': '⚡',
      'Sustainable Living': '🌿',
      'Transportation & Mobility': '🚲',
      'Community & Social Impact': '🤝',
      'Environmental Protection': '🌍',
    };
    return icons[category] || '🌱';
  };

  return (
    <div className="app-wrapper">
      {/* Header Section */}
      <header className="app-header">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <h1 className="main-title">
                <span className="eco-icon">🌱</span> SustainAI Tips
              </h1>
              <p className="main-subtitle">
                Personalized sustainability tips powered by AI
              </p>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="main-content">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            {/* Input Form */}
            <Card className="form-card">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="location">
                    <Form.Label className="input-label">Your Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                      required
                      className="custom-input"
                    />
                    <Form.Text className="text-muted">
                      Enter your city or region for location-specific tips
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="habits">
                    <Form.Label className="input-label">Current Habits</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={habits}
                      onChange={(e) => setHabits(e.target.value)}
                      placeholder="Tell us about your daily habits (e.g., 'I drive to work, use single-use plastics')"
                      required
                      className="custom-input"
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      variant="success"
                      type="submit"
                      disabled={loading}
                      className="submit-button"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Generating Tips...
                        </>
                      ) : (
                        'Get Personalized Tips'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="danger" className="mt-4 error-alert">
                {error}
              </Alert>
            )}
          </Col>
        </Row>

        {/* Tips Display */}
        {tips.length > 0 && (
          <section className="tips-section">
            <h2 className="section-title">Your Personalized Tips</h2>
            {renderTipCards()}
          </section>
        )}
      </Container>

      {/* Footer */}
      <footer className="app-footer">
        <Container>
          <p className="text-center mb-0">
            Made with 💚 for a sustainable future
          </p>
        </Container>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --primary-color: #198754;
          --primary-dark: #146c43;
          --bg-color: #f8f9fa;
          --text-color: #2c3e50;
          --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --hover-transform: translateY(-5px);
          --transition-speed: 0.3s;
          --card-radius: 20px;
          --header-gradient: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        }

        body {
          color: var(--text-color);
          background-color: var(--bg-color);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: white;
          padding: 3rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }

        .eco-icon {
          font-size: 2.8rem;
          vertical-align: middle;
          margin-right: 0.5rem;
          animation: bounce 2s infinite;
        }

        .main-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          margin-bottom: 0;
        }

        .main-content {
          flex: 1;
          padding-bottom: 3rem;
        }

        .form-card {
          background: white;
          border: none;
          border-radius: 15px;
          box-shadow: var(--card-shadow);
          margin-bottom: 2rem;
          transition: transform var(--transition-speed);
        }

        .form-card:hover {
          transform: translateY(-3px);
        }

        .input-label {
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .custom-input {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem;
          transition: all var(--transition-speed);
        }

        .custom-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
        }

        .submit-button {
          padding: 0.8rem 2rem;
          font-weight: 600;
          border-radius: 30px;
          min-width: 200px;
          transition: all var(--transition-speed);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tips-section {
          margin-top: 3rem;
        }

        .section-title {
          text-align: center;
          color: var(--primary-color);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .tip-card {
          border: none;
          border-radius: var(--card-radius);
          box-shadow: var(--card-shadow);
          transition: all var(--transition-speed);
          height: 100%;
          background: white;
          overflow: hidden;
        }

        .tip-card:hover {
          transform: var(--hover-transform);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .category-header {
          background: var(--header-gradient);
          color: white;
          border-top-left-radius: var(--card-radius);
          border-top-right-radius: var(--card-radius);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .category-icon {
          font-size: 2rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(5px);
          transition: transform var(--transition-speed);
        }

        .tip-card:hover .category-icon {
          transform: scale(1.1);
        }

        .category-header .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .tip-content {
          padding: 1.5rem;
          flex-grow: 1;
        }

        .tip-content ul {
          list-style: none;
          padding-left: 0;
          margin-bottom: 0;
        }

        .tip-content li {
          position: relative;
          padding-left: 1.8rem;
          margin-bottom: 1.2rem;
          line-height: 1.6;
        }

        .tip-content li:before {
          content: '•';
          color: var(--primary-color);
          font-size: 1.5rem;
          position: absolute;
          left: 0.2rem;
          top: -0.2rem;
        }

        .tip-content strong {
          color: var(--primary-color);
          font-weight: 600;
        }

        .tip-content p {
          color: var(--text-color);
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .tip-content a {
          color: var(--primary-color);
          text-decoration: none;
          transition: color var(--transition-speed);
        }

        .tip-content a:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .tip-footer {
          padding: 1rem 1.5rem;
          background: var(--bg-color);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          font-size: 0.9rem;
        }

        /* Card animations */
        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tips-container .col {
          animation: cardAppear 0.5s ease-out forwards;
        }

        .tips-container .col:nth-child(1) { animation-delay: 0.1s; }
        .tips-container .col:nth-child(2) { animation-delay: 0.2s; }
        .tips-container .col:nth-child(3) { animation-delay: 0.3s; }
        .tips-container .col:nth-child(4) { animation-delay: 0.4s; }
        .tips-container .col:nth-child(5) { animation-delay: 0.5s; }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .app-header {
            padding: 2rem 0;
          }

          .main-title {
            font-size: 2rem;
          }

          .main-subtitle {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .tip-content {
            padding: 1.2rem;
          }

          .category-header {
            padding: 1.2rem;
          }

          .category-icon {
            font-size: 1.5rem;
            width: 2.5rem;
            height: 2.5rem;
          }

          .category-header .card-title {
            font-size: 1.2rem;
          }

          .tip-footer {
            padding: 0.8rem 1.2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;