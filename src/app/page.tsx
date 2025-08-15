import Link from "next/link";

export const dynamic = "force-static";

export default function Home() {
  return (
    <section aria-labelledby="hero-heading" className="py-10">
      <h1 id="hero-heading" className="text-3xl font-semibold text-balance">
        Unlock Powerful SQL Analytics: Query, Visualize, and Discover Insights
      </h1>
      <p className="text-foreground mt-3">
        Unlock the power of data with our interactive SQL playground — built for data analysts.
        Write or select queries, then instantly explore, search, filter, and sort massive datasets.
        Experience fast, responsive, and insightful visualizations designed to make data analysis
        effortless.
      </p>
      <div className="mt-9">
        <Link
          href="/playground"
          className="bg-primary text-primary-foreground hover:bg-primary/80 inline-flex rounded px-4 py-2 font-semibold transition-colors"
        >
          Open Playground
        </Link>
      </div>
    </section>
  );
}
