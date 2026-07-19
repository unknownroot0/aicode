import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function TermsOfUseHero() {
  return (
    <div className="relative overflow-hidden flex justify-center items-center">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      <div className="z-10 w-full max-w-7xl px-6 py-16 lg:py-20 flex flex-col justify-center items-center space-y-5">
        <nav className="flex items-center gap-2">
          <Link href="/" className="text-[#C7C0AF] text-sm">
            Home
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-[#FEF5DE] text-sm">Terms of Use</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-semibold text-[#FEF5DE] uppercase text-center">
          Terms & Conditions
        </h1>
        <p className="text-[#FEF5DECC] text-sm text-center sm:max-w-xl">
          Please read these terms carefully before using our services. By
          accessing or using Diceymio, you agree to abide by these terms.
        </p>
      </div>
    </div>
  );
}
