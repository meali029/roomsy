import React from 'react'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Support</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Need help? We&apos;re here to assist you with any questions or issues you may have.
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span> support@roomsy.com
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span> +1 (555) 123-4567
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Hours:</span> Monday - Friday, 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I create a listing?</h3>
                  <p className="text-gray-700">
                    To create a listing, sign in to your account and click on &quot;Create Listing&quot; in the navigation menu. 
                    Fill out all required information and submit your listing for review.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">How do I contact other users?</h3>
                  <p className="text-gray-700">
                    You can contact other users through our secure messaging system. 
                    Click on a listing and use the &quot;Contact&quot; button to send a message.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Is my information secure?</h3>
                  <p className="text-gray-700">
                    Yes, we take your privacy and security seriously. All personal information is encrypted 
                    and we never share your data with third parties without your consent.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Report an Issue</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  If you encounter any technical issues or inappropriate content, 
                  please email us at <span className="font-medium">support@roomsy.com</span> with 
                  detailed information about the problem.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
