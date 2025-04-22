
import './app.footer.scss'
import { FaTree, FaSchool } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-wave">
                <svg viewBox="0 0 1440 320">
                    <path fill="#81C784" fillOpacity="1"
                        d="M0,160L40,186.7C80,213,160,267,240,266.7C320,267,400,213,480,186.7C560,160,640,160,720,186.7C800,213,880,267,960,261.3C1040,256,1120,192,1200,170.7C1280,149,1360,171,1400,181.3L1440,192V320H0Z">
                    </path>
                </svg>
            </div>
            <div className="footer-content">
                <div className="footer-logo">
                    <FaSchool className="logo-icon" />
                    <span>Trường Đại Học Hồng Đức - Cây Xanh</span>
                </div>
                <p>🌱 Chung tay xây dựng môi trường xanh trong khuôn viên trường học! 🌱</p>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} {import.meta.env.VITE_TENTACGIA} | Trường Đại Học Hồng Đức
                </p>
            </div>
        </footer>
    );
};

export default Footer;
