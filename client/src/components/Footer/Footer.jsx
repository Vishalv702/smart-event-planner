import './Footer.css';
import { FaGithub, FaLinkedin ,FaFileAlt} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">© 2025 <span className="text-gradient-primary">EventEase</span>. All rights reserved.</p>

      <div className="footer-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>

      <div className="footer-icons">
        <a
          href="https://github.com/Vishalv702/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/vishalvasu07"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={20} />
        </a>
        <a
  href="https://drive.google.com/file/d/1MMyc6sbzUGau9jKrNsRAFWcFdOjVdV41/view?usp=sharing"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Resume"
>
  <FaFileAlt size={20} />
</a>
      </div>
    </footer>
  );
};

export default Footer;
