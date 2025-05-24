
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

const ResponseFormatter = ({ content }) => {
  console.log("content" , content)
  return (
     <>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ ...props }) => (
          <h1 className="text-2xl font-bold text-primary mb-4" {...props} />
        ),
        h2: ({ ...props }) => (
          <h2 className="text-xl font-semibold text-primary mb-3" {...props} />
        ),
        p: ({ ...props }) => (
          <p className="text-gray-800 leading-relaxed mb-2" {...props} />
        ),
        strong: ({ ...props }) => (
          <strong className="font-semibold text-gray-900" {...props} />
        ),
        li: ({ ...props }) => (
          <li
            className="ml-2 list-disc text-gray-800 leading-relaxed mb-1"
            {...props}
          />
        ),
        a: ({ ...props }) => (
          <a
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: ({ ...props }) => (
          <ul className="list-disc pl-5 space-y-1" {...props} />
        ),
      }}
    >
      {String(content || "")}
    </ReactMarkdown>
  </>
  )
}

export default ResponseFormatter