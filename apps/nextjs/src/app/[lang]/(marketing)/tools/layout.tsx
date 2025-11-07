export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout for tools: no marketing navbar/footer
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}

