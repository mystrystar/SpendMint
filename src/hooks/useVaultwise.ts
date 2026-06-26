import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDeviceId } from "../lib/device";
import type { AllocationTarget, SavingsAction, Subscription } from "../types/domain";
import { vaultwiseApi } from "../services/api";

const keys = {
  app: (deviceId: string) => ["vaultwise", deviceId] as const,
};

export function useDeviceId() {
  return useMemo(() => getDeviceId(), []);
}

export function useVaultwise() {
  const deviceId = useDeviceId();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: keys.app(deviceId),
    queryFn: () => vaultwiseApi.bootstrap(deviceId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: keys.app(deviceId) });

  const saveSubscription = useMutation({
    mutationFn: vaultwiseApi.upsertSubscription,
    onSuccess: invalidate,
  });

  const deleteSubscription = useMutation({
    mutationFn: (id: string) => vaultwiseApi.deleteSubscription(deviceId, id),
    onSuccess: invalidate,
  });

  const markSaved = useMutation({
    mutationFn: ({ subscription, actionType, target }: { subscription: Subscription; actionType: SavingsAction; target: AllocationTarget }) =>
      vaultwiseApi.markSaved(deviceId, subscription, actionType, target),
    onSuccess: invalidate,
  });

  const rewardArticle = useMutation({
    mutationFn: ({ articleId, rewardType, rewardAmount }: { articleId: string; rewardType: "gold" | "silver"; rewardAmount: number }) =>
      vaultwiseApi.rewardArticle(deviceId, articleId, rewardType, rewardAmount),
    onSuccess: invalidate,
  });

  return {
    deviceId,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    saveSubscription,
    deleteSubscription,
    markSaved,
    rewardArticle,
    savings: vaultwiseApi.getSavings(),
    preferences: vaultwiseApi.getPreferences(),
    setPreferences: vaultwiseApi.setPreferences,
  };
}
