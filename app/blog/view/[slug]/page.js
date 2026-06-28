"use client"

import Frame from '@/components/Frame/Frame'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const SingleBlogView = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${slug}`)
        const data = await res.json()

        if (data.success) {
          setBlog(data.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchBlogDetails()
  }, [slug])

  if (loading) {
    return (
      <Frame>
        <p>Loading...</p>
      </Frame>
    )
  }

  if (!blog) {
    return (
      <Frame>
        <p>Blog not found</p>
      </Frame>
    )
  }

  return (
    <Frame>
      <article className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-sm text-blue-600 font-medium mb-2">
          {blog.category?.name}
        </p>

        <h1 className="text-4xl font-bold mb-4">
          {blog.title}
        </h1>

        <p className="text-gray-600 mb-4">
          {blog.excerpt}
        </p>

        <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
          <img
            src={blog.author?.avatar}
            alt={blog.author?.name}
            className="w-10 h-10 rounded-full"
          />
          <span>By {blog.author?.name}</span>
          <span>•</span>
          <span>{blog.readingTimeMinutes} min read</span>
          <span>•</span>
          <span>{blog.views} views</span>
        </div>

        {blog.featuredImage?.url && (
          <img
            src={blog.featuredImage.url}
            alt={blog.featuredImage.altText || blog.title}
            className="w-full rounded-xl mb-8"
          />
        )}

        {blog.quickAnswer && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded mb-8">
            <h2 className="font-bold mb-2">Quick Answer</h2>
            <p>{blog.quickAnswer}</p>
          </div>
        )}

        {blog.keyTakeaways?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-3">Key Takeaways</h2>
            <ul className="list-disc pl-6 space-y-2">
              {blog.keyTakeaways.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {blog.tableOfContents?.length > 0 && (
          <section className="mb-8 bg-gray-50 p-5 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Table of Contents</h2>
            <ul className="space-y-2">
              {blog.tableOfContents.map((toc) => (
                <li key={toc._id}>
                  <a href={`#${toc.anchor}`} className="text-blue-600">
                    {toc.heading}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="prose max-w-none mb-8">
          <p>{blog.content}</p>
        </div>

        {blog.gallery?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blog.gallery.map((image) => (
                <div key={image._id}>
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="rounded-lg"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {image.caption}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {blog.faqSchema?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">FAQs</h2>

            <div className="space-y-4">
              {blog.faqSchema.map((faq) => (
                <div key={faq._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-gray-600 mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Frame>
  )
}

export default SingleBlogView