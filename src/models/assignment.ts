export interface AssignmentUser {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  is_email_verified: boolean;
  audit_fields: {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };
}

export interface Assignment {
  _id: string;
  user_id: AssignmentUser;
  email: string;
  seller: {
    id: number;
    name: string;
  };
  comment: string | null;
  image_url: string | null;
  is_authorized: boolean;
  audit_fields: {
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
  };
}
