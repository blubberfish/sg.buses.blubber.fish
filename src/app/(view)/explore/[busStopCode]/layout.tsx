export default function Layout({
  busStopInfo,
  children,
}: LayoutProps<"/explore/[busStopCode]">) {
  return (
    <>
      {busStopInfo}
      {children}
    </>
  );
}
