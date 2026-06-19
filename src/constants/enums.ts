
export enum USER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum OTP_TYPES {
  EMAIL_VERIFICATION = "email_verification",
  LOGIN_OTP = "login_otp",
  PASSWORD_RESET = "password_reset",
  FORGOT_PASSWORD = "forgot_password",
}

export enum VERIFICATION_LINK_TYPE {
  LOGIN = "login_verification",
}

export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user",
}

export enum BLOG_STATUS {
  PUBLISHED = "published",
  DISABLED = "disabled",
  REMOVED = "removed",
}

export enum CATEGORY_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum REQUEST_SOURCE {
  BODY = "body",
  PARAMS = "params",
  QUERY = "query",
}

export enum FOLDERS {
  PROFILE = "users/profiles",
  DOCUMENTS = "users/documents",
  POSTS = "posts",
  GALLERY = "gallery",
}
