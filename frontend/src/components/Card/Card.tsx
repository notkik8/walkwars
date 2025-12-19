import { motion } from 'framer-motion';
import './Card.css';

interface CardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

const Card = ({ icon, title, description, delay = 0 }: CardProps) => {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.6, -0.05, 0.01, 0.99] }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <motion.div
        className="card-icon"
        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <motion.div
        className="card-glow"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

export default Card;



