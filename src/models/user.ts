export interface AuditFields {
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  is_active: boolean;
  is_email_verified?: boolean;
  audit_fields?: AuditFields;
  /** @deprecated use is_active instead */
  disabled?: boolean;
}

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  disabled?: boolean;
};

export type APIError = {
  message?: string;
  errors?: Record<string, string>;
};

export default User;
