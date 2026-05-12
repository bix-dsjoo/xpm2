import { z } from "zod"

export const paymentFormSchema = z
  .object({
    enabled: z.boolean(),
    cardName: z.string(),
    cardNumber: z.string(),
    expMonth: z.string(),
    expYear: z.string(),
    cvv: z.string(),
    sameAsShipping: z.boolean(),
    comments: z.string(),
  })
  .check((context) => {
    const values = context.value

    if (!values.enabled) {
      return
    }

    if (values.cardName.length < 1) {
      context.issues.push({
        code: "custom",
        input: values.cardName,
        path: ["cardName"],
        message: "Name on card is required.",
      })
    }

    if (values.cardNumber.length < 16) {
      context.issues.push({
        code: "custom",
        input: values.cardNumber,
        path: ["cardNumber"],
        message: "Enter your 16-digit card number.",
      })
    }

    if (values.expMonth.length < 1) {
      context.issues.push({
        code: "custom",
        input: values.expMonth,
        path: ["expMonth"],
        message: "Select an expiration month.",
      })
    }

    if (values.expYear.length < 1) {
      context.issues.push({
        code: "custom",
        input: values.expYear,
        path: ["expYear"],
        message: "Select an expiration year.",
      })
    }

    if (values.cvv.length < 3) {
      context.issues.push({
        code: "custom",
        input: values.cvv,
        path: ["cvv"],
        message: "CVV is required.",
      })
    }
  })

export type PaymentFormValues = z.infer<typeof paymentFormSchema>
