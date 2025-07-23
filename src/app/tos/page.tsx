import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: January 23, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing and using Bank of Columbia ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              This Service is designed exclusively for Roblox users and requires a valid Roblox account for authentication and access.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bank of Columbia is a secure banking platform that provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Virtual banking services for Roblox users</li>
              <li>Property management and tracking systems</li>
              <li>Transaction history and financial records</li>
              <li>Role-based access control (User, Employee, Admin)</li>
              <li>Secure authentication through Roblox OAuth</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To use our Service, you must:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Have a valid Roblox account</li>
              <li>Be 13 years of age or older (in compliance with Roblox's terms)</li>
              <li>Provide accurate and complete information when creating your account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Engage in fraudulent activities or money laundering</li>
              <li>Attempt to gain unauthorized access to other user accounts</li>
              <li>Use automated scripts or bots to interact with the Service</li>
              <li>Disrupt or interfere with the Service's operation</li>
              <li>Violate Roblox's Terms of Service or Community Guidelines</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Financial Services and Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bank of Columbia provides virtual banking services within the Roblox ecosystem:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All transactions are virtual and occur within the Service</li>
              <li>We maintain detailed records of all financial activities</li>
              <li>Property assignments and transfers are tracked and logged</li>
              <li>Users are responsible for monitoring their account activities</li>
              <li>Suspicious activities may result in account restrictions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. 
              By using the Service, you consent to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Secure OAuth authentication through Roblox</li>
              <li>Encrypted data transmission and storage</li>
              <li>Row-level security policies on all database operations</li>
              <li>Regular security audits and monitoring</li>
              <li>Role-based access controls</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Service is provided "as is" without any warranties. We shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes. 
              Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms of Service, please contact us through our support channels 
              or via the contact information provided on our platform.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 