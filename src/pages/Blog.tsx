import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import { blogArticles, blogCategories } from "@/data/blogArticles";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return blogArticles.filter(a => {
      const matchesSearch = !search || 
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = !activeCategory || a.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Dubai Real Estate Blog — Market Analysis, Investment Guides & AI Tools | Sofara"
        description="Expert insights on Dubai real estate: market trends 2026, investment guides, off-plan analysis, Emaar/Damac/Sobha reviews, Golden Visa tips, and AI tools for ambassadors."
        canonical="https://www.sofara.io/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Sofara Dubai Real Estate Blog",
          url: "https://www.sofara.io/blog",
          description: "Expert insights on Dubai real estate investment, market trends, and ambassador resources.",
          publisher: { "@type": "Organization", name: "Sofara", url: "https://www.sofara.io" },
          blogPost: blogArticles.slice(0, 10).map(a => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: `https://www.sofara.io/blog/${a.slug}`,
            datePublished: a.date,
            description: a.excerpt,
          })),
        }}
      />
      <Navbar />
      <main className="pt-24 sm:pt-28 pb-16">
        {/* Hero */}
        <section className="px-5 sm:px-6 max-w-7xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Dubai Real Estate{" "}
              <span className="text-gradient-gold">Insights</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
              Market analysis, investment guides, AI tools, and ambassador resources for Dubai's booming real estate market.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 bg-secondary border-border"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {blogCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Featured article */}
        {!search && !activeCategory && (
          <section className="px-5 sm:px-6 max-w-7xl mx-auto mb-12">
            <Link to={`/blog/${blogArticles[0].slug}`} className="block group">
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-[16/10] md:aspect-auto">
                    <img
                      src={blogArticles[0].image}
                      alt={blogArticles[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                    />
                  </div>
                  <div className="p-6 sm:p-10 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-3 text-primary border-primary/30">
                      {blogArticles[0].category}
                    </Badge>
                    <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {blogArticles[0].title}
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-3">
                      {blogArticles[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blogArticles[0].readTime}</span>
                      <span>{blogArticles[0].date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Article grid */}
        <section className="px-5 sm:px-6 max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(search || activeCategory ? filtered : filtered.slice(1)).map((article, i) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${article.slug}`} className="group block h-full">
                  <article className="h-full rounded-xl border border-border/50 bg-secondary/20 overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                          {article.category}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{article.readTime}
                        </span>
                      </div>
                      <h3 className="font-display text-sm sm:text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <span className="text-primary text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg mb-2">No articles found</p>
              <p className="text-sm">Try a different search term or category</p>
            </div>
          )}
        </section>

        {/* External links SEO section */}
        <section className="px-5 sm:px-6 max-w-7xl mx-auto mt-16">
          <div className="rounded-2xl border border-border/50 bg-secondary/20 p-8 sm:p-12 text-center">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-4">
              Your Dubai Real Estate Partners
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto mb-6">
              Sofara is powered by Cevitas Real Estate LLC, a fully licensed Dubai brokerage. 
              Use our free tools to explore investment opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.cevitas.ae"
                target="_blank"
                rel="noopener"
                className="px-6 py-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors text-sm font-medium text-foreground"
              >
                Cevitas Real Estate →
              </a>
              <a
                href="https://www.offplansimulator.com"
                target="_blank"
                rel="noopener"
                className="px-6 py-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors text-sm font-medium text-foreground"
              >
                Off-Plan Investment Simulator →
              </a>
              <Link
                to="/auth"
                className="px-6 py-3 rounded-xl text-sm font-medium text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                Become an Ambassador →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default Blog;
