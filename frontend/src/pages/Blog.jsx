import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"

const BASE_URL = "https://www.bookmybanquets.in/blog/wp-json/wp/v2"
const PER_PAGE = 10
const PAGINATION_LIMIT = 10

const Blog = () => {
  const { slug, categorySlug } = useParams()
  const navigate = useNavigate()

  const [loadingList, setLoadingList] = useState(false)

  const [posts, setPosts] = useState([])
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState([])
  const [categories, setCategories] = useState([])

  const [categoryName, setCategoryName] = useState("")
  const [categoryId, setCategoryId] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)

  // BLOG DETAILS LOADING SKELETON
  const BlogSkeleton = () => {
    return (
      <div className="animate-pulse max-w-3xl mx-auto px-4 py-10">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded w-2/3 mb-6"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6 mb-6"></div>
        <div className="h-64 bg-gray-300 rounded-md w-full mb-6"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-3/6"></div>
      </div>
    )
  }

  // BLOG LIST (PAGINATION PAGE) SKELETON
  const BlogCardSkeleton = () => {
    return (
      <div className="animate-pulse bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="h-56 bg-gray-300 w-full"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-300 w-full rounded"></div>
          <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
        </div>
      </div>
    )
  }

  const decodeHTML = (html) => {
    if (!html) return ""
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
  }

  // Sidebar
  useEffect(() => {
    fetch(`${BASE_URL}/posts?per_page=5&_embed`)
      .then((r) => r.json())
      .then(setRecentPosts)
      .catch(() => setRecentPosts([]))

    fetch(`${BASE_URL}/categories`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Blog Details
  useEffect(() => {
    if (!slug) return

    fetch(`${BASE_URL}/posts?slug=${slug}&_embed`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setPost(data[0])
        } else {
          // fallback: try fetching by path
          fetch(`${BASE_URL}/posts?_embed&per_page=1&search=${slug}`)
            .then((r) => r.json())
            .then((d) => setPost(d?.[0] || null))
        }
      })
      .catch(() => setPost(null))
  }, [slug])

  // Category Slug → ID
  useEffect(() => {
    if (!categorySlug) {
      setCategoryId(null)
      setCategoryName("")
      setPage(1)
      return
    }

    fetch(`${BASE_URL}/categories?slug=${categorySlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.length) {
          setCategoryId(d[0].id)
          setCategoryName(d[0].name)
          setPage(1) // reset pagination on category change
        }
      })
  }, [categorySlug])

  // Blog List
  useEffect(() => {
    if (slug) return

    setLoadingList(true)
    let url = `${BASE_URL}/posts?_embed&per_page=${PER_PAGE}&page=${page}`
    if (categoryId) url += `&categories=${categoryId}`

    fetch(url)
      .then((res) => {
        setTotalPages(Number(res.headers.get("X-WP-TotalPages")) || 1)
        setTotalPosts(Number(res.headers.get("X-WP-Total")) || 0)
        return res.json()
      })
      .then((data) => {
        setPosts(data)
        setLoadingList(false)
      })
      .catch(() => {
        setPosts([])
        setLoadingList(false)
      })
  }, [slug, categoryId, page])

  // Pagination Helpers
  const half = Math.floor(PAGINATION_LIMIT / 2)
  let start = Math.max(1, page - half)
  let end = Math.min(totalPages, start + PAGINATION_LIMIT - 1)

  if (end - start < PAGINATION_LIMIT - 1) {
    start = Math.max(1, end - PAGINATION_LIMIT + 1)
  }

  const showingFrom = totalPosts ? (page - 1) * PER_PAGE + 1 : 0
  const showingTo = Math.min(page * PER_PAGE, totalPosts)

  // Scroll to top whenever slug, categoryId, or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [slug, categoryId, page])

  return (
    <section className="bg-gray-50 select-none">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-gray-400 mb-6 flex flex-wrap gap-2 items-center">
          {/* Home */}
          <Link to="/" className="text-red-600 font-medium hover:text-gray-800">
            Home
          </Link>

          <span>/</span>

          {/* Blog */}
          {slug || categorySlug ? (
            <Link
              to="/blogs"
              className="text-red-600 font-medium hover:text-gray-800"
            >
              Blog
            </Link>
          ) : (
            <span className="text-gray-400 font-normal">Blog</span>
          )}

          {/* Category */}
          {categoryName && (
            <>
              <span>/</span>
              <span className="text-gray-400">{categoryName}</span>
            </>
          )}

          {/* Post Title */}
          {slug && post && (
            <>
              <span>/</span>
              <span className="text-gray-600 font-normal">
                {decodeHTML(post.title.rendered)}
              </span>
            </>
          )}
        </nav>
        {!slug && (
          <h1 className="text-3xl md:text-4xl font-extrabold mb-10">
            {categoryName || "Blog List"}
          </h1>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN */}
          <main className="lg:col-span-8 space-y-10">
            {/* BLOG DETAILS LOADING FIX */}
            {slug && !post && <BlogSkeleton />}

            {/* BLOG DETAILS */}
            {slug && post && (
              <>
                {/* BLOG HEADER — ABOVE IMAGE */}
                <div className="my-6">
                  {/* CATEGORY */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {post._embedded?.["wp:term"]?.[0]?.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/blogs/category/${cat.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-red-600"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>

                  {/* TITLE */}
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
                    {decodeHTML(post.title.rendered)}
                  </h1>

                  {/* AUTHOR + DATE */}
                  <p className="text-gray-500 mb-12">
                    By{" "}
                    <span className="text-red-600">
                      {post._embedded?.author?.[0]?.name || "BookMyBanquets"}
                    </span>{" "}
                    / {new Date(post.date).toDateString()}
                  </p>
                </div>

                {/* FEATURE IMAGE SEPARATE — NOT INSIDE CARD */}
                <div className="w-full mb-8">
                  <img
                    src={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                    className="w-full h-[280px] md:h-[420px] object-cover rounded-3xl"
                    alt={post.title.rendered}
                  />
                </div>

                {/* CONTENT CARD BELOW IMAGE */}
                <article className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                </article>
              </>
            )}

            {/* BLOG LIST SKELETON (WHEN FETCHING) */}
            {!slug && loadingList && (
              <div className="grid gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* BLOG LIST */}
            {!slug &&
              !loadingList &&
              posts.map((p) => (
                <article
                  key={p.id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="grid md:grid-cols-2">
                    <img
                      src={p._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                      className="h-56 md:h-full w-full object-cover"
                      alt={p.title.rendered}
                    />
                    <div className="p-6">
                      <h2 className="text-xl md:text-2xl font-bold mb-3">
                        <Link
                          to={`/blogs/${p.slug}`}
                          className="hover:text-red-600"
                        >
                          {decodeHTML(p.title.rendered)}
                        </Link>
                      </h2>
                      <div
                        className="text-gray-600 mb-5 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: p.excerpt.rendered
                            .replace("[&hellip;]", "…")
                            .replace("[...]", "…")
                        }}
                      />
                      <Link
                        to={`/blogs/${p.slug}`}
                        className="text-red-600 font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}

            {/* PAGINATION */}
            {!slug && totalPages > 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 text-center">
                  Showing {showingFrom} to {showingTo} of {totalPosts} results
                </p>

                <div className="flex justify-center gap-2 flex-wrap">
                  {/* Prev Button */}
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`w-15 h-10 flex items-center justify-center rounded-lg border cursor-pointer
          ${
            page === 1
              ? "text-gray-400 border-gray-300 hover:bg-gray-100"
              : "text-gray-400 border-gray-300 hover:bg-gray-100"
          }
        `}
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  {[...Array(end - start + 1)].map((_, i) => {
                    const p = start + i
                    const isActive = p === page

                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg border transition cursor-pointer
              ${
                isActive
                  ? "bg-red-600 text-white border-red-600"
                  : "text-red-600 border-gray-300 hover:bg-gray-100"
              }
            `}
                      >
                        {p}
                      </button>
                    )
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`w-15 h-10 flex items-center justify-center rounded-lg border cursor-pointer
          ${
            page === totalPages
              ? "text-gray-400 border-gray-300 hover:bg-gray-100"
              : "text-gray-400 border-gray-300 hover:bg-gray-100"
          }
        `}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-5 lg:mt-2 lg:sticky lg:top-2 self-start">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-xl mb-1">Recent Posts</h3>
              <ul className="space-y-1.5">
                {recentPosts.map((rp) => (
                  <li key={rp.id}>
                    <li key={rp.id}>
                      <Link
                        to={`/blogs/${rp.slug}`}
                        className="hover:text-red-600"
                      >
                        {decodeHTML(rp.title.rendered)}
                      </Link>
                    </li>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-xl mb-1">Categories</h3>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => navigate(`/blogs/category/${cat.slug}`)}
                      className="w-full flex justify-between cursor-pointer hover:text-red-600"
                    >
                      {cat.name}
                      <span>→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default Blog
