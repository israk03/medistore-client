import Image from "next/image";

export default function Home() {
  return (
    <main>
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          MediStore is Ready 🚀
        </h1>
        <p className="text-slate-500">
          Your frontend setup is now clean and working.
        </p>
      </div>
    </div>
    </main>
  );
}
