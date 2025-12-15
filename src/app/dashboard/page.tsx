"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  PlusCircle, 
  LogOut,
  Copy,
  CheckCircle
} from "lucide-react";

import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const reportTypes = [
  { value: "general_checkup", label: "General Checkup" },
  { value: "emergency", label: "Emergency" },
  { value: "surgery", label: "Surgery" },
  { value: "vaccination", label: "Vaccination" },
  { value: "dental", label: "Dental" },
  { value: "laboratory", label: "Laboratory" },
  { value: "imaging", label: "Imaging" },
  { value: "followup", label: "Follow-up" },
  { value: "other", label: "Other" },
];

const species = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "reptile", label: "Reptile" },
  { value: "exotic", label: "Exotic" },
  { value: "other", label: "Other" },
];

export default function Dashboard() {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [generatedCertificate, setGeneratedCertificate] = useState("");
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    animalName: "",
    species: "",
    breed: "",
    dateOfBirth: "",
    weight: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    reportType: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    prescriptions: "",
    veterinarian: "",
    followUpDate: "",
    notes: "",
  });

  if (loading) {
    return (
      <Background>
        <section className="py-28 lg:pt-44 lg:pb-32">
          <div className="container flex justify-center">
            <p>Loading...</p>
          </div>
        </section>
      </Background>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleCopyCertificate = () => {
    navigator.clipboard.writeText(generatedCertificate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setGeneratedCertificate("");
    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        weight: parseFloat(formData.weight),
      };

      const res = await fetch("/api/med-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Medical report created successfully!");
        setGeneratedCertificate(data.certificateNumber);
        setFormData({
          animalName: "",
          species: "",
          breed: "",
          dateOfBirth: "",
          weight: "",
          ownerName: "",
          ownerEmail: "",
          ownerPhone: "",
          reportType: "",
          diagnosis: "",
          symptoms: "",
          treatment: "",
          prescriptions: "",
          veterinarian: "",
          followUpDate: "",
          notes: "",
        });
      } else {
        setError(data.message || "Failed to create report");
      }
    } catch {
      setError("An error occurred while creating the report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Background>
      <section className="py-28 lg:pt-44 lg:pb-32">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                <h2 className="text-xl font-bold">Create Medical Report & Register Animal</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Create a medical report which will register a new animal and generate a certificate number
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <p className="text-sm text-red-500 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {error}
                  </p>
                )}
                {success && generatedCertificate && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        {success}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border border-green-200 dark:border-green-800">
                      <p className="text-xs text-muted-foreground mb-2">Certificate Number:</p>
                      <div className="flex items-center gap-2">
                        <code className="text-lg font-mono font-bold text-green-700 dark:text-green-400">
                          {generatedCertificate}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyCertificate}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded"
                        >
                          {copied ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Share this certificate number with the owner to verify the animal's health status
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Animal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Animal Name *</label>
                      <Input
                        placeholder="e.g., Max"
                        value={formData.animalName}
                        onChange={(e) =>
                          setFormData({ ...formData, animalName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Species *</label>
                      <Select
                        value={formData.species}
                        onValueChange={(value) =>
                          setFormData({ ...formData, species: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          {species.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Breed *</label>
                      <Input
                        placeholder="e.g., Golden Retriever"
                        value={formData.breed}
                        onChange={(e) =>
                          setFormData({ ...formData, breed: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date of Birth *</label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Weight (kg) *</label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 32.5"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold mb-4 mt-6">Owner Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Owner Name *</label>
                      <Input
                        placeholder="e.g., John Doe"
                        value={formData.ownerName}
                        onChange={(e) =>
                          setFormData({ ...formData, ownerName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Owner Email *</label>
                      <Input
                        type="email"
                        placeholder="owner@example.com"
                        value={formData.ownerEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, ownerEmail: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Owner Phone *</label>
                      <Input
                        placeholder="+31 6 12345678"
                        value={formData.ownerPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, ownerPhone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <h3 className="font-semibold mb-4 mt-6">Medical Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type *</label>
                      <Select
                        value={formData.reportType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, reportType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Veterinarian *</label>
                      <Input
                        placeholder="Dr. Name"
                        value={formData.veterinarian}
                        onChange={(e) =>
                          setFormData({ ...formData, veterinarian: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Follow-up Date</label>
                      <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) =>
                          setFormData({ ...formData, followUpDate: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Symptoms *</label>
                    <Textarea
                      placeholder="Describe the observed symptoms..."
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diagnosis *</label>
                    <Textarea
                      placeholder="Enter the diagnosis..."
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData({ ...formData, diagnosis: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Treatment *</label>
                    <Textarea
                      placeholder="Describe the treatment plan..."
                      value={formData.treatment}
                      onChange={(e) =>
                        setFormData({ ...formData, treatment: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prescriptions</label>
                    <Textarea
                      placeholder="List any prescriptions..."
                      value={formData.prescriptions}
                      onChange={(e) =>
                        setFormData({ ...formData, prescriptions: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <Textarea
                      placeholder="Any additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Creating Report..." : "Create Medical Report & Register Animal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Background>
  );
}
