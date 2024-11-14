export default function Error() {
  return (
    <main className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">ERROR!</p>

      <button className="inline-block bg-accent-500 px-6 py-3 text-lg text-primary-800">
        Try again
      </button>
    </main>
  );
}
