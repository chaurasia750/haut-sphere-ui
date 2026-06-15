import { Component, input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadClosingService } from '../../services/lead-closing.service';
import {
  LeadBookingInfo,
  LeadClosingRequest,
  ClosingStatus,
  PaymentMode,
  ClosingDocument,
  CLOSING_TIMELINE_STEPS,
  ClosingTimelineEvent,
} from '../../models/lead-closing.model';

@Component({
  selector: 'lib-leads-closing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leads-closing.component.html',
})
export class LeadsClosingComponent implements OnInit {
  private readonly closingService = inject(LeadClosingService);

  readonly leadId = input.required<number>();
  readonly appPrefix = input<string>('admin');

  readonly bookingInfo = signal<LeadBookingInfo | null>(null);
  readonly closingRequest = signal<LeadClosingRequest | null>(null);
  readonly timelineEvents = signal<ClosingTimelineEvent[]>(CLOSING_TIMELINE_STEPS);
  readonly loading = signal(true);
  readonly saving = signal(false);

  readonly editable = signal<Partial<LeadClosingRequest>>({
    aadhaarNumber: '',
    panNumber: '',
    coApplicantAadhaar: '',
    coApplicantPAN: '',
    finalAgreedRate: 0,
    finalAmount: 0,
    agreementDate: '',
    paymentMode: PaymentMode.BANK_TRANSFER,
    transactionRefNumber: '',
    documents: [],
    remarks: '',
  });

  readonly dragOver = signal<Record<string, boolean>>({
    aadhaar: false,
    pan: false,
    agreement: false,
    payment_receipt: false,
  });

  readonly PaymentMode = PaymentMode;
  readonly ClosingStatus = ClosingStatus;

  readonly statusBadgeClass = computed(() => {
    const status = this.closingRequest()?.status;
    switch (status) {
      case ClosingStatus.DRAFT:
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case ClosingStatus.PENDING_VERIFICATION:
        return 'bg-blue-50 text-blue-700 border-blue-300';
      case ClosingStatus.PENDING_APPROVAL:
        return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case ClosingStatus.APPROVED:
        return 'bg-green-50 text-green-700 border-green-300';
      case ClosingStatus.CLOSED:
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.closingService.getBookingInfo(this.leadId()).subscribe({
      next: (info) => {
        this.bookingInfo.set(info);
        this.loadClosingRequest();
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadClosingRequest(): void {
    this.closingService.getClosingRequest(this.leadId()).subscribe({
      next: (closing) => {
        this.closingRequest.set(closing);
        this.editable.set({
          aadhaarNumber: closing.aadhaarNumber,
          panNumber: closing.panNumber,
          coApplicantAadhaar: closing.coApplicantAadhaar,
          coApplicantPAN: closing.coApplicantPAN,
          finalAgreedRate: closing.finalAgreedRate,
          finalAmount: closing.finalAmount,
          agreementDate: closing.agreementDate,
          paymentMode: closing.paymentMode,
          transactionRefNumber: closing.transactionRefNumber,
          documents: closing.documents,
          remarks: closing.remarks,
        });
        this.updateTimeline(closing.status);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private updateTimeline(status: ClosingStatus): void {
    const statusOrder: Record<ClosingStatus, number> = {
      [ClosingStatus.DRAFT]: 0,
      [ClosingStatus.PENDING_VERIFICATION]: 1,
      [ClosingStatus.PENDING_APPROVAL]: 2,
      [ClosingStatus.APPROVED]: 3,
      [ClosingStatus.CLOSED]: 5,
    };

    const currentStep = statusOrder[status] ?? 0;
    this.timelineEvents.update((events) =>
      events.map((e, i) => ({
        ...e,
        completed: i <= currentStep && status !== ClosingStatus.DRAFT,
        active: i === currentStep,
      }))
    );
  }

  readonly finalAmountValue = computed(() => this.editable().finalAmount ?? 0);

  readonly outstandingValue = computed(() => {
    const info = this.bookingInfo();
    if (!info) return 0;
    const finalAmount = this.finalAmountValue();
    return finalAmount > 0 ? finalAmount - info.amountReceived : info.outstandingAmount;
  });

  onDragOver(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.update((d) => ({ ...d, [type]: true }));
  }

  onDragLeave(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.update((d) => ({ ...d, [type]: false }));
  }

  onDrop(event: DragEvent, type: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.update((d) => ({ ...d, [type]: false }));
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.uploadFile(files[0], type);
    }
  }

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadFile(input.files[0], type);
    }
  }

  private uploadFile(file: File, type: string): void {
    this.saving.set(true);
    this.closingService.uploadDocument(this.leadId(), file, type).subscribe({
      next: (result) => {
        const doc: ClosingDocument = {
          type: type as ClosingDocument['type'],
          fileName: result.fileName,
          fileUrl: result.fileUrl,
          uploadedAt: new Date().toISOString(),
        };
        this.editable.update((e) => ({ ...e, documents: [...(e.documents || []), doc] }));
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  removeDocument(type: string): void {
    this.editable.update((e) => ({
      ...e,
      documents: (e.documents || []).filter((d) => d.type !== type),
    }));
  }

  getDocumentByType(type: string): ClosingDocument | undefined {
    return (this.editable().documents || []).find((d) => d.type === type);
  }

  saveDraft(): void {
    this.saving.set(true);
    this.closingService.saveDraft(this.leadId(), this.editable()).subscribe({
      next: (res) => {
        this.closingRequest.set(res);
        this.updateTimeline(res.status);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  submitForVerification(): void {
    this.saving.set(true);
    const payload = { ...this.editable(), status: ClosingStatus.PENDING_VERIFICATION };
    this.closingService.submitForVerification(this.leadId(), payload as LeadClosingRequest).subscribe({
      next: (res) => {
        this.closingRequest.set(res);
        this.updateTimeline(res.status);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  approveClosing(): void {
    this.saving.set(true);
    this.closingService.approveClosing(this.leadId()).subscribe({
      next: (res) => {
        this.closingRequest.set(res);
        this.updateTimeline(res.status);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  rejectClosing(): void {
    const remarks = prompt('Please provide rejection remarks:');
    if (!remarks) return;
    this.saving.set(true);
    this.closingService.rejectClosing(this.leadId(), remarks).subscribe({
      next: (res) => {
        this.closingRequest.set(res);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  getDocumentIcon(type: string): string {
    switch (type) {
      case 'aadhaar':
        return 'id';
      case 'pan':
        return 'credit-card';
      case 'agreement':
        return 'file-text';
      case 'payment_receipt':
        return 'receipt';
      default:
        return 'file';
    }
  }

  getDocumentLabel(type: string): string {
    switch (type) {
      case 'aadhaar':
        return 'Upload Aadhaar';
      case 'pan':
        return 'Upload PAN';
      case 'agreement':
        return 'Upload Agreement Copy';
      case 'payment_receipt':
        return 'Upload Payment Receipt';
      default:
        return 'Upload File';
    }
  }
}
