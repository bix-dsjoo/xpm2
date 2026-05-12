import { Form } from "@/components/form"
import { userFormConfig } from "../model/use-form-config"

export function FormPage() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex w-full max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Form Page</h1>
        </div>
        <Form
          config={userFormConfig}
          onSubmit={(values) => console.log(values)}
        />
      </div>
    </div>
  )
}
