'use client';

import { useParams, useRouter } from "next/navigation";
import Login from "@/components/Login";
import { useRef } from "react";

export default function Cadastro() {
  const router = useRouter();
  const query = useRef();
  const query2 = useParams()
  const params = useParams<{ tag: string; item: string }>()


  console.log(query.current);
  console.log(query2);
  console.log(params);

  return <Login refParam={query.current} />;
}
