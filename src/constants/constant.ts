

export const otpExpiry: Date = new Date(Date.now() + (10 * 60 * 1000));
export const verificationLinkExpiry: Date = new Date(Date.now() + 10 * 60 * 1000)

export const accessTokenExpiry: number = 1 * 24 * 60 * 60 * 1000
export const refreshTokenExpiry: number = 10 * 24 * 60 * 60 * 1000