import { FaUsers } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { LuClock4 } from "react-icons/lu";
import { RiDashboardFill } from "react-icons/ri";

export function LatestProduct() {
  return (
    <section className="px-6 py-16 bg-[#12100A]">
      <div className="max-w-7xl mx-auto relative bg-linear-to-b from-[#143021] to-[#0B1C13] rounded-[20px] border border-[#FFFFFF1A] px-3.5 sm:px-12 lg:px-16 py-4 sm:py-12 overflow-hidden">
        {/* Top Badges Row */}
        <div className="md:block hidden">
          <TopBadge />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="bg-linear-to-b from-[#0087CA] to-[#005D8C] text-[#FEF5DE] text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-full">
                NEW
              </span>
              <span className="bg-linear-to-b from-[#E2003C] to-[#B70635] text-[#FEF5DE] text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-full">
                20% OFF
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-phudu font-bold text-[#FBB24A] leading-tight">
              গল্পকথা
            </h2>

            {/* Description */}
            <p className="text-sm text-[#FEF5DECC] max-w-110">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
            </p>

            {/* Price and Rating */}
            <div className="flex items-center gap-6 flex-wrap my-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-semibold text-[#FEF5DE] uppercase font-phudu">
                  TK. 800
                </span>
                <span className="text-xl md:text-2xl text-[#FFFFFF52] line-through uppercase font-phudu">
                  TK. 900
                </span>
              </div>

              {/* Stars and Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-[#FBB24A] size-4" />
                  ))}
                </div>
                <span className="text-sm text-[#FEF5DE]">5.00 (120)</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="bg-[#EAEA4C] hover:bg-[#D4D84F] text-[#12100A] font-semibold font-phudu text-sm uppercase py-3 px-6 rounded-lg transition-all active:scale-95 hover:scale-105 border-2 border-b-4 border-[#8D8D10] cursor-pointer">
              Add to Cart
            </button>
          </div>

          {/* Right Video Section */}
          <div className="flex justify-center md:justify-end md:items-end h-full">
            <div className="space-y-4 w-full max-w-full md:w-fit">
              <div className="flex items-center gap-3 mb-3">
                <span className="border border-[#EAEA4C] bg-[#EAEA4C36] size-3 rotate-45 rounded-[3px]" />
                <h3 className="text-sm font-medium text-[#FEF5DE] uppercase">Learn How to Play</h3>
              </div>
              {/* Video Embed */}
              <div className="relative md:w-81.5 w-full max-w-full aspect-video rounded-2xl overflow-hidden border border-[#FFFFFF1A] bg-black/30 group cursor-pointer">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/g5xdYqm4glk?si=sng2zWBg9dOiL4V4"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            </div>
          </div>

          <div className="block md:hidden">
            <TopBadge />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TopBadge() {
  return (
    <div className="md:absolute right-0 top-0 bg-[#FFFFFF0F] border md:border-t-0 md:border-r-0 border-[#464646] flex items-center justify-center flex-wrap sm:gap-8 gap-5 sm:px-8 px-3 py-5 rounded-xl md:rounded-3xl md:rounded-br-none md:rounded-tl-none">
      <div className="flex items-center gap-3">
        <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
          <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
          <FaUsers className="size-4 -rotate-45" />
        </div>
        <span className="text-[#FEF5DECC] text-xs sm:text-sm font-medium">3-6 Players</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
          <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
          <LuClock4 className="size-4 -rotate-45" />
        </div>
        <span className="text-[#FEF5DECC] text-xs sm:text-sm font-medium">30-45 min</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative size-7.5 rounded-md flex justify-center items-center bg-[#FBB24A36] backdrop-blur-md border border-[#FBB24A] text-[#FEF5DE] rotate-45 overflow-hidden">
          <span className="size-4 rounded-full bg-[#FBB24A] absolute -top-2 -left-2" />
          <RiDashboardFill className="size-4 -rotate-45" />
        </div>
        <span className="text-[#FEF5DECC] text-xs sm:text-sm font-medium">Board game</span>
      </div>
    </div>
  );
}