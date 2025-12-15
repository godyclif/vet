"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin } from "lucide-react";

import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";

export default function Contact() {
  const t = useTranslations("Contact");

  const contactInfo = [
    {
      title: t("info.address"),
      icon: MapPin,
      content: t("info.addressValue"),
    },
    {
      title: t("info.phone"),
      icon: Phone,
      content: t("info.phoneValue"),
    },
    {
      title: t("info.email"),
      icon: Mail,
      content: t("info.emailValue"),
    },
    {
      title: t("info.hours"),
      icon: Clock,
      content: t("info.hoursValue"),
    },
  ];

  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-4xl">
        <h1 className="text-center text-2xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mt-4 text-center leading-snug font-medium lg:mx-auto">
          {t("subtitle")}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 md:mt-14 md:grid-cols-4 lg:mt-20">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-medium">{info.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{info.content}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Facebook className="size-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Twitter className="size-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="size-5" />
          </Link>
        </div>

        <DashedLine className="my-12" />

        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 text-lg font-semibold text-center">{t("form.message")}</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
