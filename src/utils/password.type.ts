import { z } from "zod";

export const UserSchema = z
  .object({
    id: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(3, { message: "name must be at least 3 characters" }),
    role: z.string().min(1, { message: "Sex is a required field" }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Show error on confirm password field
  });

export type UserSchemaType = z.infer<typeof UserSchema>;

export const InviteUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type InviteUserSchemaType = z.infer<typeof InviteUserSchema>;
