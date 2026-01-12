"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/90 to-bg-dark" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="bg-bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-marker text-4xl md:text-5xl text-brown-primary mb-4">
              🔒 Privacy Policy
            </h1>
            <p className="text-cream-muted">
              Last updated: January 12, 2026
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8 text-text-secondary">
            
            {/* Introduction */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">1. Introduction</h2>
              <p>
                Niggascreena (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency token screening platform and services (the &quot;Service&quot;).
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
              <p>
                We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the &quot;Last updated&quot; date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl text-cream-primary mt-6 mb-3">2.1 Information Automatically Collected</h3>
              <p>
                When you access our Service, we may automatically collect certain information about your device and usage, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Device Information:</strong> Browser type and version, operating system, device type, screen resolution, and device identifiers</li>
                <li><strong className="text-cream-primary">Log Data:</strong> IP address, access times, pages viewed, time spent on pages, links clicked, and the page you visited before navigating to our Service</li>
                <li><strong className="text-cream-primary">Usage Data:</strong> Features used, tokens searched or viewed, filters applied, and interaction patterns</li>
                <li><strong className="text-cream-primary">Location Data:</strong> General geographic location based on IP address (country/region level only)</li>
                <li><strong className="text-cream-primary">Cookies and Similar Technologies:</strong> Data collected through cookies, pixel tags, web beacons, and similar technologies</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">2.2 Information You Provide</h3>
              <p>
                We may collect information that you voluntarily provide to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Contact Information:</strong> If you contact us via social media or other channels</li>
                <li><strong className="text-cream-primary">Feedback:</strong> Comments, suggestions, or bug reports you submit</li>
                <li><strong className="text-cream-primary">Wallet Addresses:</strong> If you choose to connect a wallet or input addresses for tracking (note: we do not store private keys)</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">2.3 Blockchain Data</h3>
              <p>
                Our Service displays publicly available blockchain data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Token contract addresses and metadata</li>
                <li>Transaction histories and trading volumes</li>
                <li>Wallet addresses and their holdings</li>
                <li>Liquidity pool information</li>
                <li>Smart contract interactions</li>
              </ul>
              <p>
                This data is publicly available on the Solana blockchain and is not considered personal information in most jurisdictions. However, we are committed to responsible data handling practices.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">3. How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              
              <h3 className="text-xl text-cream-primary mt-6 mb-3">3.1 Service Provision and Improvement</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, operate, and maintain our Service</li>
                <li>To improve, personalize, and expand our Service</li>
                <li>To understand and analyze how you use our Service</li>
                <li>To develop new products, services, features, and functionality</li>
                <li>To optimize user experience and interface design</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">3.2 Communication</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your comments, questions, and requests</li>
                <li>To provide customer support and assistance</li>
                <li>To send you technical notices, updates, and security alerts</li>
                <li>To communicate about new features or changes to the Service</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">3.3 Analytics and Research</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To monitor and analyze trends, usage, and activities</li>
                <li>To measure the effectiveness of our Service</li>
                <li>To conduct research and analysis to improve our offerings</li>
                <li>To generate aggregated, anonymized statistics</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">3.4 Security and Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To detect, prevent, and address technical issues</li>
                <li>To protect against malicious, deceptive, fraudulent, or illegal activity</li>
                <li>To enforce our Terms of Service and other policies</li>
                <li>To comply with legal obligations and regulatory requirements</li>
              </ul>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">4. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect and store information about your use of our Service.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">4.1 Types of Cookies We Use</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Essential Cookies:</strong> Required for the Service to function properly. These cannot be disabled.</li>
                <li><strong className="text-cream-primary">Performance Cookies:</strong> Help us understand how visitors interact with the Service by collecting anonymous information.</li>
                <li><strong className="text-cream-primary">Functionality Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
                <li><strong className="text-cream-primary">Analytics Cookies:</strong> Allow us to measure and improve the performance of our Service.</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">4.2 Managing Cookies</h3>
              <p>
                Most web browsers are set to accept cookies by default. You can usually modify your browser settings to decline cookies if you prefer. However, this may prevent you from taking full advantage of the Service. You can also clear cookies from your browser at any time.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">4.3 Do Not Track</h3>
              <p>
                Some browsers have a &quot;Do Not Track&quot; feature that signals to websites that you do not want your online activity tracked. We currently do not respond to DNT signals, but we are committed to providing you with choices about the data we collect.
              </p>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">5. Information Sharing and Disclosure</h2>
              <p>
                We may share information we collect in the following circumstances:
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">5.1 Service Providers</h3>
              <p>
                We may share your information with third-party service providers who perform services on our behalf, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hosting and infrastructure providers (e.g., Vercel)</li>
                <li>Analytics providers (e.g., privacy-focused analytics)</li>
                <li>Data providers (e.g., Codex, DexScreener, GeckoTerminal)</li>
                <li>Content delivery networks</li>
              </ul>
              <p>
                These service providers are contractually obligated to use your information only for the purposes of providing services to us and in accordance with this Privacy Policy.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">5.2 Legal Requirements</h3>
              <p>
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency), including to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with a legal obligation</li>
                <li>Protect and defend our rights or property</li>
                <li>Prevent or investigate possible wrongdoing</li>
                <li>Protect the personal safety of users or the public</li>
                <li>Protect against legal liability</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">5.3 Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of assets, your information may be transferred as part of that transaction. We will provide notice before your information is transferred and becomes subject to a different privacy policy.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">5.4 Aggregated or Anonymized Data</h3>
              <p>
                We may share aggregated or anonymized information that cannot reasonably be used to identify you. This includes general statistics about Service usage, popular tokens, and market trends.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security of any information we process. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
              <p>
                Our security measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of data in transit using TLS/SSL</li>
                <li>Regular security assessments and monitoring</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure hosting infrastructure</li>
                <li>Regular software updates and security patches</li>
              </ul>
              <p>
                While we strive to protect your information, we cannot guarantee its absolute security. You are responsible for maintaining the security of any devices or accounts you use to access our Service.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">7. Data Retention</h2>
              <p>
                We retain your information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Usage Data:</strong> Retained for up to 24 months for analytics purposes</li>
                <li><strong className="text-cream-primary">Log Data:</strong> Retained for up to 12 months for security and debugging</li>
                <li><strong className="text-cream-primary">Cookies:</strong> Vary by type; see our cookie settings for specific durations</li>
                <li><strong className="text-cream-primary">Aggregated Data:</strong> May be retained indefinitely as it cannot identify individuals</li>
              </ul>
              <p>
                When we no longer need to retain your information, we will securely delete or anonymize it.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">8. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">8.1 General Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Access:</strong> Request access to your personal information</li>
                <li><strong className="text-cream-primary">Correction:</strong> Request correction of inaccurate information</li>
                <li><strong className="text-cream-primary">Deletion:</strong> Request deletion of your personal information</li>
                <li><strong className="text-cream-primary">Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong className="text-cream-primary">Objection:</strong> Object to certain processing of your information</li>
                <li><strong className="text-cream-primary">Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">8.2 European Economic Area (EEA) Residents</h3>
              <p>
                If you are a resident of the EEA, you have additional rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with a supervisory authority.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">8.3 California Residents</h3>
              <p>
                California residents have additional rights under the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to know what personal information is collected</li>
                <li>The right to know whether personal information is sold or disclosed and to whom</li>
                <li>The right to say no to the sale of personal information</li>
                <li>The right to equal service and price, even if you exercise your privacy rights</li>
              </ul>
              <p>
                We do not sell your personal information as defined under CCPA.
              </p>

              <h3 className="text-xl text-cream-primary mt-6 mb-3">8.4 Exercising Your Rights</h3>
              <p>
                To exercise any of these rights, please contact us using the contact information provided below. We will respond to your request within a reasonable timeframe and in accordance with applicable law.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">9. Children&apos;s Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
              </p>
              <p>
                If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">10. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
              </p>
              <p>
                By using our Service, you consent to the transfer of your information to countries outside of your country of residence, including the United States, which may have different data protection rules.
              </p>
              <p>
                We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy when transferred internationally.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">11. Third-Party Links and Services</h2>
              <p>
                Our Service may contain links to third-party websites, services, and applications, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Decentralized exchanges (DEXs)</li>
                <li>Blockchain explorers</li>
                <li>Social media platforms</li>
                <li>Token launch platforms</li>
                <li>Analytics and data providers</li>
              </ul>
              <p>
                We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access through our Service.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
              </p>
              <p>
                For significant changes, we may also provide additional notice, such as adding a statement to our homepage or sending you a notification. You are advised to review this Privacy Policy periodically for any changes.
              </p>
              <p>
                Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the Service after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">13. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Twitter/X: <a href="https://x.com/nscreena" className="text-brown-primary hover:underline">@nscreena</a></li>
                <li>GitHub: <a href="https://github.com/nscreena/nscreena" className="text-brown-primary hover:underline">github.com/nscreena/nscreena</a></li>
              </ul>
              <p className="mt-4">
                We will make every effort to respond to your inquiries in a timely manner.
              </p>
            </section>

            {/* Summary */}
            <section className="mt-12 p-6 bg-bg-elevated rounded-xl border border-border">
              <h2 className="font-marker text-2xl text-brown-primary mb-4">📋 Privacy Summary</h2>
              <p className="mb-4">
                Here&apos;s a quick summary of our privacy practices:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>✅ We collect minimal data necessary to provide our Service</li>
                <li>✅ We do NOT sell your personal information</li>
                <li>✅ We do NOT store cryptocurrency private keys</li>
                <li>✅ We use industry-standard security measures</li>
                <li>✅ We respect your privacy rights</li>
                <li>✅ We are transparent about our data practices</li>
                <li>✅ We only share data with trusted service providers</li>
                <li>✅ You can contact us anytime with questions</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
