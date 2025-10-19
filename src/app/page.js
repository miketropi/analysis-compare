export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Analysis Compare
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Simple, powerful data comparison and analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-gray-900">Upload</h2>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop your analysis reports. We support multiple formats and process them automatically.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-gray-900">Compare</h2>
              <p className="text-gray-600 leading-relaxed">
                View reports side-by-side with clean, intuitive visualizations that highlight key differences.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-gray-900">Insights</h2>
              <p className="text-gray-600 leading-relaxed">
                Get actionable insights and trends from your data to make better decisions.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Upload area</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full text-sm font-medium transition-colors">
            Get Started
          </button>
          <div className="text-sm">
            <a 
              href="/setup" 
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Database Setup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
