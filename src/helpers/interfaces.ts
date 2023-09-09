export interface UserTokenInfo {
  email: string;
  email_verified: boolean;
  preferred_username: string;
  name: string;
  given_name: string;
  family_name: string;
  org_roles: OrgRoles | undefined;
}

interface OrgRoles {
  [key: string]: {
    roles: string[];
    name: string;
  };
}
