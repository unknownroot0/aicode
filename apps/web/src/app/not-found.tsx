import Image from "next/image";
import Link from "next/link";
import notFoundImg from "../../public/images/404-img.png";

export default function NotFound() {
  return (
    <div className="relative min-h-svh w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-hero-bg.png')" }}
      />

      {/* Content */}
      <div className="z-20 flex flex-col items-center text-center px-6">
        <Image src={notFoundImg} alt="404" />

        <h1 className="text-[#FEF5DE] md:text-3xl text-2xl font-semibold uppercase">
          Page Not Found
        </h1>

        <p className="text-[#FEF5DECC] text-sm my-8 max-w-lg text-center">
          Looks like this page has vanished into thin air… or maybe it’s part of
          a bigger strategy. The page you’re looking for doesn’t exist or has
          been moved.
        </p>

        <Link
          href="/"
          className="px-6 py-3 bg-[#69E5BB] text-sm text-[#12100A] border-[#008C5C] border-2 border-b-4 font-semibold rounded-md transition-all hover:scale-105 active:scale-95 uppercase"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
