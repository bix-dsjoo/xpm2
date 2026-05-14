import {
  mutationOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { QueryClient } from "@tanstack/react-query"

import { fetchSettings, saveSettings } from "../api/api"
import { toast } from "sonner"

export const settingsQueryKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsQueryKeys.all, "detail"] as const,
}

export const settingsQueries = {
  detail: () =>
    queryOptions({
      queryKey: settingsQueryKeys.detail(),
      queryFn: ({ signal }) => fetchSettings({ signal }),
      staleTime: 30_000,
    }),
}

export const settingsMutations = {
  save: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: saveSettings,

      onMutate: () => {
        const toastId = toast.loading("Saving settings...")
        return { toastId }
      },

      onSuccess: (_data, _variables, context) => {
        queryClient.invalidateQueries({
          queryKey: settingsQueryKeys.detail(),
        })

        toast.success("Settings saved.", {
          id: context?.toastId,
        })
      },

      onError: (_error, _variables, context) => {
        toast.error("Failed to save settings.", {
          id: context?.toastId,
        })
      },
    }),
}

export function useSettingsQuery() {
  return useQuery(settingsQueries.detail())
}

export function useSaveSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation(settingsMutations.save(queryClient))
}
