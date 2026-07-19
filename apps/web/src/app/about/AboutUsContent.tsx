import Image from "next/image";
import GameCard1 from '../../../public/images/game-card-1.png';
import GameCard2 from '../../../public/images/game-card-2.png';
import GameCard3 from '../../../public/images/game-card-3.png';
import GameCard4 from '../../../public/images/game-card-4.png';
import GameCard5 from '../../../public/images/game-card-5.png'
import Link from "next/link";

export function AboutUsContent() {
  return (
    <section className="px-6 py-16 bg-[#12100A]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Image src={GameCard1} alt="Game card" draggable={false} width={100} height={100} />
          <Image src={GameCard2} alt="Game card" draggable={false} width={100} height={100} />
          <Image src={GameCard3} alt="Game card" draggable={false} width={100} height={100} />
          <Image src={GameCard4} alt="Game card" draggable={false} width={100} height={100} />
          <Image src={GameCard5} alt="Game card" draggable={false} width={100} height={100} />
        </div>
        <p className="text-[#5A8F71] font-medium text-base sm:text-lg md:text-2xl text-center lg:w-[1000px]">Diceymio is a modern board game platform dedicated to bringing unique and engaging card games to players around the world. We focus on creating experiences that combine strategy, creativity, and fun—whether you're playing with friends or exploring new challenges on your own.</p>

        <Link href="/products" className="bg-[#69E5BB] hover:bg-[#58C49D] text-[#12100A] font-semibold font-phudu text-sm uppercase py-3 px-6 rounded-lg transition-all active:scale-95 hover:scale-105 border-2 border-b-4 border-[#008C5C] cursor-pointer">
          View all games
        </Link>
      </div>
    </section>
  );
}