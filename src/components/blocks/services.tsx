"use client";

import { useTranslations } from "next-intl";
import {
  Stethoscope,
  Scissors,
  Sparkles,
  Syringe,
  Bug,
  Clock,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Services() {
  const t = useTranslations("Services");

  const services = [
    {
      icon: Stethoscope,
      title: t("general.title"),
      description: t("general.description"),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Scissors,
      title: t("surgery.title"),
      description: t("surgery.description"),
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Sparkles,
      title: t("dental.title"),
      description: t("dental.description"),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Syringe,
      title: t("vaccination.title"),
      description: t("vaccination.description"),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Bug,
      title: t("exotic.title"),
      description: t("exotic.description"),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Clock,
      title: t("emergency.title"),
      description: t("emergency.description"),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="group transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${service.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
