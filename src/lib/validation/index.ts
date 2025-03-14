import { z } from "zod";

export const Signupvalidation = z.object({
  username: z
  .string()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(20, { message: "Username cannot exceed 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  }),

name: z
  .string()
  .min(1, { message: "Name cannot be empty" })
  .max(20, { message: "Name cannot exceed 50 characters" })
  .trim()
  .refine((value) => value.replace(/\s/g, "").length > 0, {
    message: "Name cannot be only spaces",
  })
  .refine((value) => !/[\u200B-\u200D\uFEFF]/g.test(value), {
    message: "Name contains invisible characters",
  }),
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
  email: z.string().email(),
});

export const Signinvalidation = z.object({
  password: z.string().min(8, {
    message: "password must be at least 8 characters.",
  }),
  email: z.string().email(),
});

export const PostValidation = z.object({
  caption:z.string().min(2).max(2200),
  file: z.custom<File[]>(),
  location:z.string().min(2).max(450),
  tags:z.string()
})
export const UserValidation = z.object({
  name: z
  .string()
  .min(1, { message: "Name cannot be empty" })
  .max(50, { message: "Name cannot exceed 50 characters" })
  .trim()
  .refine((value) => value.replace(/\s/g, "").length > 0, {
    message: "Name cannot be only spaces",
  })
  .refine((value) => !/[\u200B-\u200D\uFEFF]/g.test(value), {
    message: "Name contains invisible characters",
  }),
  file: z.custom<File[]>(),
  bio:z.string().optional(),
})