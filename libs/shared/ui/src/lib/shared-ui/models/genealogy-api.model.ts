export interface ApiMember {
  id: string;
  memberCode: string;
  fullName: string;
  parentId: string | null;
  hasChildren: boolean;
  childrenCount: number;
}
