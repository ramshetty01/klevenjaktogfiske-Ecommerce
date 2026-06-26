"use client";

import { Mountain, Compass, Headphones, ArrowRight } from "lucide-react";
import type { PageId } from "../la/header";
import { CommitmentChip } from "../la/footer";

interface CommitmentPageProps {
  onNavigate: (page: PageId) => void;
}

const FEATURES = [
  {
    icon: Mountain,
    title: "Quality Gear",
    description:
      "We field-test every product before it earns a spot on our shelves. From alpine-grade tents to multi-day backpacks, each item is selected for durability, performance, and real-world reliability—so the gear you carry performs when conditions don't.",
  },
  {
    icon: Compass,
    title: "Expert Advice",
    description:
      "Our team has logged thousands of trail miles across six continents. Whether you're planning your first overnight or a high-altitude expedition, we'll help you choose the right kit, pack it properly, and avoid the gear mistakes we've already made for you.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "Real humans, reachable by phone, email, or chat—seven days a week. We stand behind everything we sell with a no-drama return policy, lifetime repair support on key items, and a community of fellow adventurers ready to help.",
  },
];

export function CommitmentPage({ onNavigate }: CommitmentPageProps) {
  return (
    <div
      className="la-page-enter"
      style={{ backgroundColor: "#f8f5f0" }}
    >
      <section className="mx-auto max-w-[1100px] px-6 py-20 lg:px-10 lg:py-28">
        {/* Heading */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.25em] text-[#718096]">
            What We Stand For
          </p>
          <h1
            className="text-[clamp(2.75rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#2d3748]"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Our Commitment
          </h1>
          <p className="mt-6 max-w-2xl text-[20px] font-light leading-relaxed text-[#4a5568]">
            Three promises that shape every product we stock and every
            conversation we have. They&apos;re not marketing—they&apos;re the
            standard we hold ourselves to.
          </p>
        </div>

        {/* Feature list */}
        <div className="flex flex-col">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="border-t border-black/10 py-10 last:border-b"
              >
                {/* Icon + heading inline (matches original layout) */}
                <div className="mb-3 flex items-center gap-3 text-[#718096]">
                  <Icon size={28} strokeWidth={1.4} />
                  <h2 className="text-[22px] font-semibold text-[#2d3748]">
                    {f.title}
                  </h2>
                </div>
                <p className="max-w-2xl pl-0 text-[17px] font-light leading-[1.75] text-[#4a5568] md:pl-10">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer CTA area */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[8px] bg-white p-8 shadow-[0_4px_12px_rgba(0,0,0,0.05)] md:flex-row md:items-center">
          <div>
            <h3 className="text-[20px] font-semibold text-[#2d3748]">
              See it in the gear.
            </h3>
            <p className="mt-1 text-[14px] font-light text-[#4a5568]">
              Browse the full catalog of field-tested equipment.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CommitmentChip onClick={() => onNavigate("about")} />
            <button
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-2 rounded-full bg-[#2c3e50] px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-[#1f2d3a]"
            >
              Shop All
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
