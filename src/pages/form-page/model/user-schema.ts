import { z } from "zod"

export const userFormSchema = z.object({
  cardName: z.string().min(1, { error: "Name on card is required." }),
  cardNumber: z.string().min(16, { error: "Enter your 16-digit card number." }),
  expMonth: z.string().min(1, { error: "Select an expiration month." }),
  expYear: z.string().min(1, { error: "Select an expiration year." }),
  cvv: z.string().min(3, { error: "CVV is required." }),
  sameAsShipping: z.boolean(),
  comments: z.string(),
})

export type UserFormValues = z.infer<typeof userFormSchema>
