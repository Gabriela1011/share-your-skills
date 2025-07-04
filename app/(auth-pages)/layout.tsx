export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl min-h-screen w-fit flex flex-col gap-12 items-start">{children}</div>
  );
}
