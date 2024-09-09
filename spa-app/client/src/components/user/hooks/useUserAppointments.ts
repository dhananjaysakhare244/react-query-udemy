import { useQuery } from "@tanstack/react-query";

import type { Appointment } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { generateUserAppointmentKey } from "../../../react-query/key-factories";

import { useLoginData } from "@/auth/AuthContext";

async function getUserAppointments(
  userId: number,
  userToken: string
): Promise<Appointment[] | null> {
  const { data } = await axiosInstance.get(`/user/${userId}/appointments`, {
    headers: getJWTHeader(userToken),
  });
  return data.appointments;
}

export function useUserAppointments(): Appointment[] {
  const { userId, userToken } = useLoginData();
  const fallback: Appointment[] = [];
  const { data = fallback } = useQuery({
    enabled: !!userId,
    queryKey: generateUserAppointmentKey(userId, userToken),
    queryFn: () => getUserAppointments(userId, userToken),
  });
  return data;
}
