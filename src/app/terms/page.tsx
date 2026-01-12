"use client";

export default function TermsPage() {
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
              📜 Terms of Service
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
                Welcome to Niggascreena (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Niggascreena website, platform, and services (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
              <p>
                Niggascreena is a cryptocurrency token screening and analytics platform focused on the Solana blockchain ecosystem. We provide real-time data, charts, and information about various tokens to help users make informed decisions.
              </p>
              <p>
                <strong className="text-cream-primary">IMPORTANT:</strong> Cryptocurrency trading involves substantial risk of loss and is not suitable for every investor. The valuation of cryptocurrencies may fluctuate, and you may lose some or all of your investment. You should carefully consider whether trading or holding cryptocurrencies is suitable for you in light of your financial condition.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">2. Eligibility</h2>
              <p>
                To use our Service, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age or the age of majority in your jurisdiction, whichever is higher</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be a resident of any jurisdiction where the use of cryptocurrency services is prohibited</li>
                <li>Not be subject to economic or trade sanctions administered by any governmental authority</li>
                <li>Not be on any list of prohibited or restricted parties</li>
              </ul>
              <p>
                By using our Service, you represent and warrant that you meet all eligibility requirements. We reserve the right to verify your eligibility at any time.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">3. Service Description</h2>
              <p>
                Niggascreena provides the following services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Token Screening:</strong> Real-time display of new, trending, and recently migrated tokens on the Solana blockchain</li>
                <li><strong className="text-cream-primary">Price Charts:</strong> Historical price and market cap data visualization</li>
                <li><strong className="text-cream-primary">Token Analytics:</strong> Detailed information including holder distribution, trading volume, liquidity, and more</li>
                <li><strong className="text-cream-primary">Security Indicators:</strong> Risk metrics such as sniper activity, bundler detection, and insider holdings</li>
                <li><strong className="text-cream-primary">KOL Tracking:</strong> Monitoring of known Key Opinion Leader (KOL) wallet activities</li>
              </ul>
              <p>
                Our Service is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We do not guarantee the accuracy, completeness, or timeliness of any information displayed on our platform.
              </p>
            </section>

            {/* No Financial Advice */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">4. No Financial Advice</h2>
              <p>
                <strong className="text-red">THE INFORMATION PROVIDED ON NIGGASCREENA IS FOR INFORMATIONAL PURPOSES ONLY AND DOES NOT CONSTITUTE FINANCIAL, INVESTMENT, TRADING, OR ANY OTHER TYPE OF ADVICE.</strong>
              </p>
              <p>
                You acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are not a registered investment advisor, broker-dealer, or financial planner</li>
                <li>Nothing on our Service should be construed as a recommendation to buy, sell, or hold any cryptocurrency</li>
                <li>Past performance of any token is not indicative of future results</li>
                <li>You are solely responsible for your own investment decisions</li>
                <li>You should consult with qualified professionals before making any financial decisions</li>
                <li>We do not endorse any tokens displayed on our platform</li>
              </ul>
              <p>
                The display of any token on our platform does not constitute an endorsement or recommendation. Many tokens displayed may be scams, rug pulls, or otherwise fraudulent projects.
              </p>
            </section>

            {/* Risk Disclosure */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">5. Risk Disclosure</h2>
              <p>
                Cryptocurrency trading carries significant risks, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-cream-primary">Market Risk:</strong> Cryptocurrency prices are highly volatile and can decline rapidly</li>
                <li><strong className="text-cream-primary">Liquidity Risk:</strong> You may not be able to sell tokens when desired or at favorable prices</li>
                <li><strong className="text-cream-primary">Regulatory Risk:</strong> Cryptocurrency regulations may change, potentially affecting your holdings</li>
                <li><strong className="text-cream-primary">Technology Risk:</strong> Smart contracts may contain bugs or vulnerabilities</li>
                <li><strong className="text-cream-primary">Fraud Risk:</strong> Many cryptocurrency projects are scams designed to steal funds</li>
                <li><strong className="text-cream-primary">Rug Pull Risk:</strong> Developers may abandon projects or drain liquidity pools</li>
                <li><strong className="text-cream-primary">MEV Risk:</strong> Your transactions may be front-run or sandwiched by bots</li>
                <li><strong className="text-cream-primary">Loss of Access:</strong> Losing your private keys means permanent loss of funds</li>
              </ul>
              <p>
                You should only invest money you can afford to lose entirely. Never invest funds needed for essential expenses, retirement, or emergencies.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">6. User Conduct</h2>
              <p>
                When using our Service, you agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; data</li>
                <li>Interfere with or disrupt the Service or servers/networks connected to it</li>
                <li>Use automated systems, bots, or scripts to scrape or extract data</li>
                <li>Attempt to reverse engineer, decompile, or disassemble any part of the Service</li>
                <li>Transmit any malware, viruses, or harmful code</li>
                <li>Impersonate any person or entity</li>
                <li>Use the Service to promote illegal activities or scam projects</li>
                <li>Circumvent any security measures or access restrictions</li>
                <li>Use the Service to manipulate markets or engage in wash trading</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate your access to the Service for violations of these Terms.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">7. Intellectual Property</h2>
              <p>
                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, and software, are the exclusive property of Niggascreena or its licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes. This license does not include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to modify or create derivative works</li>
                <li>The right to use any data mining, robots, or similar data gathering tools</li>
                <li>The right to download or copy account information for commercial purposes</li>
                <li>The right to resell or make commercial use of the Service</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">8. Third-Party Services</h2>
              <p>
                Our Service may contain links to or integrate with third-party websites, services, or resources, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Decentralized exchanges (DEXs) like Raydium, Jupiter, and others</li>
                <li>Blockchain explorers like Solscan</li>
                <li>Data providers like DexScreener, GeckoTerminal, and Codex</li>
                <li>Social media platforms like Twitter/X and Telegram</li>
                <li>Token launch platforms like Pump.fun</li>
              </ul>
              <p>
                We do not control, endorse, or assume responsibility for any third-party services. Your use of third-party services is at your own risk and subject to their respective terms and policies.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">9. Disclaimer of Warranties</h2>
              <p className="uppercase">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
              </p>
              <p>
                We do not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from using the Service will be accurate or reliable</li>
                <li>The quality of any information obtained will meet your expectations</li>
                <li>Any errors in the Service will be corrected</li>
                <li>The Service will be compatible with your devices or software</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">10. Limitation of Liability</h2>
              <p className="uppercase">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL NIGGASCREENA, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                <li>Any investment or trading decisions you make based on information from the Service</li>
                <li>Loss of cryptocurrency or fiat currency in any form</li>
              </ul>
              <p>
                Our total liability for any claims arising from these Terms or the Service shall not exceed the amount you paid us, if any, in the twelve (12) months preceding the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">11. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Niggascreena and its officers, directors, employees, contractors, agents, licensors, and suppliers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of a third party</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Your use or misuse of the Service</li>
                <li>Any content you submit or transmit through the Service</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time at our sole discretion. If we make material changes, we will provide notice through the Service or by other means. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
              <p>
                It is your responsibility to review these Terms periodically for changes. We recommend bookmarking this page and checking back regularly.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">13. Termination</h2>
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">14. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Niggascreena operates, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of a recognized arbitration institution. You agree to waive any right to a jury trial or to participate in a class action lawsuit.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">15. Severability</h2>
              <p>
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">16. Entire Agreement</h2>
              <p>
                These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and Niggascreena concerning the Service and supersede all prior agreements, representations, and understandings.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="font-marker text-2xl text-cream-primary mb-4">17. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Twitter/X: <a href="https://x.com/nscreena" className="text-brown-primary hover:underline">@nscreena</a></li>
                <li>GitHub: <a href="https://github.com/nscreena/nscreena" className="text-brown-primary hover:underline">github.com/nscreena/nscreena</a></li>
              </ul>
            </section>

            {/* Acknowledgment */}
            <section className="mt-12 p-6 bg-bg-elevated rounded-xl border border-border">
              <h2 className="font-marker text-2xl text-brown-primary mb-4">⚠️ Acknowledgment</h2>
              <p>
                BY USING NIGGASCREENA, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTOOD THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU ARE NOT AUTHORIZED TO USE THE SERVICE.
              </p>
              <p className="mt-4">
                You further acknowledge that cryptocurrency trading is extremely risky and that you may lose all of your invested capital. Niggascreena is not responsible for any losses you may incur.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
