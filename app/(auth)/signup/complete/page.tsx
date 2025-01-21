export default function OnboardingCompletePage() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md p-6 bg-white shadow-md rounded-md text-center">
        <h1 className="text-2xl font-bold mb-4">Onboarding Complete!</h1>
        <p className="text-gray-600 mb-6">
          Congratulations! You have successfully completed the onboarding process. You can now start using the app.
        </p>
        <a
          href="https://www.getzealthy.com/"
          target="_blank"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full block text-center"
        >
          Go to the App
        </a>
        <p className="text-gray-500 text-sm mt-4">
          Need help?{' '}
          <a
            href="https://www.getzealthy.com/faqs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
