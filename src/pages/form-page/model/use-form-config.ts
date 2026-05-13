import type { FormConfig } from "@/components/config-form"
import {
  PAYMENT_FORM_DEFAULT_VALUES,
  paymentFormSchema,
  type PaymentFormValues,
} from "./payment-schema"

export const monthOptions = Array.from({ length: 12 }, (_, index) => {
  const value = String(index + 1).padStart(2, "0")

  return { label: value, value }
})

export const yearOptions = ["2024", "2025", "2026", "2027", "2028", "2029"].map(
  (year) => ({ label: year, value: year })
)

const enabledOnly = (values: PaymentFormValues) => values.enabled === true

export const paymentFormConfig = {
  schema: paymentFormSchema,

  defaultValues: PAYMENT_FORM_DEFAULT_VALUES,

  fieldSets: [
    {
      legend: "Payment Method",
      description: "All transactions are secure and encrypted",
      fieldGroups: [
        {
          name: "enabled",
          label: "Enabled",
          type: "switch",
        },
        {
          name: "cardName",
          label: "Name on Card",
          type: "input",
          placeholder: "Evil Rabbit",
          required: true,
          visibleWhen: enabledOnly,
        },
        {
          name: "cardNumber",
          label: "Card Number",
          type: "input",
          placeholder: "1234 5678 9012 3456",
          description: "Enter your 16-digit card number",
          required: true,
          visibleWhen: enabledOnly,
        },
        {
          layout: "grid",
          columns: 3,
          visibleWhen: enabledOnly,
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
} satisfies FormConfig<PaymentFormValues>
