type ColorSwatchProps = {
  name: string;
  token: string;
  className: string;
  usage: string;
};

export function ColorSwatch({ name, token, className, usage }: ColorSwatchProps) {
  return (
    <div className={`rounded-lg border p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <code className="text-xs opacity-70">{token}</code>
      </div>
      <p className="mt-2 text-xs opacity-80">{usage}</p>
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
