export type Link = {
  id: number;
  userId: number;
  title: string;
  url: string;
  icon: string | null ;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
