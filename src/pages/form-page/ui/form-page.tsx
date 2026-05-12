import { Form } from "@/components/form"
import { userFormConfig } from "../model/use-form-config"

export function FormPage() {
  return (
    <div className="flex min-h-svh p-6">
      <Form
        config={userFormConfig}
        onSubmit={(values) => console.log(values)}
      />
    </div>
  )
}
