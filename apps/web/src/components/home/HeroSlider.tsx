"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    title: "সড়যন্ত্র",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    image: "/images/shorojontro-game-box.png",
    bgImage: "/images/shorojontro-banner.png",
    buyLink: "/products/shorojontro",
    learnMoreLink: "/products/shorojontro",
  },
  {
    id: 2,
    title: "নতুন খেলা",
    description:
      "Explore the latest addition to our collection. Strategy, fun, and excitement all in one box.",
    image: "/images/shorojontro-game-box.png", // Using the same image for now
    bgImage: "/images/shorojontro-banner.png",
    buyLink: "/products/new-game",
    learnMoreLink: "/products/new-game",
  },
  // Add more slides as needed
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
    Fade(),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <section className="relative w-full lg:h-[90svh] overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.bgImage}
                  alt="Banner Background"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 z-1"
                style={{
                  background:
                    "linear-gradient(-90deg, rgba(0, 0, 0, 0.00) 0%, #042B19 100%)",
                }}
              />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                  <div className="max-w-xl animate-fade-in-up">
                    <h1 className="text-6xl md:text-8xl font-bold text-[#facc15] mb-6 font-['Hind_Siliguri']">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light opacity-90">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={slide.buyLink}
                        className="px-10 py-4 bg-[#facc15] text-[#0a1a0f] rounded-xl font-bold hover:bg-[#eab308] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-yellow-900/20"
                      >
                        Buy Now
                      </Link>
                      <Link
                        href={slide.learnMoreLink}
                        className="px-10 py-4 bg-white text-[#0a1a0f] rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center animate-fade-in-up">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={242}
                      height={337}
                      className="object-contain w-60.5! hover:rotate-3 transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-8 bottom-12 z-20 transition-all active:scale-90 cursor-pointer"
        aria-label="Previous slide"
      >
        <div className="relative size-9 rounded-md flex justify-center items-center bg-[#FFFFFF1A] backdrop-blur-md border border-[#FFFFFF94] text-[#FFFFFF94] rotate-45 overflow-hidden">
          <span className="size-4 rounded-full bg-[#FFFFFF94] absolute -top-2 -left-2" />
          <ChevronLeft className="size-6 -rotate-45" />
        </div>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-8 bottom-12 z-20 transition-all active:scale-90 cursor-pointer"
        aria-label="Next slide"
      >
        <div className="relative size-9 rounded-md flex justify-center items-center bg-[#FFFFFF1A] backdrop-blur-md border border-[#FFFFFF94] text-[#FFFFFF94] rotate-45 overflow-hidden">
          <span className="size-4 rounded-full bg-[#FFFFFF94] absolute -top-2 -left-2" />
          <ChevronRight className="size-6 -rotate-45" />
        </div>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-6 bg-[#FFFFFF94]"
                : "w-4 bg-[#FFFFFF1A]"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
