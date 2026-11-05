const promises = [
  { title: "Discreet packaging", text: "A plain parcel, every time" },
  { title: "Natural", text: "Our recipes stay our secret" },
  { title: "Small batches", text: "Made with care" },
  { title: "Order on WhatsApp", text: "One message and it's done" },
];

export function TrustStrip() {
  return (
    <section aria-label="Our promises" className="bg-rose text-ink">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4 lg:px-3">
        {promises.map((p, i) => (
          <li key={p.title} className={`px-5 py-5 ${i % 2 === 1 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-burgundy/20`}>
            <p className="font-display text-lg leading-tight text-burgundy">{p.title}</p>
            <p className="mt-1 text-sm text-ink/80">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
