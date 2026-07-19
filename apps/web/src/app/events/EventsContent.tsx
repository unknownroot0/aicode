import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
}

const featuredEvents: EventItem[] = [
  {
    id: "1",
    title: "NEW ALLIANCE FORGED!",
    description:
      "A powerful alliance has joined your cause. Gain +2 strength for the next 2 turns.",
    date: "24 March 2026",
    image: "/images/event-img.png",
  },
  {
    id: "2",
    title: "FUNDING SHORTAGE STRIKES!",
    description:
      "Suddenly, your treasury is low. Lose half of your resources this turn (round up).",
    date: "24 March 2026",
    image: "/images/event-img.png",
  },
];

const endedEvents: EventItem[] = [
  {
    id: "3",
    title: "MYSTERIOUS TRAVELER ARRIVES!",
    description: "A stranger offers you knowledge. Gain a new skill card.",
    date: "25 March 2026",
    image: "/images/event-img.png",
  },
  {
    id: "4",
    title: "NATURAL DISASTER HITS!",
    description:
      "An earthquake has struck your territory. Lose 1 building and resources.",
    date: "26 March 2026",
    image: "/images/event-img.png",
  },
  {
    id: "5",
    title: "MERCHANTS SEEK ALLIANCE!",
    description:
      "Traders wish to form a partnership. Gain +3 resources for the next 3 turns.",
    date: "27 March 2026",
    image: "/images/event-img.png",
  },
  {
    id: "6",
    title: "SPY NETWORK UNCOVERED!",
    description:
      "A rival has infiltrated your ranks. Lose 1 unit and reveal a random card.",
    date: "28 March 2026",
    image: "/images/event-img.png",
  },
];

export function EventsContent() {
  return (
    <div className="relative overflow-hidden min-h-svh py-16 lg:py-24">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/common-section-bg.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 space-y-20 lg:space-y-32">
        {/* Featured Events Section */}
        <section className="space-y-10 lg:space-y-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#FEF5DE] uppercase">
            Featured Event
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Ended Events Section */}
        <section className="space-y-10 lg:space-y-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#FEF5DE] uppercase">
            Event Ended
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {endedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="bg-black border-2 border-b-[5px] border-[#9A7C50] rounded-2xl overflow-hidden p-5 transition-all group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:gap-6">
        {/* Image Container */}
        <div className="relative w-full sm:w-48.25 h-45.25 shrink-0 overflow-hidden rounded-xl border border-white/5">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content Container */}
        <div className="flex flex-col justify-between py-1 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="size-4.5 text-[#EAEA4C]" />
            <span className="font-medium text-[#FFFFFFCC] text-sm">
              {event.date}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-xl font-semibold text-[#FEF5DE]">
              {event.title}
            </h3>
            <p className="text-[#FEF5DECC] text-xs sm:max-w-85">
              {event.description}
            </p>
          </div>

          <div>
            <Button className="bg-[#EAEA4C] hover:bg-[#EAEA4C] text-[#12100A] text-xs font-semibold uppercase rounded-lg px-7 py-2.5 transition-all duration-300 active:scale-95 hover:scale-110 cursor-pointer">
              Join Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
