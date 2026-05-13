import { Form } from "@/components/config-form"
import { paymentFormConfig } from "../model/use-form-config"

export function ConfigFormPage() {
  return (
    <div className="flex min-h-svh p-6">
      <Form
        config={paymentFormConfig}
        onSubmit={(values) => console.log(values)}
      />
    </div>
  )
}
