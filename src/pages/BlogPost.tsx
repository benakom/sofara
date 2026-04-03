import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/ambassador/Navbar";
import FooterSection from "@/components/ambassador/FooterSection";
import SEO from "@/components/SEO";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getRelatedArticles } from "@/data/blogArticles";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) return <Navigate to="/blog" replace />;

  const related = getRelatedArticles(article);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={article.title}
        description={article.excerpt}
        canonical={`https://www.sofara.io/blog/${article.slug}`}
        ogType="article"
        ogImage={article.image}
        article={{
          publishedTime: article.date,
          author: article.author,
          section: article.category,
          tags: article.tags,
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.image,
          datePublished: article.date,
          author: { "@type": "Organization", name: article.author, url: "https://www.sofara.io" },
          publisher: { "@type": "Organization", name: "Sofara", url: "https://www.sofara.io", logo: { "@type": "ImageObject", url: "https://www.sofara.io/favicon.png" } },
          mainEntityOfPage: `https://www.sofara.io/blog/${article.slug}`,
        }}
      />
      <Navbar />
      <main className="pt-24 sm:pt-28 pb-16">
        {/* Back */}
        <div className="px-5 sm:px-6 max-w-4xl mx-auto mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 sm:px-6 max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="text-primary border-primary/30">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />{article.readTime}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />{article.date}
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {article.excerpt}
          </p>
          <p className="text-xs text-muted-foreground mt-3">By {article.author}</p>
        </motion.header>

        {/* Hero image */}
        <div className="px-5 sm:px-6 max-w-5xl mx-auto mb-10">
          <div className="rounded-2xl overflow-hidden aspect-[21/9] shadow-card-dark">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Content */}
        <article className="px-5 sm:px-6 max-w-5xl mx-auto">
          <div className="blog-reading-surface rounded-3xl p-6 sm:p-10 lg:p-14">
            <div className="blog-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        {...props}
                      >
                        {children}
                        {isExternal && <ExternalLink className="inline w-3 h-3 ml-1 -mt-0.5" />}
                      </a>
                    );
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/30">
            {article.tags.map(tag => (
              <Link
                key={tag}
                to={`/blog?search=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Tag className="w-2.5 h-2.5" />{tag}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center">
            <h3 className="font-display text-lg sm:text-xl font-bold mb-2">
              Ready to earn from Dubai Real Estate?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Join Sofara's ambassador network — free, no license needed.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              Become an Ambassador <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="px-5 sm:px-6 max-w-7xl mx-auto mt-16">
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(rel => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`} className="group block">
                  <article className="rounded-xl border border-border/50 bg-secondary/20 overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/30 mb-2">
                        {rel.category}
                      </Badge>
                      <h3 className="font-display text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {rel.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* External partners */}
        <section className="px-5 sm:px-6 max-w-4xl mx-auto mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>Powered by</span>
            <a href="https://www.cevitas.ae" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              Cevitas Real Estate LLC
            </a>
            <span>•</span>
            <a href="https://www.offplansimulator.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
              Off-Plan Investment Simulator
            </a>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.date,
            author: {
              "@type": "Organization",
              name: article.author,
              url: "https://www.sofara.io",
            },
            publisher: {
              "@type": "Organization",
              name: "Sofara",
              url: "https://www.sofara.io",
            },
            mainEntityOfPage: `https://www.sofara.io/blog/${article.slug}`,
          }),
        }}
      />
    </div>
  );
};

export default BlogPost;
