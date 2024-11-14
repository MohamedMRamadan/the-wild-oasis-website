export default function Page() {
  return (
    <main className="mt-24">
      <img src="/bg.png" alt="Mountains and forests with two cabins" />

      <div className="relative z-10 text-center">
        <h1 className="mb-10 text-8xl font-normal tracking-tight text-primary-50">
          Welcome to paradise.
        </h1>
        <a
          href="/cabins"
          className="bg-accent-500 px-8 py-6 text-lg font-semibold text-primary-800 transition-all hover:bg-accent-600"
        >
          Explore luxury cabins
        </a>
      </div>
    </main>
  );
}
