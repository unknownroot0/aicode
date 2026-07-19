import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function PrivacyPolicyHero() {
  return (
    <div className="relative overflow-hidden flex justify-center items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content */}
      <div className="z-10 w-full max-w-7xl px-6 py-16 lg:py-20 flex flex-col justify-center items-center space-y-5">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2">
          <Link href="/" className="text-[#C7C0AF] text-sm">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-[#FEF5DE] text-sm">Privacy Policy</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-semibold text-[#FEF5DE] uppercase text-center">
          Privacy Policy
        </h1>
        <p className="text-[#FEF5DECC] text-sm text-center sm:max-w-xl">
          At Diceymio, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy outlines how we
          collect, use, and safeguard your data when you use our website.
        </p>
      </div>
    </div>
  );
}
