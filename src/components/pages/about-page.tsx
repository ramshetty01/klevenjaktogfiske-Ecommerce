"use client";

import { ArrowRight } from "lucide-react";
import type { PageId } from "../la/header";

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div
      className="la-page-enter"
      style={{
        background:
          "linear-gradient(180deg, #fff9e0 0%, #fbf7e8 40%, #f0f8f0 100%)",
      }}
    >
      <section className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#718096]">
            About Us
          </p>
          <h1
            className="text-[clamp(3rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#2d3748]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            About
          </h1>
          <p className="mt-6 text-[20px] font-medium text-[#4a5568]">
            Our Story
          </p>
        </div>

        {/* Two-column: image + text */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr] lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[8px] shadow-[0_20px_50px_rgba(44,62,80,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://sfile.chatglm.cn/images-ppt/a6be23506cc4.jpg"
                alt="Person rock climbing on a mountain face"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Small badge */}
            <div className="absolute -bottom-5 -right-5 hidden rounded-lg bg-white px-5 py-4 shadow-[0_10px_25px_rgba(44,62,80,0.18)] sm:block">
              <div className="text-[24px] font-bold text-[#2c3e50]">12+</div>
              <div className="text-[11px] font-light uppercase tracking-[0.1em] text-[#718096]">
                Years on
                <br />
                the Trail
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="max-w-[680px]">
            <p className="text-[18px] font-light leading-[1.85] text-[#2d3748]">
              Lemon &amp; Ardent was born from a simple belief: the wild deserves
              better gear. What started as a weekend obsession—sourcing
              hard-to-find equipment for a small community of climbers,
              backpackers, and weekend wanderers—has grown into a curated
              collection trusted by explorers on six continents.
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#2d3748]">
              Every product we carry has been field-tested by people who
              actually use it. We refuse to stock anything we wouldn&apos;t take
              ourselves, whether that means a 60-liter expedition pack, a
              four-season tent, or a single pair of boots rated for the
              conditions that keep most people indoors.
            </p>
            <p className="mt-6 text-[18px] font-light leading-[1.85] text-[#2d3748]">
              We&apos;re not the biggest outdoor retailer. We don&apos;t want to
              be. We&apos;d rather know your name, know your next trip, and
              make sure the gear on your back is exactly right for it.
            </p>

            {/* Signature */}
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2d3748]/15" />
              <span className="text-[14px] font-light italic text-[#4a5568]">
                — The Lemon &amp; Ardent Team
              </span>
            </div>

            {/* CTA */}
            <button
              onClick={() => onNavigate("commitment")}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#2c3e50] px-8 py-4 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#f7dc6f] shadow-[0_8px_24px_rgba(44,62,80,0.25)] transition-all duration-300 hover:bg-[#1f2d3a] hover:shadow-[0_12px_30px_rgba(44,62,80,0.35)]"
            >
              Learn More
              <ArrowRight
                size={16}
                strokeWidth={2.2}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 grid grid-cols-2 gap-8 border-t border-black/10 pt-12 md:grid-cols-4">
          {[
            { v: "30k+", l: "Adventurers Equipped" },
            { v: "120+", l: "Curated Products" },
            { v: "6", l: "Continents Shipped" },
            { v: "4.9", l: "Average Review" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[clamp(2rem,3vw,2.75rem)] font-bold text-[#2c3e50]">
                {s.v}
              </div>
              <div className="mt-2 text-[12px] font-light uppercase tracking-[0.15em] text-[#4a5568]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
