import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

const questions = [
  {
    question: "Where do you deliver?",
    answer:
      "Delivery is within Addis Ababa. Checkout will ask for a phone number, subcity, area, and a nearby landmark.",
  },
  {
    question: "How do I pay?",
    answer:
      "Payment options will be shown at checkout. A payment counts only after BH Kitchen verifies it.",
  },
  {
    question: "How do I track an order?",
    answer:
      "Use the order number together with the phone number entered at checkout.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
      <dl className="mt-8 space-y-8">
        {questions.map((item) => (
          <div key={item.question}>
            <dt className="font-medium">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-foreground/70">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
