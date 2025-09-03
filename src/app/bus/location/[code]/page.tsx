
export default async function Page({ params }: {params: Promise<{code: string}>}) {
  const { code } = await params;
  return <div>Bus Location: {code}</div>;
};
