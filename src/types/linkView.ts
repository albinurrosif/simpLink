export type LinkView = {
  id: number;
  linkId: number;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
};

export type CreateLinkViewParams = {
  linkId: number;
  ip: string;
  ua: string;
};