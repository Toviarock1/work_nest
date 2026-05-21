"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  AtSign,
  Earth,
  Code,
  HeartHandshake,
  ShieldCheck,
  MessageCircle,
  MessagesSquare,
  Video,
  CloudUpload,
  RefreshCcw,
  ClipboardCheck,
  Sparkles,
  MousePointerClick,
  ArrowRight,
} from "lucide-react";
import TiltCard from "@/components/landing/TiltCard";
import ScrollReveal from "@/components/landing/ScrollReveal";
import ParallaxLayer from "@/components/landing/ParallaxLayer";
import LandingScene3D from "@/components/landing/LandingScene3D";

function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <LandingScene3D />;
}

export default function Home() {
  return (
    <section className="relative bg-landing-page-background-light dark:bg-landing-page-background-dark font-display text-[#111815] dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Animated aurora layer — fixed page-wide ambient tint */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 aurora-bg opacity-40 dark:opacity-35"
      />

      <div className="relative z-10 flex h-auto min-h-screen w-full flex-col group/design-root">
        <div className="layout-container flex h-full grow flex-col">
          {/* Nav */}
          <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/40 dark:border-[#1e3a2f]/60 glass px-6 lg:px-40 py-3">
            <div className="flex items-center gap-3 text-[#111815] dark:text-white">
              <div className="size-8 text-landing-page-primary spin-slow">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold leading-tight tracking-[-0.015em]">
                WorkNest
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-8">
              <Link href={"/login"}>
                <button className="group relative flex min-w-[110px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-landing-page-primary text-[#111815] text-sm font-bold leading-normal tracking-[0.015em] shadow-[0_8px_30px_-6px_rgba(13,242,147,0.6)] hover:shadow-[0_10px_40px_-4px_rgba(13,242,147,0.85)] transition-all hover:-translate-y-0.5">
                  <span className="truncate">Login</span>
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </header>

          <main className="flex-1">
            {/* ===== HERO ===== */}
            <div className="relative overflow-hidden min-h-[88vh]">
              {/* 3D scene scoped to hero */}
              <HeroBackground />
              <div className="absolute inset-0 grid-floor pointer-events-none z-[1]" />

              <div className="relative z-[2] px-4 lg:px-40 flex flex-1 justify-center py-16 lg:py-32 min-h-[88vh] items-center">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                  <div className="@container">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                      <div className="flex-1">
                        <div className="flex flex-col gap-8">
                          <div className="inline-flex items-center gap-2 self-start rounded-full glass px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-landing-page-primary">
                            <Sparkles className="size-3.5" />
                            <span>Now with 3D workspace preview</span>
                          </div>

                          <div className="flex flex-col gap-4 text-left">
                            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em]">
                              Collaborate better,
                              <br />
                              <span className="gradient-text glow-text">
                                deliver faster.
                              </span>
                            </h1>
                            <p className="text-[#608a79] dark:text-gray-300 text-lg lg:text-xl font-medium leading-relaxed max-w-[540px]">
                              The all-in-one workspace for modern teams to manage
                              projects, chat in real-time, and share files without
                              the clutter.
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link href={"/register"}>
                              <button className="group relative flex min-w-[220px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-14 px-8 bg-landing-page-primary text-[#111815] text-lg font-extrabold tracking-[0.015em] shadow-[0_20px_60px_-12px_rgba(13,242,147,0.7)] hover:scale-[1.04] transition-transform">
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                <span className="relative">Get Started for Free</span>
                                <ArrowRight className="relative size-5 transition-transform group-hover:translate-x-1" />
                              </button>
                            </Link>
                            <button className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl h-14 px-8 glass text-[#111815] dark:text-white text-lg font-bold hover:bg-white/80 dark:hover:bg-white/10 transition-colors">
                              <MousePointerClick className="size-5" />
                              <span className="truncate">Watch Demo</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-4 text-sm font-medium text-[#608a79] dark:text-gray-300">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-200 overflow-hidden">
                                <Image
                                  className="w-full h-full object-cover"
                                  width={100}
                                  height={100}
                                  alt="user"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb7wDyO_8hTjRNXPFtQaBZ7CuMf4Ggl66BooCQjBDoTvuGegAdOYp3qyw7767F8jn0sHC_gS_8Fcr3VGgkgC0a__6ZWKIYCPb3l2zYlwsmhzz31cRmTf1lV9dHHIElB8U96OTK3UVi7vY4IYm5sugHCwuUBGFObtnArAJ-mi9QuNvvfD6cmpJqGqh-O3cjlOoaNQTThlqkco6sF7ye2P0T_4KY1V4SLEnj2uAK3FdOf1CP7pCO_iIzRVn7QpsMjfIRk9Bt68Z7t1du"
                                />
                              </div>
                              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-300 overflow-hidden">
                                <Image
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                  alt="user"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl479OGR6CaTsz05xzVp94jWWitRdRFyHtm16MwNePPUcBk8ED5p58PX2lcqFvqd5IlTLO-ik0DVg03V2h6y0cZI-ISxUaJYSQVmjRxyrcfmiJ60QQWeQBZPaxRNB_uDXQkDFgjRt_Uk3DTuYBhMF5u8HW3fAVnV8-ecUw_KIZN9GxqJB9KaLHSIJyNFcxuXjqgXbtYRVYPMq5cZ3R76P-oQl2mghmU4cR9ArDhfCtRk-UA3W9FyRkTQjbsnE7UzF0ZFfM4LXccXqa"
                                />
                              </div>
                              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-background-dark bg-gray-400 overflow-hidden">
                                <Image
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                  alt="user"
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn2Uc1OBb9iVgRGqGGIX2yg9x1GwZ3AFZ18Q4hoUvRK95eBgnWEn8QQ1AX6VMJ4aNuPtk2a7dq7y1hA8ths6qV3Oxxe_uTWe0RQpL78Hsz5z0g28vfykXUGR8GxxYYnYTC-VYKf8F501YvoePjjP9ipP-JVu1f_MP-t4G383da0yOglXbJ5VaEFFzbyx1mCniAY6J8h8bPliue7e6TTWMbyXpmQqXd_-RUqrWIENUE1-nqdNtZzrKpv16nrM-r8npHFs7eXS2htVaK"
                                />
                              </div>
                            </div>
                            <span>Joined by 10,000+ teams worldwide</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 w-full lg:max-w-[600px]">
                        <TiltCard intensity={14} className="relative">
                          <div className="absolute -inset-6 bg-landing-page-primary/30 blur-3xl rounded-full" />
                          <div className="relative glass p-2 rounded-2xl shadow-2xl glow-ring">
                            <div
                              className="w-full aspect-[4/3] bg-cover bg-center rounded-xl"
                              style={{
                                backgroundImage:
                                  "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDqUUty4FmlKGJbfeJqZDExq3PqG_0oFHFpdn2B9ZNk16PZ3k9v5m22bHqsWV4cIil5ejR3lQuJ4QaV5bgx2E00c6qpiT6rgZG33wUkl6_M7eBQxIbuS5k5619-nnV7rbH5JYi6sYaqLd7YgrTNGs5WlA1asKfpUPNP7JW5oZFTsUByfCQBOhxXjRFzaGkcxGiVJ8N77tGrh2lMDO9U3Z-ANkhCevUIkYa9oD6Afo9JRUJz826C9aO4D3rkExZCUZ1KQYtBn_2i2wEg)",
                              }}
                            />
                            {/* Floating badges */}
                            <div
                              className="absolute -top-5 -left-5 glass rounded-2xl px-4 py-3 shadow-xl float-y"
                              style={{ transform: "translateZ(40px)" }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-landing-page-primary animate-pulse" />
                                <span className="text-xs font-bold">3 deploys today</span>
                              </div>
                            </div>
                            <div
                              className="absolute -bottom-6 -right-4 glass rounded-2xl px-4 py-3 shadow-xl float-y-slow"
                              style={{ transform: "translateZ(60px)" }}
                            >
                              <div className="flex items-center gap-2">
                                <BadgeCheck className="size-5 text-landing-page-primary" />
                                <span className="text-xs font-bold">Task shipped</span>
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== FEATURE GRID ===== */}
            <div className="relative px-4 lg:px-40 flex flex-1 justify-center py-24 backdrop-blur-sm bg-white/20 dark:bg-landing-page-background-dark/20 border-y border-white/20 dark:border-white/5">
              <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                <div className="flex flex-col gap-14 px-4 @container">
                  <ScrollReveal>
                    <div className="flex flex-col gap-4 text-center items-center">
                      <h2 className="text-3xl lg:text-5xl font-extrabold leading-tight max-w-[760px]">
                        Everything you need to{" "}
                        <span className="gradient-text">manage your team</span>{" "}
                        in one place.
                      </h2>
                      <p className="text-[#608a79] dark:text-gray-300 text-lg font-medium leading-normal max-w-[720px]">
                        Stop jumping between apps. We've built the ultimate tool for transparency and speed.
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1200">
                    {[
                      {
                        icon: (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 3v14" />
                            <path d="M12 3v8" />
                            <path d="M19 3v18" />
                          </svg>
                        ),
                        title: "Project Management",
                        copy: "Organize tasks with ease using our intuitive boards, timelines, and automated workflows.",
                      },
                      {
                        icon: <MessageCircle className="size-6" />,
                        title: "Real-time Chat",
                        copy: "Stay connected with your team through integrated messaging, threads, and file annotations.",
                      },
                      {
                        icon: <CloudUpload className="size-6" />,
                        title: "File Sharing",
                        copy: "Keep all your project assets in one secure place with unlimited cloud storage and versioning.",
                      },
                    ].map((f, i) => (
                      <ScrollReveal key={f.title} delay={i * 120} direction="up">
                        <TiltCard className="h-full">
                          <div className="relative flex h-full gap-5 rounded-2xl border border-white/40 dark:border-white/10 glass p-8 flex-col overflow-hidden group">
                            <div
                              className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full bg-landing-page-primary/25 blur-3xl transition-opacity group-hover:opacity-100 opacity-60"
                              style={{ transform: "translateZ(-20px)" }}
                            />
                            <div
                              className="w-14 h-14 rounded-xl bg-landing-page-primary/15 flex items-center justify-center text-landing-page-primary group-hover:bg-landing-page-primary group-hover:text-[#111815] transition-colors"
                              style={{ transform: "translateZ(40px)" }}
                            >
                              {f.icon}
                            </div>
                            <div
                              className="flex flex-col gap-2"
                              style={{ transform: "translateZ(20px)" }}
                            >
                              <h3 className="text-xl font-bold leading-tight">
                                {f.title}
                              </h3>
                              <p className="text-[#608a79] dark:text-gray-300 text-base font-medium leading-relaxed">
                                {f.copy}
                              </p>
                            </div>
                          </div>
                        </TiltCard>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== SCALE HEADER ===== */}
            <ScrollReveal>
              <section className="w-full px-6 md:px-20 lg:px-40 pt-20 text-center">
                <h2 className="text-3xl md:text-6xl font-black leading-tight tracking-tight max-w-3xl mx-auto">
                  Everything you need to{" "}
                  <span className="gradient-text glow-text">scale</span>{" "}
                  your production
                </h2>
              </section>
            </ScrollReveal>

            {/* ===== FEATURE ALT 1 ===== */}
            <section className="w-full px-6 md:px-20 lg:px-40 py-16 md:py-24 perspective-1200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <ScrollReveal direction="right">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-landing-page-primary font-bold">
                        <ClipboardCheck className="size-5" />
                        <span>Tasks &amp; Collaboration</span>
                      </div>
                      <h1 className="tracking-tight text-3xl md:text-5xl font-black leading-tight">
                        Manage projects with{" "}
                        <span className="gradient-text">surgical precision</span>
                      </h1>
                      <p className="text-[#61896f] dark:text-gray-300 text-lg font-normal leading-relaxed">
                        Assign tasks, set deadlines, and track progress in real-time. Our intuitive interface keeps your team focused on what matters most without the overhead.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <TiltCard intensity={8} className="rounded-xl">
                        <div className="flex flex-col gap-2 p-5 rounded-xl border border-white/30 dark:border-white/10 glass">
                          <RefreshCcw className="size-6 text-landing-page-primary" />
                          <p className="text-base font-bold">Real-time sync</p>
                          <p className="text-[#61896f] dark:text-gray-300 text-sm">
                            Updates across all team devices instantly.
                          </p>
                        </div>
                      </TiltCard>
                      <TiltCard intensity={8} className="rounded-xl">
                        <div className="flex flex-col gap-2 p-5 rounded-xl border border-white/30 dark:border-white/10 glass">
                          <CloudUpload className="size-6 text-landing-page-primary" />
                          <p className="text-base font-bold">Asset Sharing</p>
                          <p className="text-[#61896f] dark:text-gray-300 text-sm">
                            Centralized cloud storage for project files.
                          </p>
                        </div>
                      </TiltCard>
                    </div>
                    <Link href={"/register"}>
                      <button className="group mt-4 flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-landing-page-primary text-[#111813] text-base font-bold transition-all hover:shadow-[0_15px_40px_-8px_rgba(13,242,147,0.7)] hover:-translate-y-0.5 w-fit">
                        <span>Get Started Now</span>
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </Link>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="left" delay={120}>
                  <ParallaxLayer speed={0.08}>
                    <TiltCard intensity={10}>
                      <div className="relative">
                        <div className="absolute -inset-6 bg-landing-page-primary/25 rounded-2xl blur-2xl" />
                        <div
                          className="relative w-full aspect-[4/3] bg-cover bg-center rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden glow-ring"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAuM8ZjWoTdz5bQPYa4Aih5MwlCsthfxIdJQTXkMTKwmxK5pWKIABZq18CQM36WNy90CWzweEDO8QB3B3pZ9QtVTjVjuhk85q-PLdYEFngxGtHKfKZb1PB9T6yUlpVpS9IV4E5vjxFKVzwpwKIspKl-yQNqpqzYQlIwughIIcoTFGU-eEXR3sSzkBWE7Zjyf0dPucavAbG1Qty1cOULO4DIvEe8TfugExbvT8vKRiw4DnfpIUUFi4TI8xAbSKaB040et8NVpZyfknhr")',
                          }}
                        />
                      </div>
                    </TiltCard>
                  </ParallaxLayer>
                </ScrollReveal>
              </div>
            </section>

            {/* ===== FEATURE ALT 2 ===== */}
            <section className="w-full bg-white/30 dark:bg-white/5 backdrop-blur-md py-16 md:py-24 border-y border-white/30 dark:border-white/5 perspective-1200">
              <div className="mx-auto px-6 md:px-20 lg:px-40">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <ScrollReveal direction="right" className="order-2 lg:order-1">
                    <ParallaxLayer speed={0.08}>
                      <TiltCard intensity={10}>
                        <div className="relative">
                          <div className="absolute -inset-6 bg-landing-page-primary/20 rounded-2xl blur-2xl" />
                          <div
                            className="relative w-full aspect-[4/3] bg-cover bg-center rounded-2xl border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden glow-ring"
                            style={{
                              backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBObqP16Gi7e4ikoXaplYdCZcjl5nYywUqJAp9l5UIKWxICUSbpcQzR_KgrkGXFslTPSJsYFSXs4_wus837NfEOOLvdfb_B16CK8loxfqVyuF9-lej3-7zvcuV1OWmnJm2GjVKczFea0qUP5dS9DwmRmF2OR-1UXsAhFxPL2KpZqyJEtSdzQQn5anJHR1zxNvwNGuybgJXP8cMl4tQxzuu-dT4AvZb107c2Zki7FHA71IaKU1Dc4MWPuZMka-opDM-56KCV3rCBQflh")',
                            }}
                          />
                        </div>
                      </TiltCard>
                    </ParallaxLayer>
                  </ScrollReveal>

                  <ScrollReveal direction="left" delay={120} className="order-1 lg:order-2">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-landing-page-primary font-bold">
                          <MessagesSquare className="size-5" />
                          <span>Seamless Communication</span>
                        </div>
                        <h1 className="tracking-tight text-3xl md:text-5xl font-black leading-tight">
                          Keep your team in the{" "}
                          <span className="gradient-text">loop, always</span>
                        </h1>
                        <p className="text-[#61896f] dark:text-gray-300 text-lg font-normal leading-relaxed">
                          Communication is the lifeblood of great work. Integrated chat and commenting threads ensure context is never lost. Talk where the work happens.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <TiltCard intensity={6}>
                          <div className="flex gap-4 items-start p-5 glass rounded-xl border-l-4 border-landing-page-primary">
                            <Video className="size-6 text-landing-page-primary mt-1" />
                            <div>
                              <h3 className="font-bold">One-click Video Sync</h3>
                              <p className="text-[#61896f] dark:text-gray-300 text-sm">
                                Instant huddles for when a chat message isn't enough.
                              </p>
                            </div>
                          </div>
                        </TiltCard>
                        <TiltCard intensity={6}>
                          <div className="flex gap-4 items-start p-5 glass rounded-xl border-l-4 border-landing-page-primary">
                            <MessageCircle className="size-6 text-landing-page-primary mt-1" />
                            <div>
                              <h3 className="font-bold">In-context Feedback</h3>
                              <p className="text-[#61896f] dark:text-gray-300 text-sm">
                                Threaded comments directly on your design and code blocks.
                              </p>
                            </div>
                          </div>
                        </TiltCard>
                      </div>
                      <Link href={"/register"}>
                        <button className="group mt-4 flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-xl h-12 px-6 bg-landing-page-primary text-[#111813] text-base font-bold transition-all hover:shadow-[0_15px_40px_-8px_rgba(13,242,147,0.7)] hover:-translate-y-0.5 w-fit">
                          <span>Explore Communication</span>
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* ===== TRUST GRID ===== */}
            <section className="w-full px-6 md:px-20 lg:px-40 py-24 perspective-1200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: <ShieldCheck className="size-6" />,
                    title: "Bank-level Security",
                    copy: "Your data is encrypted end-to-end with the highest industry standards.",
                  },
                  {
                    icon: <HeartHandshake className="size-6" />,
                    title: "24/7 Expert Support",
                    copy: "Real people ready to help you optimize your workflow anytime.",
                  },
                  {
                    icon: <Code className="size-6" />,
                    title: "Deep Integrations",
                    copy: "Connect with Github, Slack, Stripe, and 500+ other apps.",
                  },
                ].map((t, i) => (
                  <ScrollReveal key={t.title} delay={i * 120} direction="up">
                    <TiltCard className="h-full">
                      <div className="flex flex-col gap-4 p-8 rounded-2xl glass border border-white/30 dark:border-white/10 text-center h-full">
                        <div
                          className="size-14 rounded-full bg-landing-page-primary/15 flex items-center justify-center mx-auto text-landing-page-primary"
                          style={{ transform: "translateZ(30px)" }}
                        >
                          {t.icon}
                        </div>
                        <h3 className="text-xl font-bold" style={{ transform: "translateZ(15px)" }}>
                          {t.title}
                        </h3>
                        <p className="text-[#61896f] dark:text-gray-300">{t.copy}</p>
                      </div>
                    </TiltCard>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="relative transition-colors duration-300">
              <div className="relative flex h-auto w-full flex-col">
                <div className="layout-container flex h-full grow flex-col">
                  <div className="px-6 md:px-40 flex flex-col items-center justify-center py-16 md:py-20">
                    <ScrollReveal>
                      <div className="layout-content-container flex flex-col max-w-[960px] w-full text-center">
                        <span className="text-landing-page-primary font-bold tracking-wider text-sm uppercase mb-3">
                          Pricing Plans
                        </span>
                        <h2 className="text-[32px] md:text-5xl font-extrabold leading-tight tracking-[-0.015em] px-4 pb-4">
                          Simple, transparent pricing for{" "}
                          <span className="gradient-text">teams of all sizes</span>
                        </h2>
                        <p className="text-[#4f6b5a] dark:text-gray-300 text-lg max-w-2xl mx-auto px-4">
                          Choose the plan that fits your current needs and scale as your business grows. No hidden fees.
                        </p>
                      </div>
                    </ScrollReveal>

                    <div className="layout-content-container flex flex-col max-w-[1100px] w-full mt-12 perspective-1200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-3 items-stretch">
                        {/* Basic */}
                        <ScrollReveal delay={0} direction="up">
                          <TiltCard intensity={8} className="h-full">
                            <div className="flex h-full flex-col gap-6 rounded-2xl border border-white/40 dark:border-white/10 glass p-8 transition-all hover:shadow-2xl">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold leading-tight">Basic</h3>
                                <p className="text-[#4f6b5a] dark:text-gray-300 text-sm mb-4">
                                  Perfect for side projects and individuals.
                                </p>
                                <p className="flex items-baseline gap-1">
                                  <span className="text-5xl font-black leading-tight tracking-[-0.033em]">$0</span>
                                  <span className="text-base font-bold">/month</span>
                                </p>
                              </div>
                              <Link href={"/register"}>
                                <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 glass text-sm font-bold leading-normal tracking-[0.015em] border border-white/40 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-colors">
                                  <span className="truncate">Get Started</span>
                                </button>
                              </Link>
                              <div className="flex flex-col gap-4 mt-2">
                                {["5 Active Projects", "10 GB Storage", "Basic Community Support"].map((f) => (
                                  <div key={f} className="text-sm font-medium flex gap-3 items-center">
                                    <BadgeCheck className="size-5 text-landing-page-primary" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TiltCard>
                        </ScrollReveal>

                        {/* Pro */}
                        <ScrollReveal delay={120} direction="up">
                          <TiltCard intensity={10} className="h-full md:scale-105 z-10">
                            <div className="relative flex h-full flex-col gap-6 rounded-2xl border-2 border-landing-page-primary glass p-8 shadow-2xl glow-ring">
                              <div className="absolute inset-x-0 -top-3 mx-auto w-fit rounded-full bg-landing-page-primary px-4 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-[#111814]">
                                Most Popular
                              </div>
                              <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold">Pro</h3>
                                <p className="text-[#4f6b5a] dark:text-gray-300 text-sm mb-4">
                                  Everything you need for growing teams.
                                </p>
                                <p className="flex items-baseline gap-1">
                                  <span className="text-5xl font-black leading-tight tracking-[-0.033em]">$29</span>
                                  <span className="text-base font-bold">/month</span>
                                </p>
                              </div>
                              <Link href={"/register"}>
                                <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-landing-page-primary text-[#111814] text-sm font-bold leading-normal tracking-[0.015em] hover:shadow-[0_15px_40px_-8px_rgba(13,242,147,0.8)] transition-shadow">
                                  <span className="truncate">Start 14-Day Free Trial</span>
                                </button>
                              </Link>
                              <div className="flex flex-col gap-4 mt-2">
                                {[
                                  "Unlimited Projects",
                                  "100 GB Cloud Storage",
                                  "Priority Email Support",
                                  "Advanced Team Analytics",
                                ].map((f) => (
                                  <div key={f} className="text-sm font-medium flex gap-3 items-center">
                                    <BadgeCheck className="size-5 text-landing-page-primary" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TiltCard>
                        </ScrollReveal>

                        {/* Enterprise */}
                        <ScrollReveal delay={240} direction="up">
                          <TiltCard intensity={8} className="h-full">
                            <div className="flex h-full flex-col gap-6 rounded-2xl border border-white/40 dark:border-white/10 glass p-8 transition-all hover:shadow-2xl">
                              <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold">Enterprise</h3>
                                <p className="text-[#4f6b5a] dark:text-gray-300 text-sm mb-4">
                                  Advanced security and custom controls.
                                </p>
                                <p className="flex items-baseline gap-1">
                                  <span className="text-5xl font-black leading-tight tracking-[-0.033em]">$99</span>
                                  <span className="text-base font-bold">/month</span>
                                </p>
                              </div>
                              <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 glass text-sm font-bold leading-normal tracking-[0.015em] border border-white/40 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10 transition-colors">
                                <span className="truncate">Contact Sales</span>
                              </button>
                              <div className="flex flex-col gap-4 mt-2">
                                {[
                                  "Custom Workspace Solutions",
                                  "Unlimited Managed Storage",
                                  "24/7 Dedicated Manager",
                                  "SSO & Advanced Security",
                                ].map((f) => (
                                  <div key={f} className="text-sm font-medium flex gap-3 items-center">
                                    <BadgeCheck className="size-5 text-landing-page-primary" />
                                    {f}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TiltCard>
                        </ScrollReveal>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-6 md:px-40 flex flex-1 justify-center py-10">
                    <div className="layout-content-container flex flex-col max-w-[1100px] flex-1">
                      <ScrollReveal direction="zoom">
                        <TiltCard intensity={6}>
                          <div className="relative flex flex-col justify-center items-center gap-8 rounded-3xl bg-landing-page-primary px-8 py-16 md:px-16 md:py-24 text-center overflow-hidden">
                            <div className="absolute inset-0 opacity-30 grid-floor" />
                            <div className="absolute -top-20 -left-20 size-72 bg-white/30 blur-3xl rounded-full float-y" />
                            <div className="absolute -bottom-20 -right-20 size-72 bg-[#111814]/20 blur-3xl rounded-full float-y-slow" />
                            <div className="relative flex flex-col gap-4 items-center">
                              <h2 className="text-[#111814] tracking-tight text-3xl font-extrabold leading-tight md:text-6xl md:tracking-[-0.04em] max-w-[800px]">
                                Ready to boost your team's productivity?
                              </h2>
                              <p className="text-[#111814]/80 text-lg md:text-xl font-medium max-w-[600px]">
                                Join 10,000+ teams today and transform how you work together. Start your free trial in seconds.
                              </p>
                            </div>
                            <div className="relative flex flex-wrap justify-center gap-4">
                              <Link href={"/register"}>
                                <button className="group flex min-w-[180px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-14 px-8 bg-[#111814] text-white text-base font-bold leading-normal hover:bg-[#1a2e23] transition-all shadow-xl hover:-translate-y-0.5">
                                  <span className="truncate">Get Started Now</span>
                                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                </button>
                              </Link>
                              <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-white/30 text-[#111814] text-base font-bold leading-normal border border-[#111814]/10 backdrop-blur-sm hover:bg-white/50 transition-all">
                                <span className="truncate">Book a Demo</span>
                              </button>
                            </div>
                          </div>
                        </TiltCard>
                      </ScrollReveal>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="relative px-10 lg:px-40 py-16 glass border-t border-white/30 dark:border-[#1e3a2f]">
            <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="size-6 text-landing-page-primary spin-slow">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path
                        clipRule="evenodd"
                        d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">WorkNest</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-8">
                  <a className="text-[#608a79] hover:text-landing-page-primary transition-colors text-sm font-semibold" href="#">Privacy Policy</a>
                  <a className="text-[#608a79] hover:text-landing-page-primary transition-colors text-sm font-semibold" href="#">Terms of Service</a>
                  <a className="text-[#608a79] hover:text-landing-page-primary transition-colors text-sm font-semibold" href="#">Contact Us</a>
                  <a className="text-[#608a79] hover:text-landing-page-primary transition-colors text-sm font-semibold" href="#">Careers</a>
                </div>
                <div className="flex gap-4">
                  <a className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#608a79] hover:text-landing-page-primary transition-colors" href="#">
                    <Earth className="size-5" />
                  </a>
                  <a className="w-10 h-10 rounded-full glass flex items-center justify-center text-[#608a79] hover:text-landing-page-primary transition-colors" href="#">
                    <AtSign className="size-5" />
                  </a>
                </div>
              </div>
              <div className="border-t border-white/30 dark:border-[#1e3a2f] pt-8 text-center">
                <p className="text-[#608a79] text-sm font-medium">
                  © 2025 WorkNest Inc. Empowering teams everywhere.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
