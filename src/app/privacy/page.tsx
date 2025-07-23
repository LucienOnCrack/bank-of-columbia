import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 23, 2025</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bank of Columbia ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information when you use our banking platform.
            </p>
            <p>
              This policy applies to information we collect through our Service and through your interactions with us.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Information from Roblox</h4>
            <p>When you authenticate through Roblox OAuth, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your Roblox User ID</li>
              <li>Your Roblox username and display name</li>
              <li>Your Roblox profile picture (if available)</li>
              <li>Account creation date</li>
              <li>Profile URL</li>
            </ul>

            <h4 className="font-semibold mt-4">Service Usage Information</h4>
            <p>We collect information about how you use our Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transaction history and financial activities</li>
              <li>Property ownership and assignment records</li>
              <li>Login and authentication logs</li>
              <li>API requests and usage patterns</li>
              <li>Device and browser information</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our banking services</li>
              <li>Authenticate and verify your identity</li>
              <li>Process transactions and maintain financial records</li>
              <li>Manage property assignments and ownership</li>
              <li>Prevent fraud and maintain security</li>
              <li>Improve our Service and user experience</li>
              <li>Comply with legal obligations</li>
              <li>Communicate with you about your account</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Information Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We do not sell, trade, or rent your personal information. We may share your information only in these situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>With your consent:</strong> When you explicitly agree to sharing</li>
              <li><strong>Service providers:</strong> Third parties who assist in Service operation (with strict confidentiality)</li>
              <li><strong>Legal compliance:</strong> When required by law or to protect rights and safety</li>
              <li><strong>Business transfers:</strong> In connection with mergers or acquisitions</li>
              <li><strong>Public information:</strong> Information you choose to make public (like usernames)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We implement comprehensive security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
              <li><strong>Access controls:</strong> Role-based permissions and row-level security</li>
              <li><strong>Authentication:</strong> Secure OAuth through Roblox</li>
              <li><strong>Monitoring:</strong> Continuous security monitoring and logging</li>
              <li><strong>Regular audits:</strong> Periodic security assessments</li>
              <li><strong>Infrastructure:</strong> Hosted on secure, compliant platforms</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide our services to you</li>
              <li>Maintain accurate financial records</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p>
              When information is no longer needed, we securely delete or anonymize it according to our data retention policies.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request information about the data we have about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing (where applicable)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Our Service integrates with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Roblox:</strong> For authentication and user information</li>
              <li><strong>Supabase:</strong> For secure data storage and management</li>
              <li><strong>Vercel:</strong> For application hosting and deployment</li>
            </ul>
            <p>
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our Service requires users to be 13 years or older, in compliance with Roblox's terms. 
              We do not knowingly collect personal information from children under 13. If we become aware 
              that we have collected such information, we will take steps to delete it promptly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers comply with applicable data protection laws and that appropriate 
              safeguards are in place to protect your information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last updated" date. Significant changes will be 
              communicated through additional means.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us through:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our support channels within the application</li>
              <li>The contact information provided on our platform</li>
              <li>Our designated privacy contact (when available)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 