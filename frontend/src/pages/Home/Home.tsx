import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import './Home.css';
import Snowfall from 'react-snowfall';

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const features = [
    {
      icon: '🚶',
      title: 'Step Tracking',
      description: 'Точно считай свои шаги с умными алгоритмами',
      delay: 0.1,
    },
    {
      icon: '👥',
      title: 'Team Challenges',
      description: 'Соревнуйся с друзьями и командами в шагах',
      delay: 0.2,
    },
    {
      icon: '🏆',
      title: 'Leaderboards',
      description: 'Поднимайся вверх и смотри своё место в мире',
      delay: 0.3,
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Подробные данные о ходьбе и прогрессе',
      delay: 0.4,
    },
    {
      icon: '🎯',
      title: 'Goals',
      description: 'Ставь и достигай свои дневные и недельные цели',
      delay: 0.5,
    },
    {
      icon: '💬',
      title: 'Social',
      description: 'Общайся с друзьями и делись успехами',
      delay: 0.6,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="home">
      <Snowfall color="white"/>
      {/* Hero Section */}
      <section ref={heroRef} className="hero">
        <div className="container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate={isHeroInView ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants} className="hero-badge">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <span>New: Team Challenges Available</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="hero-title">
              Step Into
              <br />
              <span className="gradient-text">The Future</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="hero-description">
              Join thousands of walkers competing in daily step challenges.
              Track your progress, compete with friends, and achieve your fitness goals.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="hero-actions"
            >
              <Button variant="primary" size="large" onClick={() => navigate('/register')}>
                Get Started
              </Button>
              <Button variant="secondary" size="large" onClick={() => navigate('/groups')}>
                Learn More
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="hero-stats"
            >
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '1M+', label: 'Steps Tracked' },
                { value: '500+', label: 'Teams' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="stat-item"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={isHeroInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <div className="visual-card">
              <div className="visual-content">
                <motion.div
                  className="step-indicator"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="step-number">12,547</span>
                  <span className="step-label">Steps Today</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">
              Powerful <span className="gradient-text">Features</span>
            </h2>
            <p className="section-description">
              Everything you need to stay motivated and reach your fitness goals
            </p>
          </motion.div>

          <motion.div
            className="features-grid"
            variants={containerVariants}
            initial="hidden"
            animate={isFeaturesInView ? 'visible' : 'hidden'}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                custom={index}
              >
                <Card
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={feature.delay}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">
              Ready to Start Your Journey?
            </h2>
            <p className="cta-description">
              Join WalkWars today and take the first step towards a healthier lifestyle
            </p>
            <Button variant="primary" size="large" onClick={() => navigate('/register')}>
              Sign Up Free
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

