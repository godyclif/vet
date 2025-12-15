import jsPDF from "jspdf";

export interface AnimalData {
  _id: string;
  certificateNumber: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  age: number;
  weight: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  registrationDate: string;
  imageUrl?: string;
}

export interface Treatment {
  id: string;
  type: string;
  description: string;
  date: string;
  veterinarian: string;
  cost: number;
  notes?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  dateAdministered: string;
  nextDueDate: string;
  veterinarian: string;
  cost: number;
}

export interface MedReport {
  id: string;
  reportType: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  prescriptions: string;
  veterinarian: string;
  followUpDate?: string;
  notes: string;
  createdAt: string;
}

export interface VerificationResult {
  animal: AnimalData;
  treatments: Treatment[];
  vaccines: Vaccine[];
  medReports: MedReport[];
  costs: {
    treatments: number;
    vaccines: number;
    total: number;
  };
}

export interface TextOptions {
  align?: "left" | "center" | "right";
  isBold?: boolean;
  color?: readonly number[];
}

const COLORS = {
  primary: [212, 175, 140] as const,
  dark: [40, 35, 30] as const,
  lightGray: [245, 242, 235] as const,
  mediumGray: [230, 225, 215] as const,
};

const SPECIES_LABELS: Record<string, string> = {
  dog: "Dog",
  cat: "Cat",
  bird: "Bird",
  reptile: "Reptile",
  exotic: "Exotic Pet",
  other: "Other",
};

const TREATMENT_LABELS: Record<string, string> = {
  consultation: "Consultation",
  surgery: "Surgery",
  dental: "Dental Care",
  emergency: "Emergency",
  checkup: "Check-up",
  grooming: "Grooming",
  other: "Other",
};

const REPORT_TYPE_LABELS: Record<string, string> = {
  general_checkup: "General Checkup",
  emergency: "Emergency",
  surgery: "Surgery",
  vaccination: "Vaccination",
  dental: "Dental",
  laboratory: "Laboratory",
  imaging: "Imaging",
  followup: "Follow-up",
  other: "Other",
};

