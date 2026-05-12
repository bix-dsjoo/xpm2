import type { FormConfig } from "@/components/form"
import { userFormSchema, type UserFormValues } from "./user-schema"

export const userFormConfig = {
  schema: userFormSchema,

  defaultValues: {
    name: "",
    email: "",
    role: "user",
    active: true,
  },

  fields: [
    {
      name: "name",
      label: "이름",
      type: "input",
      placeholder: "홍길동",
    },
    {
      name: "email",
      label: "이메일",
      type: "input",
      inputType: "email",
      placeholder: "user@example.com",
    },
    {
      name: "role",
      label: "권한",
      type: "select",
      options: [
        { label: "관리자", value: "admin" },
        { label: "매니저", value: "manager" },
        { label: "사용자", value: "user" },
      ],
    },
    {
      name: "active",
      label: "활성 상태",
      type: "checkbox",
      description: "체크하면 사용자가 활성화됩니다.",
    },
  ],

  submitLabel: "저장",
} satisfies FormConfig<UserFormValues>
