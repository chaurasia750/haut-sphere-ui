import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StatusBreakdown, MonthlyTrend } from '../../models/lead.model';

@Component({
  selector: 'lib-leads-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leads-charts.component.html',
})
export class LeadsChartsComponent {
  @Input({ required: true }) leadStatuses: StatusBreakdown[] = [];
  @Input({ required: true }) monthlyTrends: MonthlyTrend[] = [];

  get donutSegments(): { offset: number; length: number; color: string; label: string }[] {
    const total = this.leadStatuses.reduce((s, x) => s + x.value, 0) || 1;
    const circumference = 2 * Math.PI * 54;
    let offset = 0;
    return this.leadStatuses.map(s => {
      const length = (s.value / total) * circumference;
      const seg = { offset, length, color: s.color, label: s.label };
      offset += length;
      return seg;
    });
  }

  get totalLeads(): number {
    return this.leadStatuses.reduce((s, x) => s + x.value, 0);
  }

  get chartPoints(): { leads: string; conversions: string } {
    const d = this.monthlyTrends;
    if (!d.length) return { leads: '', conversions: '' };
    const w = 380, h = 140;
    const max = Math.max(...d.map(m => Math.max(m.leads, m.conversions)), 1);
    const px = (i: number) => (i / (d.length - 1 || 1)) * w;
    const py = (v: number) => h - (v / max) * h * 0.85 - 10;
    const leads = d.map((m, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(0)},${py(m.leads).toFixed(0)}`).join(' ');
    const conv = d.map((m, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(0)},${py(m.conversions).toFixed(0)}`).join(' ');
    return { leads, conversions: conv };
  }

  get areaPath(): string {
    const d = this.monthlyTrends;
    if (!d.length) return '';
    const w = 380, h = 140;
    const max = Math.max(...d.map(m => Math.max(m.leads, m.conversions)), 1);
    const px = (i: number) => (i / (d.length - 1 || 1)) * w;
    const py = (v: number) => h - (v / max) * h * 0.85 - 10;
    const pts = d.map((m, i) => `${px(i).toFixed(0)},${py(m.leads).toFixed(0)}`).join(' ');
    return `M0,${h + 10} L${px(0).toFixed(0)},${py(d[0].leads).toFixed(0)} ${pts} L${px(d.length - 1).toFixed(0)},${h + 10} Z`;
  }
}
