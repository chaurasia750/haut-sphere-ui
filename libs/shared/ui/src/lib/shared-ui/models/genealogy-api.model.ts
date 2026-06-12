export interface ApiMember {
  id: string;
  registrationNumber?: string | null;
  fullName: string;
  parentId: string | null;
  hasChildren: boolean;
  childrenCount: number;
  joiningDate?: string | null;
  joinDate?: string | null;
}
