import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  password: z.string().min(6, "Password must be at least 6 characters long"),
});
