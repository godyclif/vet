"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Heart,
  Stethoscope,
  Shield,
  Clock,
  Syringe,
  PawPrint,
} from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const t = useTranslations("Hero");
  const tServices = useTranslations("Services");

  const features = [
    {
      title: tServices("general.title"),
      description: tServices("general.description"),
      icon: Stethoscope,
    },
    {
      title: tServices("vaccination.title"),
      description: tServices("vaccination.description"),
      icon: Syringe,
    },
    {
      title: tServices("exotic.title"),
      description: tServices("exotic.description"),
      icon: PawPrint,
    },
    {
      title: tServices("emergency.title"),
      description: tServices("emergency.description"),
      icon: Clock,
    },
  ];

  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20">
        <div className="flex-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <PawPrint className="h-4 w-4" />
            Universalis Dierenzorg
          </div>
          <h1 className="text-foreground max-w-160 text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {t("title")}
          </h1>

          <p className="text-muted-foreground text-1xl mt-5 md:text-2xl">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">
            <Button asChild size="lg">
              <Link href="/contact">
                <Heart className="mr-2 h-5 w-5" />
                {t("cta")}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/verify">
                <Shield className="mr-2 h-5 w-5" />
                {t("secondaryCta")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center space-y-5 max-lg:pt-10 lg:pl-10">
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex gap-2.5 lg:gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-text text-foreground font-semibold">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground max-w-76 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24">
        <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 p-8">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <PawPrint className="h-12 w-12 text-primary" />
                <span className="text-sm font-medium">Dogs & Cats</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <Heart className="h-12 w-12 text-red-500" />
                <span className="text-sm font-medium">Birds</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <Shield className="h-12 w-12 text-green-500" />
                <span className="text-sm font-medium">Reptiles</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <Stethoscope className="h-12 w-12 text-blue-500" />
                <span className="text-sm font-medium">Small Mammals</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <Syringe className="h-12 w-12 text-purple-500" />
                <span className="text-sm font-medium">Exotic Pets</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl bg-background/80 p-6 shadow-lg backdrop-blur">
                <Clock className="h-12 w-12 text-orange-500" />
                <span className="text-sm font-medium">24/7 Emergency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
