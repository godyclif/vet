"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Shield,
  Calendar,
  Weight,
  User,
  Syringe,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  PawPrint,
  FileDown,
  Mail,
  Phone,
} from "lucide-react";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type VerificationResult,
  generateMedicalReportPDF,
} from "@/lib/pdf-generator";

const SPECIES_LABELS: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  reptile: "Reptile",
  exotic: "Exotic Pet",
  other: "Other",
};

export default function VerifyPage() {
  const t = useTranslations("Verify");
  const tCommon = useTranslations("Common");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/verify?certificate=${encodeURIComponent(certificateNumber)}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || t("results.noResults"));
      } else {
        setResult(data.data);
      }
    } catch {
      setError("Failed to verify certificate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!result) return;

    setIsGeneratingPDF(true);
    try {
      generateMedicalReportPDF(result, {
        pdf: {
          medicalReport: t("pdf.medicalReport"),
          professionalCare: t("pdf.professionalCare"),
          cert: t("pdf.cert"),
          animalInfo: t("pdf.animalInfo"),
          name: t("pdf.name"),
          age: t("pdf.age"),
          speciesBreed: t("pdf.speciesBreed"),
          weight: t("pdf.weight"),
          dateOfBirth: t("pdf.dateOfBirth"),
          ownerInfo: t("pdf.ownerInfo"),
          email: t("pdf.email"),
          phone: t("pdf.phone"),
          medicalReports: t("pdf.medicalReports"),
          report: t("pdf.report"),
          veterinarian: t("pdf.veterinarian"),
          symptoms: t("pdf.symptoms"),
          diagnosis: t("pdf.diagnosis"),
          treatment: t("pdf.treatment"),
          prescriptions: t("pdf.prescriptions"),
          followUpDate: t("pdf.followUpDate"),
          notes: t("pdf.notes"),
          vaccinations: t("pdf.vaccinations"),
          administered: t("pdf.administered"),
          nextDue: t("pdf.nextDue"),
          cost: t("pdf.cost"),
          treatments: t("pdf.treatments"),
          date: t("pdf.date"),
          costSummary: t("pdf.costSummary"),
          totalTreatments: t("pdf.totalTreatments"),
          totalVaccines: t("pdf.totalVaccines"),
          totalCost: t("pdf.totalCost"),
          pageOf: t("pdf.pageOf"),
        },
        Common: {
          years: tCommon("years"),
          kg: tCommon("kg"),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("PDF Generation Error:", errorMessage);
      alert(`Failed to generate PDF: ${errorMessage}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <Background className="via-muted to-muted/80">
      <section className="py-28 lg:py-32 lg:pt-44">
        <div className="container max-w-5xl">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              {t("title")}
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleVerify} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("form.placeholder")}
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("form.searching") : t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Card className="mb-8 border-destructive">
              <CardContent className="flex items-center gap-4 pt-6">
                <AlertCircle className="h-6 w-6 text-destructive" />
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <div className="space-y-6">
              {/* PDF Download Button */}
              <div className="flex justify-end gap-2">
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  variant="outline"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
                </Button>
              </div>

              {/* Main Report Content */}
              <div ref={reportRef} className="space-y-6 bg-white p-8 print:p-0">
                {/* Animal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {t("results.animalInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <PawPrint className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("results.name")}
                          </p>
                          <p className="text-lg font-medium">{result.animal.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Certificate Number
                          </p>
                          <p className="text-lg font-mono font-bold">
                            {result.animal.certificateNumber}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <PawPrint className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("results.species")} / {t("results.breed")}
                          </p>
                          <p className="text-lg font-medium">
                            {SPECIES_LABELS[result.animal.species] ||
                              result.animal.species}{" "}
                            - {result.animal.breed}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Date of Birth
                          </p>
                          <p className="text-lg font-medium">
                            {new Date(result.animal.dateOfBirth).toLocaleDateString()}{" "}
                            ({result.animal.age} {tCommon("years")})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Weight className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t("results.weight")}
                          </p>
                          <p className="text-lg font-medium">
                            {result.animal.weight} {tCommon("kg")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      {t("results.ownerInfo")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {t("results.name")}
                        </p>
                        <p className="text-lg font-medium">
                          {result.animal.ownerName}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-lg">{result.animal.ownerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="text-lg">{result.animal.ownerPhone}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Reports */}
                {result.medReports.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        {t("results.medicalReports")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {result.medReports.map((report, idx) => (
                        <div key={idx} className="border-b last:border-b-0 pb-6 last:pb-0">
                          <h4 className="font-semibold text-lg mb-3">
                            {t("results.report")} {idx + 1}
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                {t("results.veterinarian")}
                              </p>
                              <p className="font-medium">{report.veterinarian}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t("results.symptoms")}</p>
                              <p>{report.symptoms}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t("results.diagnosis")}</p>
                              <p>{report.diagnosis}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t("results.treatment")}</p>
                              <p>{report.treatment}</p>
                            </div>
                            {report.prescriptions && (
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.prescriptions")}
                                </p>
                                <p>{report.prescriptions}</p>
                              </div>
                            )}
                            {report.notes && (
                              <div>
                                <p className="text-muted-foreground">{t("results.notes")}</p>
                                <p>{report.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Vaccines */}
                {result.vaccines.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Syringe className="h-5 w-5 text-primary" />
                        {t("results.vaccinations")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.vaccines.map((vaccine, idx) => (
                          <div
                            key={idx}
                            className="border-b last:border-b-0 pb-4 last:pb-0"
                          >
                            <p className="font-semibold mb-2">{vaccine.name}</p>
                            <div className="grid gap-2 text-sm md:grid-cols-2">
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.administered")}
                                </p>
                                <p>
                                  {new Date(
                                    vaccine.dateAdministered
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.nextDue")}
                                </p>
                                <p>
                                  {new Date(vaccine.nextDueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.veterinarian")}
                                </p>
                                <p>{vaccine.veterinarian}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.cost")}
                                </p>
                                <p className="font-semibold">€{vaccine.cost.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Treatments */}
                {result.treatments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        {t("results.treatments")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {result.treatments.map((treatment, idx) => (
                          <div
                            key={idx}
                            className="border-b last:border-b-0 pb-4 last:pb-0"
                          >
                            <p className="font-semibold mb-2">
                              {t(`results.treatment.${treatment.type}`)}
                            </p>
                            <div className="space-y-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.description")}
                                </p>
                                <p>{treatment.description}</p>
                              </div>
                              <div className="grid gap-2 md:grid-cols-2">
                                <div>
                                  <p className="text-muted-foreground">
                                    {t("results.date")}
                                  </p>
                                  <p>
                                    {new Date(treatment.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">
                                    {t("results.veterinarian")}
                                  </p>
                                  <p>{treatment.veterinarian}</p>
                                </div>
                              </div>
                              {treatment.notes && (
                                <div>
                                  <p className="text-muted-foreground">
                                    {t("results.notes")}
                                  </p>
                                  <p>{treatment.notes}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground">
                                  {t("results.cost")}
                                </p>
                                <p className="font-semibold">
                                  €{treatment.cost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Cost Summary */}
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle>{t("results.costSummary")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>{t("results.totalTreatments")}</span>
                        <span className="font-semibold">
                          €{result.costs.treatments.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.totalVaccines")}</span>
                        <span className="font-semibold">
                          €{result.costs.vaccines.toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold text-primary">
                        <span>{t("results.totalCost")}</span>
                        <span>€{result.costs.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </Background>
  );
}
