"use client";

import { useState, useTransition } from "react";
import { Globe } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales, localeNames, type Locale } from "@/i18n/config";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export function LanguageSwitcherClient() {
  const [isPending, startTransition] = useTransition();
  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const cookie = getCookie("locale");
    return (cookie as Locale) || "en";
  });

  const handleLocaleChange = (locale: Locale) => {
    setCurrentLocale(locale);
    startTransition(() => {
      document.cookie = `locale=${locale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <Select value={currentLocale} onValueChange={handleLocaleChange} disabled={isPending}>
      <SelectTrigger className="w-[120px] text-xs">
        <Globe className="mr-1 h-3 w-3" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeNames[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
