const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
        <span>&copy; {new Date().getFullYear()} CarCare AI</span>
        <span>Keep your car happy.</span>
      </div>
    </footer>
  );
};

export default Footer;
