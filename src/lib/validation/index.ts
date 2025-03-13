import { z } from "zod";

export const Signupvalidation = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
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
  name:z.string().min(2).max(2200),
  file: z.custom<File[]>(),
  bio:z.string().optional(),
})