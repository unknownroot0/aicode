export function PrivacyPolicyContent() {
  return (
    <div className="relative overflow-hidden flex justify-center items-center py-16 lg:py-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-section-bg.png')" }}
      />

      {/* Content */}
      <div className="z-10 w-full max-w-7xl px-6 space-y-12">
        {/* Information We Collect */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Information We Collect
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-5">
            <p>We collect various types of information to serve you better:</p>
            <div>
              <p className="text-[#FEF5DE] font-semibold mb-1">
                Personal Information
              </p>
              <p>
                Including your name, email address, and any other details you
                choose to share with us.
              </p>
            </div>
            <div>
              <p className="text-[#FEF5DE] font-bold mb-1">Usage Data</p>
              <p>
                Details on how you interact with our website, like which pages
                you visit, how long you stay, and your actions.
              </p>
            </div>
            <div>
              <p className="text-[#FEF5DE] font-bold mb-1">
                Device Information
              </p>
              <p>
                Information about your browser, device type, and IP address to
                optimize your experience.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            How We Use Your Information
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p className="text-[#FEF5DE] mb-2">
              We use your information for several important purposes:
            </p>
            <p>
              - To enhance and improve our website and your overall user
              experience.
            </p>
            <p>- To process your purchases and handle transactions smoothly.</p>
            <p>
              - To keep you informed with updates, special offers, and provide
              support when needed.
            </p>
            <p>
              - To maintain platform security and prevent any misuse or
              unauthorized access.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Cookies
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p>
              Diceymio uses cookies to make your browsing smoother and more
              personalized. These cookies help us understand how you use our
              site and allow us to improve our services continually.
            </p>
            <p>
              You have full control and can disable cookies anytime through your
              browser settings if you prefer.
            </p>
          </div>
        </section>

        {/* Data Protection */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Data Protection
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p>
              We take strong security measures to safeguard your personal data.
              However, no online system can guarantee absolute security. We also
              work with trusted third-party services, like payment processors
              and analytics providers, who may collect and handle your data
              under their own privacy policies.
            </p>
          </div>
        </section>

        {/* Your Rights (1) */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Your Rights
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p className="text-[#FEF5DE] font-bold mb-2">
              You have important rights regarding your personal data:
            </p>
            <p>- You can access the information we hold about you.</p>
            <p>- You can request corrections or ask us to delete your data.</p>
            <p>
              - You can choose to opt out of receiving promotional messages from
              us.
            </p>
          </div>
        </section>

        {/* Your Rights (2 - matching screenshot duplicate) */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Your Rights
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p className="text-[#FEF5DE] font-bold mb-2">
              Your rights include:
            </p>
            <p>- Accessing your personal data.</p>
            <p>- Requesting corrections or deletion of your information.</p>
            <p>- Opting out of promotional communications.</p>
            <p className="pt-2">
              Please note, we may update this Privacy Policy occasionally. Any
              changes will be posted here with the updated date for your
              reference.
            </p>
          </div>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-[#FEF5DE] sm:text-lg text-base font-semibold uppercase mb-6">
            Contact Us
          </h2>
          <div className="text-[#FEF5DE99] text-sm space-y-2">
            <p>
              If you have any questions or concerns about this Privacy Policy,
              feel free to reach out to us at:{" "}
              <strong className="text-[#FEF5DE]">support@diceymio.com</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
