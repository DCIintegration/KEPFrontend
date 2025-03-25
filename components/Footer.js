import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Portal Web</h3>
            <p className="footer-description">
              Una aplicación web moderna para gestionar tus proyectos y tareas.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Enlaces Rápidos</h3>
            <ul className="footer-links">
              <li><Link href="/dashboard"><span>Panel de Control</span></Link></li>
              <li><Link href="/profile"><span>Perfil</span></Link></li>
              <li><Link href="/settings"><span>Configuración</span></Link></li>
              <li><Link href="/help"><span>Centro de Ayuda</span></Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contacto</h3>
            <p className="contact-info">
              Correo: soporte@portalweb.com<br />
              Teléfono: +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Portal Web. Todos los derechos reservados.</p>
          <div className="footer-bottom-links">
            <Link href="/privacy"><span>Política de Privacidad</span></Link>
            <Link href="/terms"><span>Términos de Servicio</span></Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: #f9fafc;
          border-top: 1px solid #e0e0e0;
          padding: 50px 20px 20px;
          margin-top: auto;
        }
        
        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 30px;
        }
        
        .footer-title {
          font-size: 18px;
          color: #333333;
          margin-bottom: 15px;
        }
        
        .footer-description {
          color: #666666;
          line-height: 1.5;
        }
        
        .footer-links {
          list-style: none;
          padding: 0;
        }
        
        .footer-links li {
          margin-bottom: 10px;
        }
        
        .footer-links span {
          color: #4361ee;
          transition: color 0.3s;
          cursor: pointer;
        }
        
        .footer-links span:hover {
          color: #3a0ca3;
          text-decoration: underline;
        }
        
        .contact-info {
          color: #666666;
          line-height: 1.5;
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #888888;
          font-size: 14px;
        }
        
        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }
        
        .footer-bottom-links span {
          color: #666666;
          transition: color 0.3s;
          cursor: pointer;
        }
        
        .footer-bottom-links span:hover {
          color: #4361ee;
          text-decoration: underline;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}