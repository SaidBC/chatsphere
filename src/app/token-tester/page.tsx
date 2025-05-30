"use client";

import TokenTester from "@/components/TokenTester";

export default function TokenTesterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          ChatSphere API Token Tester
        </h1>
        <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          Use this page to test API tokens, view their decoded content, and verify if they are valid.
          You can also save valid tokens to localStorage for use in the application.
        </p>
        
        <TokenTester />
        
        <div className="mt-12 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">About API Tokens</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold mb-2 text-gray-700">Token Types:</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li><span className="font-semibold">USER</span> - For individual user authentication</li>
              <li><span className="font-semibold">CLIENT</span> - For application-level access</li>
            </ul>
            
            <h3 className="font-bold mb-2 text-gray-700">Token Structure:</h3>
            <p className="mb-2">JWT tokens contain three parts separated by dots:</p>
            <ol className="list-decimal pl-5 mb-4 space-y-1">
              <li><span className="font-medium">Header</span> - Contains token type and algorithm</li>
              <li><span className="font-medium">Payload</span> - Contains user data and permissions</li>
              <li><span className="font-medium">Signature</span> - Verifies the token's integrity</li>
            </ol>
            
            <h3 className="font-bold mb-2 text-gray-700">Token Format Example:</h3>
            <div className="bg-gray-100 p-3 rounded overflow-x-auto">
              <code className="text-sm">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTYiLCJ0eXBlIjowfQ.abc123signature
              </code>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Note: Tokens typically contain expiration dates. If a token has expired, you will need to generate a new one.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
