import z from "zod";
import { createUserSchema } from "@/modules/users/user.schema";

const LoginSchema = z.object({
    username: z.string().min(4),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be at most 100 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[@#$%&+=]/, 'Password must contain at least one special character (@#$%&+=)')
    ,
});

const RegisterSchema = createUserSchema.extend(z.object({
    phoneNumber: z.string().min(6)
})
    .shape)


type LoginInput = z.infer<typeof LoginSchema>
type RegisterInput = z.infer<typeof RegisterSchema>

export {
    LoginSchema,
    RegisterSchema,
    LoginInput,
    RegisterInput
}