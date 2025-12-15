"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "General",
    questions: [
      {
        question: "What animals do you treat at Universalis Dierenzorg?",
        answer:
          "We treat all types of animals including dogs, cats, birds, reptiles (snakes, lizards, turtles), small mammals (rabbits, guinea pigs, hamsters), and exotic pets. Our team has specialized training to care for each species.",
      },
      {
        question: "Do I need an appointment or can I walk in?",
        answer:
          "We recommend making an appointment to ensure the best care and minimize wait times. However, we do accept walk-ins for emergencies. For non-urgent matters, please call us or book online.",
      },
      {
        question: "What are your opening hours?",
        answer:
          "We are open Monday through Friday from 8:00 to 18:00, and Saturday from 9:00 to 14:00. We also provide 24/7 emergency services for urgent cases.",
      },
    ],
  },
  {
    title: "Services & Pricing",
    questions: [
      {
        question: "How much does a general consultation cost?",
        answer:
          "A general consultation costs €45 for dogs and cats, and €55 for exotic pets. This includes a complete health examination, weight check, and professional advice. Vaccinations and treatments are charged separately.",
      },
      {
        question: "Do you offer payment plans for expensive procedures?",
        answer:
          "Yes, we understand that some procedures can be costly. We offer payment plans for surgical procedures and long-term treatments. Please speak with our reception team to discuss options.",
      },
    ],
  },
  {
    title: "Certificates & Records",
    questions: [
      {
        question: "How do I get my pet's vaccination certificate?",
        answer:
          "After each vaccination, we provide a certificate that you can use for travel or kennel requirements. You can also verify any certificate using our online verification system with the certificate number.",
      },
      {
        question: "Can I access my pet's medical records online?",
        answer:
          "Yes! Using your pet's certificate number, you can view their complete medical history, vaccination records, and treatment costs through our online verification portal.",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  const t = useTranslations("FAQ");
  const tContact = useTranslations("Contact");

  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-2", className2)}>
          <div className="space-y-4">
            {headerTag === "h1" ? (
              <h1 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                {t("title")}
              </h1>
            ) : (
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              {t("subtitle")}{" "}
              <Link href="/contact" className="underline underline-offset-4">
                {tContact("title").toLowerCase()}
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