export class PDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private darkColor = COLORS.dark;

  constructor() {
    this.pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
  }

  private addText(
    text: string,
    x: number,
    y: number,
    size: number,
    options: TextOptions = {}
  ) {
    const { isBold = false, color = this.darkColor, align = "left" } = options;

    this.pdf.setFont("helvetica", isBold ? "bold" : "normal");
    this.pdf.setFontSize(size);
    this.pdf.setTextColor(color[0], color[1], color[2]);

    const textOptions: any = {};
    if (align !== "left") {
      textOptions.align = align;
    }

    if (align === "right") {
      this.pdf.text(text, x, y, textOptions);
    } else if (align === "center") {
      this.pdf.text(text, x, y, textOptions);
    } else {
      this.pdf.text(text, x, y);
    }
  }

  private addLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: readonly number[] = COLORS.mediumGray,
    width: number = 0.5
  ) {
    this.pdf.setDrawColor(color[0], color[1], color[2]);
    this.pdf.setLineWidth(width);
    this.pdf.line(startX, startY, endX, endY);
    this.pdf.setLineWidth(0.5);
  }

  private addRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: readonly number[] = COLORS.lightGray
  ) {
    this.pdf.setFillColor(color[0], color[1], color[2]);
    this.pdf.rect(x, y, width, height, "F");
  }

  private handlePageBreak(yPosition: number, threshold: number): number {
    if (yPosition > this.pageHeight - threshold) {
      this.pdf.addPage();
      return 15;
    }
    return yPosition;
  }

  generate(
    result: VerificationResult,
    translations: {
      pdf: Record<string, string>;
      Common: Record<string, string>;
    }
  ): void {
    const t = translations.pdf;
    const tCommon = translations.Common;
    let yPosition = 10;

    // Header
    this.addRect(0, 0, this.pageWidth, 30, COLORS.primary);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(18);
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text("Universalis Dierenzorg", 15, 12);
    this.pdf.setFontSize(9);
    this.pdf.text(t.medicalReport, 15, 19);
    this.pdf.setFontSize(7);
    this.pdf.text(t.professionalCare, 15, 24);

    // Right side header info
    this.pdf.setFontSize(8);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.text(new Date().toLocaleDateString(), this.pageWidth - 20, 12, {
      align: "right",
    });
    this.pdf.setFontSize(7);
    this.pdf.text(`${t.cert}: ${result.animal.certificateNumber}`, this.pageWidth - 20, 18, {
      align: "right",
    });

    yPosition = 38;

    // Animal Information Section
    this.addText(t.animalInfo, 15, yPosition, 10, {
      isBold: true,
      color: COLORS.primary,
    });
    yPosition += 5;
    this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 0.7);
    yPosition += 6;

    const animalInfoCol1 = [
      { label: t.name, value: result.animal.name },
      {
        label: t.age,
        value: `${result.animal.age} ${tCommon.years}`,
      },
    ];

    const animalInfoCol2 = [
      {
        label: t.speciesBreed,
        value: `${SPECIES_LABELS[result.animal.species] || result.animal.species} - ${result.animal.breed}`,
      },
      {
        label: t.weight,
        value: `${result.animal.weight} ${tCommon.kg}`,
      },
    ];

    // 2-column layout
    let tempY = yPosition;
    animalInfoCol1.forEach((item) => {
      this.addText(item.label, 15, tempY, 8, {
        isBold: true,
        color: [100, 100, 100],
      });
      this.addText(item.value, 50, tempY, 8);
      tempY += 5;
    });

    tempY = yPosition;
    animalInfoCol2.forEach((item) => {
      this.addText(item.label, 110, tempY, 8, {
        isBold: true,
        color: [100, 100, 100],
      });
      this.addText(item.value, 145, tempY, 8);
      tempY += 5;
    });

    yPosition += 11;
    const dobText = `${t.dateOfBirth}: ${new Date(
      result.animal.dateOfBirth
    ).toLocaleDateString()}`;
    this.addText(dobText, 15, yPosition, 8);
    yPosition += 6;

    // Owner Information Section
    this.addText(t.ownerInfo, 15, yPosition, 10, {
      isBold: true,
      color: COLORS.primary,
    });
    yPosition += 5;
    this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 0.7);
    yPosition += 6;

    const ownerData = [
      { label: t.name, value: result.animal.ownerName },
      { label: t.email, value: result.animal.ownerEmail },
      { label: t.phone, value: result.animal.ownerPhone },
    ];

    ownerData.forEach((item) => {
      this.addText(item.label, 15, yPosition, 8, {
        isBold: true,
        color: [100, 100, 100],
      });
      this.addText(item.value, 50, yPosition, 8);
      yPosition += 5;
    });

    yPosition += 5;

    // Medical Reports Section
    if (result.medReports.length > 0) {
      this.addText(t.medicalReports, 15, yPosition, 10, {
        isBold: true,
        color: COLORS.primary,
      });
      yPosition += 5;
      this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 0.7);
      yPosition += 6;

      result.medReports.forEach((report, idx) => {
        yPosition = this.handlePageBreak(yPosition, 40);

        this.addText(
          `${t.report} ${idx + 1}: ${REPORT_TYPE_LABELS[report.reportType] || report.reportType}`,
          15,
          yPosition,
          9,
          { isBold: true }
        );
        this.addText(new Date(report.createdAt).toLocaleDateString(), this.pageWidth - 20, yPosition, 8, {
          color: [120, 120, 120],
          align: "right",
        });
        yPosition += 5;

        this.addText(t.veterinarian, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(report.veterinarian, 75, yPosition, 7);
        yPosition += 3;

        this.addText(t.symptoms, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        yPosition += 2;
        const symptomLines = this.pdf.splitTextToSize(report.symptoms, this.pageWidth - 50);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setFontSize(7);
        this.pdf.setTextColor(this.darkColor[0], this.darkColor[1], this.darkColor[2]);
        this.pdf.text(symptomLines, 25, yPosition);
        yPosition += symptomLines.length * 2.8 + 1;

        this.addText(t.diagnosis, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        yPosition += 2;
        const diagnosisLines = this.pdf.splitTextToSize(report.diagnosis, this.pageWidth - 50);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setFontSize(7);
        this.pdf.text(diagnosisLines, 25, yPosition);
        yPosition += diagnosisLines.length * 2.8 + 1;

        this.addText(t.treatment, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        yPosition += 2;
        const treatmentLines = this.pdf.splitTextToSize(report.treatment, this.pageWidth - 50);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setFontSize(7);
        this.pdf.text(treatmentLines, 25, yPosition);
        yPosition += treatmentLines.length * 2.8 + 1;

        if (report.prescriptions) {
          this.addText(t.prescriptions, 20, yPosition, 7, {
            isBold: true,
            color: [100, 100, 100],
          });
          yPosition += 2;
          const prescriptionLines = this.pdf.splitTextToSize(report.prescriptions, this.pageWidth - 50);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.setFontSize(7);
          this.pdf.text(prescriptionLines, 25, yPosition);
          yPosition += prescriptionLines.length * 2.8 + 1;
        }

        if (report.followUpDate) {
          this.addText(t.followUpDate, 20, yPosition, 7, {
            isBold: true,
            color: [100, 100, 100],
          });
          this.addText(new Date(report.followUpDate).toLocaleDateString(), 75, yPosition, 7);
          yPosition += 3;
        }

        if (report.notes) {
          this.addText(t.notes, 20, yPosition, 7, {
            isBold: true,
            color: [100, 100, 100],
          });
          yPosition += 2;
          const noteLines = this.pdf.splitTextToSize(report.notes, this.pageWidth - 50);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.setFontSize(7);
          this.pdf.text(noteLines, 25, yPosition);
          yPosition += noteLines.length * 2.8 + 1;
        }

        yPosition += 2;
        this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.mediumGray);
        yPosition += 2;
      });

      yPosition += 1;
    }

    // Vaccines Section
    if (result.vaccines.length > 0) {
      yPosition = this.handlePageBreak(yPosition, 40);

      yPosition += 3;
      this.addText(t.vaccinations, 15, yPosition, 10, {
        isBold: true,
        color: COLORS.primary,
      });
      yPosition += 5;
      this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 0.7);
      yPosition += 6;

      result.vaccines.forEach((vaccine) => {
        yPosition = this.handlePageBreak(yPosition, 25);

        this.addText(vaccine.name, 15, yPosition, 8, { isBold: true });
        yPosition += 3;

        this.addText(t.administered, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(new Date(vaccine.dateAdministered).toLocaleDateString(), 75, yPosition, 7);
        yPosition += 3;

        this.addText(t.nextDue, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(new Date(vaccine.nextDueDate).toLocaleDateString(), 75, yPosition, 7);
        yPosition += 3;

        this.addText(t.veterinarian, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(vaccine.veterinarian, 75, yPosition, 7);
        yPosition += 3;

        this.addText(t.cost, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(`€${vaccine.cost.toFixed(2)}`, this.pageWidth - 20, yPosition, 7, {
          isBold: true,
          color: COLORS.primary,
          align: "right",
        });
        yPosition += 3;
        this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.mediumGray);
        yPosition += 2;
      });
    }

    // Treatments Section
    if (result.treatments.length > 0) {
      yPosition = this.handlePageBreak(yPosition, 40);

      yPosition += 3;
      this.addText(t.treatments, 15, yPosition, 10, {
        isBold: true,
        color: COLORS.primary,
      });
      yPosition += 5;
      this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 0.7);
      yPosition += 6;

      result.treatments.forEach((treatment) => {
        yPosition = this.handlePageBreak(yPosition, 30);

        this.addText(TREATMENT_LABELS[treatment.type] || treatment.type, 15, yPosition, 8, {
          isBold: true,
        });
        yPosition += 3;

        const descLines = this.pdf.splitTextToSize(treatment.description, this.pageWidth - 50);
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setFontSize(7);
        this.pdf.setTextColor(this.darkColor[0], this.darkColor[1], this.darkColor[2]);
        this.pdf.text(descLines, 20, yPosition);
        yPosition += descLines.length * 2.8 + 1;

        this.addText(t.date, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(new Date(treatment.date).toLocaleDateString(), 75, yPosition, 7);
        yPosition += 3;

        this.addText(t.veterinarian, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(treatment.veterinarian, 75, yPosition, 7);
        yPosition += 3;

        if (treatment.notes) {
          this.addText(t.notes, 20, yPosition, 7, {
            isBold: true,
            color: [100, 100, 100],
          });
          yPosition += 2;
          const noteLines = this.pdf.splitTextToSize(treatment.notes, this.pageWidth - 50);
          this.pdf.setFont("helvetica", "normal");
          this.pdf.setFontSize(7);
          this.pdf.text(noteLines, 25, yPosition);
          yPosition += noteLines.length * 2.8 + 1;
        }

        this.addText(t.cost, 20, yPosition, 7, {
          isBold: true,
          color: [100, 100, 100],
        });
        this.addText(`€${treatment.cost.toFixed(2)}`, this.pageWidth - 20, yPosition, 7, {
          isBold: true,
          color: COLORS.primary,
          align: "right",
        });
        yPosition += 3;
        this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.mediumGray);
        yPosition += 2;
      });
    }

    // Cost Summary Section
    yPosition = this.handlePageBreak(yPosition, 35);

    yPosition += 4;
    this.addRect(15, yPosition, this.pageWidth - 30, 24, COLORS.lightGray);
    this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.primary, 1);
    this.addText(t.costSummary, 20, yPosition + 4, 9, {
      isBold: true,
      color: COLORS.primary,
    });
    yPosition += 8;

    this.addText(t.totalTreatments, 20, yPosition, 8);
    this.addText(`€${result.costs.treatments.toFixed(2)}`, this.pageWidth - 20, yPosition, 8, {
      isBold: true,
      color: this.darkColor,
      align: "right",
    });
    yPosition += 4;

    this.addText(t.totalVaccines, 20, yPosition, 8);
    this.addText(`€${result.costs.vaccines.toFixed(2)}`, this.pageWidth - 20, yPosition, 8, {
      isBold: true,
      color: this.darkColor,
      align: "right",
    });
    yPosition += 5;

    this.addLine(15, yPosition, this.pageWidth - 15, yPosition, COLORS.mediumGray);
    yPosition += 4;

    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    this.pdf.text(t.totalCost, 20, yPosition);
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    this.pdf.text(`€${result.costs.total.toFixed(2)}`, this.pageWidth - 20, yPosition, {
      align: "right",
    });

    // Page numbers
    const totalPages = (this.pdf as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      (this.pdf as any).setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.text(
        `${t.pageOf} ${i} of ${totalPages}`,
        this.pageWidth / 2,
        this.pageHeight - 8,
        { align: "center" }
      );
    }
  }

  save(fileName: string): void {
    this.pdf.save(fileName);
  }
}

export function generateMedicalReportPDF(
  result: VerificationResult,
  translations: {
    pdf: Record<string, string>;
    Common: Record<string, string>;
  }
): void {
  const generator = new PDFGenerator();
  generator.generate(result, translations);
  generator.save(
    `${result.animal.name}_Medical_Report_${result.animal.certificateNumber}.pdf`
  );
}
