import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { MemberProfile, MemberProfileService } from '../../../shared/services/member-profile.service';
import { take } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-welcome-letter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    PageBreadcrumbComponent,
  ],
  templateUrl: './welcome-letter.component.html',
})
export class WelcomeLetterComponent implements OnInit {
  @ViewChild('letterSheet') letterSheet!: ElementRef<HTMLElement>;

  profile: MemberProfile | null = null;
  isLoading = true;
  isDownloading = false;

  constructor(
    private readonly memberProfileService: MemberProfileService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.memberProfileService.getProfile().pipe(take(1)).subscribe({
      next: (p) => { this.profile = p; this.isLoading = false; this.cdr.markForCheck(); },
      error: () => { this.isLoading = false; this.cdr.markForCheck(); },
    });
  }

  get fullName(): string {
    return [this.profile?.title, this.profile?.firstName, this.profile?.lastName]
      .filter(v => !!v?.trim()).join(' ') || '—';
  }

  get memberId(): string {
    return this.profile?.loginId?.trim() || this.profile?.registrationNumber?.trim() || '—';
  }

  get sponsorId(): string {
    return this.profile?.introRegNo?.trim() || '—';
  }

  get sponsorDisplay(): string {
    const s = this.profile?.sponsorDetails;
    if (!s) return this.sponsorId;
    const name = [s.title, s.fName, s.lName].filter(v => !!v?.trim()).join(' ');
    const login = s.loginId?.trim();
    if (name && login) return `${name} (${login})`;
    return name || login || this.sponsorId;
  }

  get activationDate(): string {
    return this.profile?.registrationDate || '—';
  }

  get refNo(): string {
    const reg = this.profile?.registrationNumber?.trim();
    const id = this.profile?.id;
    const year = this.profile?.registrationDate
      ? new Date(this.profile.registrationDate).getFullYear()
      : new Date().getFullYear();
    const idPadded = id ? String(id).padStart(6, '0') : '000000';
    const intro = this.profile?.introRegNo?.trim();
    const introNum = intro ? intro.replace(/\D/g, '').padStart(5, '0') : '00000';
    const regPart = reg || '00000';
    return `${year}/${idPadded}/${introNum}/${regPart}`;
  }

  get letterDate(): string {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  async downloadPdf(): Promise<void> {
    if (this.isDownloading) return;
    this.isDownloading = true;
    this.cdr.markForCheck();

    try {
      const el = this.letterSheet.nativeElement;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();

      const imgW = canvas.width;
      const imgH = canvas.height;
      const finalW = pdfW;
      const finalH = (imgH / imgW) * pdfW;

      pdf.addImage(imgData, 'PNG', 0, 0, finalW, finalH);
      pdf.save(`Welcome_Letter_${this.memberId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    } catch {
      window.print();
    } finally {
      this.isDownloading = false;
      this.cdr.markForCheck();
    }
  }
}
