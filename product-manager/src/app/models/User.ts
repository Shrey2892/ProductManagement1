export interface User {
  id: number;
  username: string;
   imagePath?: string;
   role:string;
   isRestricted: boolean;
  isApproved:boolean;

  email?: string;           // new
  isEmailVerified: boolean; // new
  emailOtp?: string;        // new
  otpExpiry?: Date; 

  passwordResetToken?: string;
  tokenExpiry?: Date;
}