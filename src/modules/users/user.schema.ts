import { z } from 'zod'
import { RoleEnum } from "@/enums/RoleEnum";


const createUserSchema = z.object({
    email: z.email(),
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be at most 20 characters long"),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    phoneNumber: z.string(),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password must be at most 100 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[@#$%&+=]/, 'Password must contain at least one special character (@#$%&+=)')
    ,
})

const userIdShema = z.object({
    id: z.uuid('Invalid user ID format'),
})


type UserIdParams = z.infer<typeof userIdShema>
type CreateUserInput = z.infer<typeof createUserSchema> & {
    role: RoleEnum
    photo?: string
}


export {
    createUserSchema,
    userIdShema,
    UserIdParams,
    CreateUserInput,
}