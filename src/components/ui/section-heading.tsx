export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <span className="pill">{eyebrow}</span> : null}
      <h2
        className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl ${eyebrow ? "mt-4" : ""}`}
      >
        {title}
      </h2>
      {description ? <p className="mt-3 text-lg text-muted">{description}</p> : null}
    </div>
  );
}
