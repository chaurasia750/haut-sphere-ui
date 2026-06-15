export enum ClosingStatus {
  DRAFT = 'Draft',
  PENDING_VERIFICATION = 'Pending Verification',
  PENDING_APPROVAL = 'Pending Approval',
  APPROVED = 'Approved',
  CLOSED = 'Closed',
}

export enum PaymentMode {
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer',
  CHEQUE = 'Cheque',
  CASH = 'Cash',
}

export interface ClosingDocument {
  id?: number;
  type: 'aadhaar' | 'pan' | 'agreement' | 'payment_receipt';
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface LeadBookingInfo {
  applicationNo: string;
  customerName: string;
  coApplicantName: string;
  mobileNumber: string;
  emailAddress: string;
  address: string;
  projectName: string;
  sectorVillage: string;
  plotUnitNumber: string;
  plotSize: string;
  channelPartner: string;
  presenterName: string;
  bookingDate: string;
  bookingAmount: number;
  totalSaleValue: number;
  amountReceived: number;
  outstandingAmount: number;
}

export interface LeadClosingRequest {
  id?: number;
  leadId: number;
  aadhaarNumber: string;
  panNumber: string;
  coApplicantAadhaar: string;
  coApplicantPAN: string;
  finalAgreedRate: number;
  finalAmount: number;
  agreementDate: string;
  paymentMode: PaymentMode;
  transactionRefNumber: string;
  documents: ClosingDocument[];
  remarks: string;
  status: ClosingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClosingTimelineEvent {
  label: string;
  date: string;
  completed: boolean;
  active: boolean;
}

export const CLOSING_TIMELINE_STEPS: ClosingTimelineEvent[] = [
  { label: 'Lead Created', date: '', completed: false, active: false },
  { label: 'Booking Confirmed', date: '', completed: false, active: false },
  { label: 'Documents Verified', date: '', completed: false, active: false },
  { label: 'Accounts Verified', date: '', completed: false, active: false },
  { label: 'CRM Approved', date: '', completed: false, active: false },
  { label: 'Closed', date: '', completed: false, active: false },
];
