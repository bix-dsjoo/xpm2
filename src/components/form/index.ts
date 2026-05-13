import { createFormHook } from "@tanstack/react-form"

import { FieldGroup, FieldSeparator } from "@/base/ui/field"

import { fieldContext, formContext } from "./model/form-context"
import { TextField } from "./ui/text-field"
import { SelectField } from "./ui/select-field"
import { CheckboxField } from "./ui/checkbox-field"
import { TextareaField } from "./ui/textarea-field"
import { FormFieldSet } from "./ui/form-field-set"
import { FormActions } from "./ui/form-actions"
import { SubmitButton } from "./ui/submit-button"
import { ResetButton } from "./ui/reset-button"
import { SwitchField } from "./ui/switch-field"

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    TextField,
    SelectField,
    CheckboxField,
    TextareaField,
    SwitchField,
  },

  formComponents: {
    FormFieldGroup: FieldGroup,
    FormFieldSet,
    FormFieldSeparator: FieldSeparator,
    FormActions,
    SubmitButton,
    ResetButton,
  },
})
