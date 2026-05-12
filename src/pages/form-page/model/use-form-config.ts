import type { FormConfig } from "@/components/form"
import { userFormSchema, type UserFormValues } from "./user-schema"

const monthOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0")

  return { label: value, value }
})

const yearOptions = ["2024", "2025", "2026", "2027", "2028", "2029"].map(
  (year) => ({ label: year, value: year })
)

export const userFormConfig = {
  schema: userFormSchema,

  defaultValues: {
    cardName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    sameAsShipping: true,
    comments: "",
  },

  fieldSets: [
    {
      legend: "Payment Method",
      description: "All transactions are secure and encrypted",
      fieldGroups: [
        {
          name: "cardName",
          label: "Name on Card",
          type: "input",
          placeholder: "Evil Rabbit",
          required: true,
        },
        {
          name: "cardNumber",
          label: "Card Number",
          type: "input",
          placeholder: "1234 5678 9012 3456",
          description: "Enter your 16-digit card number",
          required: true,
        },
        {
          layout: "grid",
          columns: 3,
          fields: [
            {
              name: "expMonth",
              label: "Month",
              type: "select",
              placeholder: "MM",
              options: monthOptions,
            },
            {
              name: "expYear",
              label: "Year",
              type: "select",
              placeholder: "YYYY",
              options: yearOptions,
            },
            {
              name: "cvv",
              label: "CVV",
              type: "input",
              placeholder: "123",
              required: true,
            },
          ],
        },
      ],
    },
    {
      legend: "Billing Address",
      description: "The billing address associated with your payment method",
      fieldGroups: [
        {
          name: "sameAsShipping",
          label: "Same as shipping address",
          type: "checkbox",
        },
        {
          name: "comments",
          label: "Comments",
          type: "textarea",
          placeholder: "Add any additional comments",
        },
      ],
    },
  ],
} satisfies FormConfig<UserFormValues>
