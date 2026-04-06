export type Role = "admin" | "member";
export type Plan = "free" | "pro";

export type Organization = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export type Membership = {
  organization_id: string;
  user_id: string;
  user_email: string;
  role: Role;
  created_at: string;
};

export type Invitation = {
  id: string;
  organization_id: string;
  email: string;
  role: Role;
  status: "pending" | "accepted" | "declined";
  token: string;
  invited_by: string;
  expires_at: string;
};
