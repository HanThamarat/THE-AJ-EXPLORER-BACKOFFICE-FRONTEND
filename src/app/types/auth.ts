import z from 'zod';

export const signinSchema = z.object({
    username: z.string().min(0).max(100),
    password: z.string().min(0).max(100)
}).superRefine((data, ctx) => {    
    if (data.username.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter your username please.",
            path: ['username'],
        });
    }

    if (data.password.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter your password please.",
            path: ['password'],
        });
    }

    if (data.password.length < 6) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password least 6 characters",
            path: ['password'],
        })
    }
});

export type signInSchemaType = z.infer<typeof signinSchema>;