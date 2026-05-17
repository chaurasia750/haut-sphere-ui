export interface AppLayoutMenuItem {
  label: string;
  route?: string;
  icon?: string;
  section?: string;
  subItems?: { name: string; path: string; pro?: boolean }[];
}

export interface AppLayoutUser {
  name: string;
  role: string;
}

export interface AppLayoutNotification {
  id: number;
  title: string;
  time: string;
  read?: boolean;
}

export interface AppLayoutConfig {
  appName: string;
  appSubtitle?: string;
  brandName?: string;
  footerText?: string;
  homeRoute?: string;
  user?: AppLayoutUser;
  notifications?: AppLayoutNotification[];
  menu: AppLayoutMenuItem[];
}
