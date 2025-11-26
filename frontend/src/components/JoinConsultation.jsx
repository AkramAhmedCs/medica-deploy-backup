import DashboardLayout from "./DashboardLayout";

const JoinConsultation = () => {
  return (
    <DashboardLayout title="Video Consultation">
      <div className="bg-white p-12 rounded-lg shadow text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-4">
          Video Consultation Feature
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          The video consultation feature is coming soon! This will allow you to
          conduct virtual appointments with your patients directly through the
          platform.
        </p>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg max-w-xl mx-auto">
          <p className="font-semibold mb-2">Planned Features:</p>
          <ul className="text-left text-sm space-y-1">
            <li>• HD video and audio calls</li>
            <li>• Screen sharing capabilities</li>
            <li>• Chat messaging during consultation</li>
            <li>• Recording and playback (with consent)</li>
            <li>• Integration with appointment system</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JoinConsultation;

