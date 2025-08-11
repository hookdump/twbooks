import Timeline from '@/components/Timeline';

export default function Home() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
            Home
          </h1>
        </div>
      </div>

      {/* Timeline */}
      <Timeline />
    </div>
  );
}