import Navbar from "./Navbar";

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <h1 className="text-3xl font-bold text-secondary mb-6">{title}</h1>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
