import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MemberLeadsDashboardPageComponent } from './features/leads/pages/leads-dashboard/leads-dashboard-page.component';
import { MemberLeadsListPageComponent } from './features/leads/pages/leads-list/leads-list-page.component';
import { MemberLeadsAddPageComponent } from './features/leads/pages/leads-add/leads-add-page.component';
import { MemberLeadsDetailPageComponent } from './features/leads/pages/leads-detail/leads-detail-page.component';
import { ViewProfileComponent } from './features/profile-manager/view-profile/view-profile.component';
import { EditProfileComponent } from './features/profile-manager/edit-profile/edit-profile.component';
import { WelcomeLetterComponent } from './features/profile-manager/welcome-letter/welcome-letter.component';
import { SponsorNewComponent } from './features/profile-manager/sponsor-new/sponsor-new.component';
import { UpgradeRequestComponent } from './features/upgrade-manager/upgrade-request/upgrade-request.component';
import { KycDetailsComponent } from './features/upgrade-manager/kyc-details/kyc-details.component';
import { SponsorListComponent } from './features/network-manager/sponsor-list/sponsor-list.component';
import { MatchingTreeComponent } from './features/network-manager/matching-tree/matching-tree.component';
import { MatrixTreeComponent } from './features/network-manager/matrix-tree/matrix-tree.component';
import { MemberGenealogyTreeComponent } from './features/network-manager/genealogy-tree/genealogy-tree.component';
import { DownlineListComponent } from './features/network-manager/downline-list/downline-list.component';
import { LevelDetailsComponent } from './features/level-manager/level-details/level-details.component';
import { PayoutRequestComponent } from './features/financial-manager/payout-request/payout-request.component';
import { EwalletComponent } from './features/currency-wallet/ewallet/ewallet.component';
import { TransactionHistoryComponent } from './features/currency-wallet/transaction-history/transaction-history.component';
import { BankDetailsComponent } from './features/bank-details/bank-details.component';
import { InboxComponent } from './features/message-center/inbox/inbox.component';
import { ComposeMailComponent } from './features/message-center/compose-mail/compose-mail.component';
import { SentMailComponent } from './features/message-center/sent-mail/sent-mail.component';
import { ReferralLinkComponent } from './features/referral-link/referral-link.component';
import { CalenderComponent } from './features/calender/calender.component';
import { FormElementsComponent } from './features/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './features/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './features/blank/blank.component';
import { InvoicesComponent } from './features/invoices/invoices.component';
import { LineChartComponent } from './features/charts/line-chart/line-chart.component';
import { BarChartComponent } from './features/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './features/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './features/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './features/ui-elements/badges/badges.component';
import { ButtonsComponent } from './features/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './features/ui-elements/images/images.component';
import { VideosComponent } from './features/ui-elements/videos/videos.component';
import { NotFoundComponent } from './features/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { MemberInventoryListPageComponent } from './features/inventory/pages/inventory-list/inventory-list-page.component';
import { MemberInventoryDetailsPageComponent } from './features/inventory/pages/inventory-details/inventory-details-page.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'leads-dashboard', component: MemberLeadsDashboardPageComponent },
      { path: 'leads-list', component: MemberLeadsListPageComponent },
      { path: 'leads-add', component: MemberLeadsAddPageComponent },
      { path: 'leads-detail/:id', component: MemberLeadsDetailPageComponent },
      { path: 'inventory/list', component: MemberInventoryListPageComponent },
      { path: 'inventory/:id', component: MemberInventoryDetailsPageComponent },
      { path: 'referral-link', component: ReferralLinkComponent },
      { path: 'calendar', component: CalenderComponent },
      { path: 'sponsor-new', component: SponsorNewComponent },
      { path: 'view-profile', component: ViewProfileComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'welcome-letter', component: WelcomeLetterComponent },
      { path: 'upgrade-request', component: UpgradeRequestComponent },
      { path: 'kyc-details', component: KycDetailsComponent },
      { path: 'sponsor-list', component: SponsorListComponent },
      { path: 'genealogy', component: MemberGenealogyTreeComponent },
      { path: 'matching-tree', component: MatchingTreeComponent },
      { path: 'matrix-tree', component: MatrixTreeComponent },
      { path: 'downline-list', component: DownlineListComponent },
      { path: 'level-details', component: LevelDetailsComponent },
      { path: 'ewallet', component: EwalletComponent },
      { path: 'transaction-history', component: TransactionHistoryComponent },
      { path: 'payout-request', component: PayoutRequestComponent },
      { path: 'bank-details', component: BankDetailsComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'compose-mail', component: ComposeMailComponent },
      { path: 'sent-mail', component: SentMailComponent },
      { path: 'form-elements', component: FormElementsComponent },
      { path: 'basic-tables', component: BasicTablesComponent },
      { path: 'blank', component: BlankComponent },
      { path: 'invoice', component: InvoicesComponent },
      { path: 'line-chart', component: LineChartComponent },
      { path: 'bar-chart', component: BarChartComponent },
      { path: 'alerts', component: AlertsComponent },
      { path: 'avatars', component: AvatarElementComponent },
      { path: 'badge', component: BadgesComponent },
      { path: 'buttons', component: ButtonsComponent },
      { path: 'images', component: ImagesComponent },
      { path: 'videos', component: VideosComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
