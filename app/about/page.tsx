function AboutPage() {
  console.log("123");
  return (
    <section>
      <h1 className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center text-4xl font-bold leading-none tracking-wide sm:text-6xl">
        Hello
        <span className="bg-primary py-2 px-4 rounded-lg tracking-widest text-white">
          world
        </span>
      </h1>
      <p className="mt-6 text-lg tracking-wide leading-8 max-w-2xl mx-auto text-muted-foreground text-justify">
        <span className="font-semibold">
          Hi, I am Khang. This is my furniture e-commerce website project
        </span>{" "}
        built with Next.js and TypeScript, integrated with Shadcn UI. The
        website is designed with an SEO-friendly interface to attract organic
        traffic while focusing on optimizing the user experience through fast
        interactions, a modern layout, and flawless responsiveness on all
        devices. Additionally, it supports integration with analytical tools to
        track user behavior and enhance overall performance.
      </p>
    </section>
  );
}

export default AboutPage;
