"use client"

export const dynamic = 'force-dynamic'

import React from 'react'

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How do I create an account?</h2>
              <p className="text-gray-700">
                Click on the &quot;Register&quot; button in the top navigation, fill out the required information, 
                and verify your email address to activate your account.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How do I post a room listing?</h2>
              <p className="text-gray-700">
                After logging in, click on &quot;Create Listing&quot; in the navigation menu. Fill out all the 
                required details about your room, upload photos, and publish your listing.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Is there a fee for using Roomsy?</h2>
              <p className="text-gray-700">
                Basic account creation and browsing listings is free. We may charge fees for premium 
                features or promoted listings in the future.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How do I contact other users?</h2>
              <p className="text-gray-700">
                You can contact other users through our secure messaging system. Click on any listing 
                and use the contact form to send a message to the listing owner.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How do I edit my profile?</h2>
              <p className="text-gray-700">
                Navigate to your dashboard by clicking on your profile icon, then select &quot;Profile&quot; 
                to update your personal information, preferences, and profile picture.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">What if I have safety concerns?</h2>
              <p className="text-gray-700">
                Your safety is our priority. Always meet potential roommates in public places, 
                verify their identity, and report any suspicious behavior to our support team.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">How do I delete my account?</h2>
              <p className="text-gray-700">
                Contact our support team at support@roomsy.com to request account deletion. 
                Please note that this action is permanent and cannot be undone.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Can I edit or delete my listing?</h2>
              <p className="text-gray-700">
                Yes, you can edit or delete your listings from your dashboard. Navigate to 
                &quot;My Listings&quot; to manage all your posted rooms.
              </p>
            </div>

            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Still have questions?</h2>
              <p className="text-gray-700">
                If you can&apos;t find the answer you&apos;re looking for, please visit our{' '}
                <a href="/support" className="text-blue-600 hover:text-blue-800 underline">
                  Support page
                </a>{' '}
                or contact us directly at support@roomsy.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
