"use client";

import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";

import { DashedLine } from "../dashed-line";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const items = [
  {
    quote: "Universalis Dierenzorg has been amazing with our dog Max. The staff is incredibly caring and professional.",
    author: "Maria van der Berg",
    role: "Pet Owner",
    company: "Golden Retriever - Max",
  },
  {
    quote: "Finding a vet that truly understands reptiles is rare. The team here is knowledgeable and treats my bearded dragon with excellent care.",
    author: "Jan de Vries",
    role: "Reptile Enthusiast",
    company: "Bearded Dragon - Spike",
  },
  {
    quote: "Our parrot Coco needed specialized care, and the exotic animal team was exceptional. They explained everything clearly.",
    author: "Sophie Laurent",
    role: "Bird Owner",
    company: "African Grey Parrot - Coco",
  },
  {
    quote: "The emergency services saved our cat Luna's life. The 24/7 availability and quick response made all the difference.",
    author: "Peter Jansen",
    role: "Cat Owner",
    company: "Maine Coon - Luna",
  },
  {
    quote: "Best veterinary clinic for exotic pets! They treated my chinchilla with such care and expertise.",
    author: "Anna Bakker",
    role: "Small Mammal Owner",
    company: "Chinchilla - Fluffy",
  },
  {
    quote: "Professional, caring, and always available. I recommend Universalis Dierenzorg to everyone with pets.",
    author: "Thomas Klein",
    role: "Multi-Pet Owner",
    company: "Dogs, Cats & Rabbits",
  },
];

export const Testimonials = ({
  className,
  dashedLineClassName,
}: {
  className?: string;
  dashedLineClassName?: string;
}) => {
  const t = useTranslations("Testimonials");

  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl leading-snug">
              {t("subtitle")}
            </p>
          </div>

          <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="">
                {items.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="flex h-[120px] items-center justify-center bg-primary/10">
                          <Quote className="h-16 w-16 text-primary/30" />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-6 p-6">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <blockquote className="font-display text-base leading-relaxed font-medium">
                            "{testimonial.quote}"
                          </blockquote>
                          <div className="space-y-0.5 border-t pt-4">
                            <div className="text-primary font-semibold">
                              {testimonial.author}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn("mx-auto max-w-[80%]", dashedLineClassName)}
      />
    </>
  );
};
