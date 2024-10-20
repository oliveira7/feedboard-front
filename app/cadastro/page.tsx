'use client';

import { useSearchParams } from "next/navigation";
import Login from "@/components/Login";
import { useEffect, useState } from "react";

export default function Cadastro() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, [searchParams]);

  return <Login token={token} />;
}
