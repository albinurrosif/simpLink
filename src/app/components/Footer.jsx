// components/Footer.jsx
export default function Footer() {
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-10">
    
      <aside>
        <p>Copyright © {currentYear} - KumpuLink by Albi Nur</p>
      </aside>
    </footer>
  );
}
