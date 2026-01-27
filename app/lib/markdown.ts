export function parseMarkdown(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || "typescript"}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">$1</code>',
  );

  // Headers
  html = html.replace(
    /^### (.*)$/gm,
    '<h3 id="$1" class="text-2xl font-bold mt-8 mb-4">$1</h3>',
  );
  html = html.replace(
    /^## (.*)$/gm,
    '<h2 id="$1" class="text-3xl font-bold mt-12 mb-6">$1</h2>',
  );
  html = html.replace(
    /^# (.*)$/gm,
    '<h1 class="text-4xl font-bold mt-8 mb-6">$1</h1>',
  );

  // Bold
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-bold">$1</strong>',
  );

  // Lists
  html = html.replace(/^- (.*)$/gm, '<li class="ml-4">$1</li>');
  html = html.replace(
    /(<li.*<\/li>\s*)+/g,
    '<ul class="list-disc list-inside space-y-2 my-4">$&</ul>',
  );

  // Paragraphs
  html = html
    .split("\n\n")
    .map((para) => {
      if (para.trim().startsWith("<")) return para;
      if (para.trim() === "") return "";
      return `<div class="mb-4 leading-relaxed">${para}</div>`;
    })
    .join("\n");

  return html;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
