import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { AppointmentDateMap } from "../types";
import { getMonthYearDetails, getNewMonthYear } from "./monthYear";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";

async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

export function useAppointments() {
  const currentMonthYear = getMonthYearDetails(dayjs());
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  const queryClient = useQueryClient();
  useEffect(() => {
    const { year, month } = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [queryKeys.appointments, year, month],
      queryFn: () => getAppointments(year, month),
    });
  }, [monthYear, queryClient]);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  const [showAll, setShowAll] = useState(false);

  const { userId } = useLoginData();

  const fallback: AppointmentDateMap = {};

  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
  });

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
