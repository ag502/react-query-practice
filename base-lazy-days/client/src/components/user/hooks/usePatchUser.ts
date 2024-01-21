import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { queryKeys } from 'react-query/constants';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();
  const queryClient = useQueryClient();

  // TODO: replace with mutate function
  const { mutate: patchUser } = useMutation({
    mutationFn: (newUserData: User) => patchUserOnServer(newUserData, user),
    onMutate: async (newUserData: User | null) => {
      // cancel any outgoing queries for user data
      queryClient.cancelQueries([queryKeys.user]);

      // snapshot of previous user value
      const previousUserData: User = queryClient.getQueryData([queryKeys.user]);

      // optimistically update the cache with new use value
      updateUser(newUserData);

      // return context object with snapshot value
      return { previousUserData };
    },
    onError: (error, newData, context) => {
      // rollback cache to saved value
      if (context.previousUserData) {
        updateUser(context.previousUserData);
        toast({
          title: 'Updated failed',
          status: 'warning',
        });
      }
    },
    onSuccess: (userData: User | null) => {
      if (!user) return;
      updateUser(userData);
      toast({
        title: 'User updated!',
        status: 'success',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([queryKeys.user]);
    },
  });

  return patchUser;
}
