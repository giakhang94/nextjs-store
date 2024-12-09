"use client";

import { useFormState } from "react-dom";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { actionFunction } from "@/utils/types";

const initialState = { message: "" };
interface Props {
  children: React.ReactNode;
  action: actionFunction;
}

export default function FormContainer({ action, children }: Props) {
  const [state, formAction] = useFormState(action, initialState);
  const { toast } = useToast();
  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state]);
  return <form action={formAction}>{children}</form>;
}
