"use client"

import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const coords = [params.longitude, params.latitude].map(xy => Number(xy));

  return <div>{JSON.stringify(coords)}</div>
}