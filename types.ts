export type Story = {
  id: number;
  username: string;
  location?: string;
  imageUrl: string;
  avatarUrl: string;
  isVerified?: boolean;
  isPromoted?: boolean;
};
