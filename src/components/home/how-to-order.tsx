import { Eyebrow } from "../ui/decor";
import { Reveal, WordReveal } from "../ui/reveal";

const steps = [
  { title: "Choose your ritual", text: "Add your favourites to your bag, or start with the 7-Day Kit." },
  { title: "Send it on WhatsApp", text: "Your order goes to us in one message. We confirm payment and delivery with you personally." },
  { title: "Receive a plain parcel", text: "Nothing on the outside says what's inside. Nobody needs to know." },
];

export function HowToOrder() {
  return (
    <section className="py-11 lg:py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <h2 className="mt-3 font-display text-[clamp(1.89rem,5.44vw,3.02rem)] leading-[1.02]">
          <WordReveal text="Private, from" /> <span className="italic text-accent">start to finish.</span>
        </h2>
        <ol className="mt-7 grid border-t border-burgundy/20 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className={`border-b border-burgundy/20 py-7 lg:border-b-0 lg:px-8 ${i === 0 ? "lg:pl-0" : "lg:border-l"}`}>
              <span className="font-display text-3xl italic text-accent">{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 max-w-sm text-base leading-relaxed text-ink/80">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
