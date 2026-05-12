import { z } from "zod"

export const userFormSchema = z.object({
  name: z.string().min(1, { error: "이름을 입력해 주세요." }),
  email: z.email({ error: "올바른 이메일을 입력해 주세요." }),
  role: z.enum(["admin", "manager", "user"]),
  active: z.boolean(),
})

export type UserFormValues = z.infer<typeof userFormSchema>
