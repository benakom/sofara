// One chunk per article body: the blog page loads only the post being read.
const bodies = import.meta.glob<string>("./blog-content/*.ts", { import: "default" });

export const loadArticleContent = (slug: string): Promise<string> => {
  const load = bodies[`./blog-content/${slug}.ts`];
  return load ? load() : Promise.resolve("");
};
