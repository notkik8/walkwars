import { motion } from 'framer-motion';
import './Footer.css';
import { Github, Linkedin, Twitter } from 'lucide-react';




const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: ['Features', 'Pricing', 'Updates'],
    company: ['About', 'Blog', 'Careers'],
    resources: ['Documentation', 'Support', 'Community'],
    legal: ['Privacy', 'Terms', 'Cookies'],
  };

  const socialIcons = [
              { name: 'Twitter', icon: Twitter, href: '#twitter' },
              { name: 'GitHub', icon: Github, href: 'https://github.com/notkik8/walkwars' },
              { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' }
            ];

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="gradient-text">WalkWars</h3>
            <p className="footer-description">
              Step into the future of fitness challenges. Compete, connect, and conquer.
            </p>
            <div className="social-links">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={`#${social.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="footer-links">
            {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
              <motion.div
                key={category}
                className="footer-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + categoryIndex * 0.1 }}
              >
                <h4 className="footer-column-title">{category}</h4>
                <ul className="footer-column-links">
                  {links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + categoryIndex * 0.1 + linkIndex * 0.05 }}
                    >
                      <a href={`#${link.toLowerCase()}`} className="footer-link">
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p>&copy; {currentYear} WalkWars. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <span>•</span>
            <a href="#terms">Terms</a>
            <span>•</span>
            <a href="#cookies">Cookies</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;



