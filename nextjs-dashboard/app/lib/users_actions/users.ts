"use server";

import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import postgres from "postgres";
import { CreateUserSchema } from "../user_validation/user_schema";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function createUser(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    //Zod validation for the create form datas.
    const validatedFields = CreateUserSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;

    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${id}, ${name}, ${email}, ${hashedPassword});
    `;
  } catch (error: any) {
    console.error("Create user error:", error);

    // 23505 = unique_violation
    if (error.code === "23505") {
      return {
        success: false,
        errors: {
          email: ["An account with this email already exists"],
        },
      };
    }

    return {
      success: false,
      message: "Server error. Please try again.",
    };
  }

  // redirect if successful
  redirect("/login");
}
