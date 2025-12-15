"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Check, Stethoscope, Syringe, Scissors, Sparkles, Clock, Bug } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "General Consultation",
    price: "€45",
    icon: Stethoscope,
    features: [
      "Complete health examination",
      "Weight and vitals check",
      "Health advice",
      "Treatment plan if needed",
    ],
  },
  {
    name: "Vaccination Package",
    price: "€35",
    icon: Syringe,
    featured: true,
    features: [
      "Core vaccinations",
      "Health check included",
      "Vaccination certificate",
      "Reminder service",
    ],
  },
  {
    name: "Dental Care",
    price: "€85",
    icon: Sparkles,
    features: [
      "Dental examination",
      "Professional cleaning",
      "Extractions if needed",
      "Home care advice",
    ],
  },
  {
    name: "Surgical Procedures",
    price: "€150",
    pricePrefix: "From",
    icon: Scissors,
    features: [
      "Pre-surgical assessment",
      "Anesthesia included",
      "Post-op care",
      "Follow-up visit",
    ],
  },
  {
    name: "Exotic Pet Consultation",
    price: "€55",
    icon: Bug,
    features: [
      "Specialized exotic care",
      "Reptiles & amphibians",
      "Birds & small mammals",
      "Habitat advice",
    ],
  },
  {
    name: "Emergency Visit",
    price: "€95",
    icon: Clock,
    features: [
      "24/7 availability",
      "Immediate assessment",
      "Emergency treatment",
      "After-hours care",
    ],
  },
];

export const Pricing = ({ className }: { className?: string }) => {
  const t = useTranslations("Pricing");

  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.name}
                className={cn(
                  "transition-all hover:shadow-lg",
                  service.featured && "outline-primary origin-top outline-4"
                )}
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary">
                    {service.pricePrefix && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {service.pricePrefix}{" "}
                      </span>
                    )}
                    {service.price}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="space-y-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="text-muted-foreground flex items-center gap-1.5"
                      >
                        <Check className="size-5 shrink-0 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={service.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/contact">Book Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
