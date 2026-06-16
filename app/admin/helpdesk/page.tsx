'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import type { HelpdeskArticle, HelpdeskArticleStatus, HelpdeskTopic } from '@/lib/helpdesk';
import { renderMarkdown } from '@/lib/markdown';
import styles from './admin-helpdesk.module.css';

type TopicForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  sort_order: number;
  published: boolean;
};

type ArticleForm = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body_markdown: string;
  topic_id: string;
  tags: string;
  status: HelpdeskArticleStatus;
  featured: boolean;
};

const emptyTopic: TopicForm = {
  title: '',
  slug: '',
  description: '',
  sort_order: 0,
  published: true,
};

const emptyArticle: ArticleForm = {
  title: '',
  slug: '',
  excerpt: '',
  body_markdown: '## Overview\n\nWrite the support answer here.\n\n## Next steps\n\n- Add the first action.\n- Add the second action.',
  topic_id: '',
  tags: '',
  status: 'draft',
  featured: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inlineMarkdownToHtml(value: string) {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdownToEditorHtml(markdown: string) {
  const lines = markdown.split('\n');
  const blocks: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${inlineMarkdownToHtml(paragraph.join(' ').trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`).join('')}</ul>`);
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${inlineMarkdownToHtml(line.slice(3))}</h2>`);
      return;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(`<h3>${inlineMarkdownToHtml(line.slice(4))}</h3>`);
      return;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2));
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks.join('') || '<p><br></p>';
}

function inlineNodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const element = node as HTMLElement;
  const content = Array.from(element.childNodes).map(inlineNodeToMarkdown).join('');

  if (element.tagName === 'STRONG' || element.tagName === 'B') return `**${content}**`;
  if (element.tagName === 'EM' || element.tagName === 'I') return `*${content}*`;
  if (element.tagName === 'CODE') return `\`${content}\``;
  if (element.tagName === 'A') {
    const href = element.getAttribute('href') || '';
    return href ? `[${content}](${href})` : content;
  }

  return content;
}

function editorHtmlToMarkdown(root: HTMLElement) {
  const blocks: string[] = [];

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) blocks.push(text);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLElement;
    const tag = element.tagName;

    if (tag === 'H2') {
      blocks.push(`## ${inlineNodeToMarkdown(element).trim()}`);
      return;
    }

    if (tag === 'H3') {
      blocks.push(`### ${inlineNodeToMarkdown(element).trim()}`);
      return;
    }

    if (tag === 'UL') {
      const items = Array.from(element.querySelectorAll(':scope > li'))
        .map((item) => `- ${inlineNodeToMarkdown(item).trim()}`)
        .filter((item) => item !== '-');
      if (items.length) blocks.push(items.join('\n'));
      return;
    }

    if (tag === 'OL') {
      const items = Array.from(element.querySelectorAll(':scope > li'))
        .map((item, index) => `${index + 1}. ${inlineNodeToMarkdown(item).trim()}`)
        .filter((item) => !/^\d+\.\s*$/.test(item));
      if (items.length) blocks.push(items.join('\n'));
      return;
    }

    const text = inlineNodeToMarkdown(element).trim();
    if (text) blocks.push(text);
  });

  return blocks.join('\n\n').trim();
}

function MarkdownPreview({ markdown }: { markdown: string }) {
  const blocks = renderMarkdown(markdown);

  return <div className={styles.preview}>{blocks.length ? blocks : <p>Preview will appear here.</p>}</div>;
}

type EditorMode = 'visual' | 'markdown' | 'preview';

function RichMarkdownEditor({
  markdown,
  onChange,
}: {
  markdown: string;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const renderedMarkdownRef = useRef<string | null>(null);
  const [mode, setMode] = useState<EditorMode>('visual');

  useEffect(() => {
    if (mode !== 'visual' || !editorRef.current) return;

    const editor = editorRef.current;

    if (document.activeElement === editor && renderedMarkdownRef.current !== null) {
      return;
    }

    editor.innerHTML = markdownToEditorHtml(markdown);
    renderedMarkdownRef.current = markdown;
  }, [markdown, mode]);

  const syncMarkdown = () => {
    if (!editorRef.current) return;
    onChange(editorHtmlToMarkdown(editorRef.current));
  };

  const runCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    syncMarkdown();
  };

  const addLink = () => {
    const url = window.prompt('Paste the destination URL');
    if (!url) return;
    runCommand('createLink', url);
  };

  const switchMode = (nextMode: EditorMode) => {
    if (mode === 'visual') {
      syncMarkdown();
    }
    setMode(nextMode);
  };

  return (
    <div className={styles.richEditor}>
      <div className={styles.editorTabs} aria-label="Editor mode">
        <button
          className={mode === 'visual' ? styles.activeTab : ''}
          onClick={() => switchMode('visual')}
          type="button"
        >
          Visual
        </button>
        <button
          className={mode === 'markdown' ? styles.activeTab : ''}
          onClick={() => switchMode('markdown')}
          type="button"
        >
          Markdown
        </button>
        <button
          className={mode === 'preview' ? styles.activeTab : ''}
          onClick={() => switchMode('preview')}
          type="button"
        >
          Preview
        </button>
      </div>

      {mode === 'visual' && (
        <>
          <div className={styles.editorToolbar} aria-label="Formatting toolbar">
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('formatBlock', 'p')} type="button">
              ¶
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('formatBlock', 'h2')} type="button">
              H2
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('formatBlock', 'h3')} type="button">
              H3
            </button>
            <span className={styles.toolbarDivider} />
            <button aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('bold')} type="button">
              B
            </button>
            <button aria-label="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('italic')} type="button">
              I
            </button>
            <button
              aria-label="Bulleted list"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand('insertUnorderedList')}
              type="button"
            >
              • List
            </button>
            <span className={styles.toolbarDivider} />
            <button onMouseDown={(event) => event.preventDefault()} onClick={addLink} type="button">
              Link
            </button>
            <button onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand('unlink')} type="button">
              Unlink
            </button>
          </div>
          <div
            aria-label="Article body"
            className={styles.editorCanvas}
            contentEditable
            id="article-body"
            onBlur={syncMarkdown}
            onInput={syncMarkdown}
            ref={editorRef}
            role="textbox"
            suppressContentEditableWarning
            tabIndex={0}
          />
        </>
      )}

      {mode === 'markdown' && (
        <textarea
          className={`${styles.textarea} ${styles.markdownTextarea}`}
          id="article-body"
          value={markdown}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {mode === 'preview' && <MarkdownPreview markdown={markdown} />}
    </div>
  );
}

export default function AdminHelpdeskPage() {
  const [topics, setTopics] = useState<HelpdeskTopic[]>([]);
  const [articles, setArticles] = useState<HelpdeskArticle[]>([]);
  const [topicForm, setTopicForm] = useState<TopicForm>(emptyTopic);
  const [articleForm, setArticleForm] = useState<ArticleForm>(emptyArticle);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const topicsById = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [topicsResponse, articlesResponse] = await Promise.all([
        fetch('/api/admin/helpdesk/topics'),
        fetch('/api/admin/helpdesk/articles'),
      ]);

      if (!topicsResponse.ok || !articlesResponse.ok) {
        throw new Error('Failed to load helpdesk content');
      }

      const [topicsJson, articlesJson] = await Promise.all([
        topicsResponse.json(),
        articlesResponse.json(),
      ]);

      setTopics(topicsJson.data || []);
      setArticles(articlesJson.data || []);
    } catch (loadError) {
      console.error(loadError);
      setError('Could not load helpdesk content. Confirm the Supabase migration has been applied.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectTopic = (topic: HelpdeskTopic) => {
    setTopicForm({
      id: topic.id,
      title: topic.title,
      slug: topic.slug,
      description: topic.description,
      sort_order: topic.sort_order,
      published: topic.published,
    });
    setMessage('');
    setError('');
  };

  const selectArticle = (article: HelpdeskArticle) => {
    setArticleForm({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      body_markdown: article.body_markdown,
      topic_id: article.topic_id || '',
      tags: (article.tags || []).join(', '),
      status: article.status,
      featured: article.featured,
    });
    setMessage('');
    setError('');
  };

  const saveTopic = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        topicForm.id ? `/api/admin/helpdesk/topics/${topicForm.id}` : '/api/admin/helpdesk/topics',
        {
          method: topicForm.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(topicForm),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save topic');
      }

      setMessage(topicForm.id ? 'Topic updated.' : 'Topic created.');
      setTopicForm(emptyTopic);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save topic');
    } finally {
      setSaving(false);
    }
  };

  const archiveTopic = async () => {
    if (!topicForm.id) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/helpdesk/topics/${topicForm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to archive topic');

      setMessage('Topic unpublished.');
      setTopicForm(emptyTopic);
      await loadData();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : 'Failed to archive topic');
    } finally {
      setSaving(false);
    }
  };

  const saveArticle = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        articleForm.id
          ? `/api/admin/helpdesk/articles/${articleForm.id}`
          : '/api/admin/helpdesk/articles',
        {
          method: articleForm.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleForm),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save article');
      }

      setMessage(articleForm.id ? 'Article updated.' : 'Article created.');
      setArticleForm(emptyArticle);
      await loadData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const archiveArticle = async () => {
    if (!articleForm.id) return;
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/helpdesk/articles/${articleForm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to archive article');

      setMessage('Article archived.');
      setArticleForm(emptyArticle);
      await loadData();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : 'Failed to archive article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/admin" className={styles.brand}>
            True North Admin
          </Link>
          <nav className={styles.nav} aria-label="Admin navigation">
            <Link href="/admin">Dashboard</Link>
            <Link href="/helpdesk">View helpdesk</Link>
            <Link href="/">Back to site</Link>
          </nav>
        </div>
      </header>

      <section className={styles.container}>
        <div className={styles.hero}>
          <h1>Helpdesk CMS</h1>
          <p>
            Manage public helpdesk topics and articles. Published articles appear on `/helpdesk`;
            drafts and archived articles stay hidden from public routes.
          </p>
        </div>

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.layout} style={{ marginTop: message || error ? '18px' : 0 }}>
          <aside className={styles.stack}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Topics</h2>
                <button className={styles.secondaryButton} onClick={() => setTopicForm(emptyTopic)} type="button">
                  New topic
                </button>
              </div>
              <div className={styles.panelBody}>
                {loading ? (
                  <div className={styles.message}>Loading topics...</div>
                ) : topics.length === 0 ? (
                  <div className={styles.message}>No topics yet.</div>
                ) : (
                  <div className={styles.topicList}>
                    {topics.map((topic) => (
                      <button
                        className={`${styles.topicItem} ${topicForm.id === topic.id ? styles.selected : ''}`}
                        key={topic.id}
                        onClick={() => selectTopic(topic)}
                        type="button"
                      >
                        <strong>{topic.title}</strong>
                        <span>{topic.description || 'No description'}</span>
                        <div className={styles.pillRow}>
                          <span className={`${styles.pill} ${topic.published ? styles.published : styles.archived}`}>
                            {topic.published ? 'published' : 'hidden'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Articles</h2>
                <button className={styles.secondaryButton} onClick={() => setArticleForm(emptyArticle)} type="button">
                  New article
                </button>
              </div>
              <div className={styles.panelBody}>
                {loading ? (
                  <div className={styles.message}>Loading articles...</div>
                ) : articles.length === 0 ? (
                  <div className={styles.message}>No articles yet.</div>
                ) : (
                  <div className={styles.articleList}>
                    {articles.map((article) => (
                      <button
                        className={`${styles.articleItem} ${articleForm.id === article.id ? styles.selected : ''}`}
                        key={article.id}
                        onClick={() => selectArticle(article)}
                        type="button"
                      >
                        <strong>{article.title}</strong>
                        <span>{topicsById.get(article.topic_id || '')?.title || 'No topic'}</span>
                        <div className={styles.pillRow}>
                          <span className={`${styles.pill} ${styles[article.status]}`}>{article.status}</span>
                          {article.featured && <span className={styles.pill}>featured</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </aside>

          <div className={styles.stack}>
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>{topicForm.id ? 'Edit topic' : 'Create topic'}</h2>
              </div>
              <form className={styles.panelBody} onSubmit={saveTopic}>
                <div className={styles.stack}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="topic-title">Title</label>
                      <input
                        className={styles.input}
                        id="topic-title"
                        value={topicForm.title}
                        onChange={(event) =>
                          setTopicForm((current) => ({
                            ...current,
                            title: event.target.value,
                            slug: current.slug || slugify(event.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="topic-slug">Slug</label>
                      <input
                        className={styles.input}
                        id="topic-slug"
                        value={topicForm.slug}
                        onChange={(event) => setTopicForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="topic-description">Description</label>
                    <textarea
                      className={styles.textarea}
                      id="topic-description"
                      value={topicForm.description}
                      onChange={(event) => setTopicForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="topic-sort">Sort order</label>
                      <input
                        className={styles.input}
                        id="topic-sort"
                        type="number"
                        value={topicForm.sort_order}
                        onChange={(event) =>
                          setTopicForm((current) => ({ ...current, sort_order: Number(event.target.value) }))
                        }
                      />
                    </div>
                    <label className={styles.checkRow}>
                      <input
                        checked={topicForm.published}
                        onChange={(event) => setTopicForm((current) => ({ ...current, published: event.target.checked }))}
                        type="checkbox"
                      />
                      Published
                    </label>
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.button} disabled={saving} type="submit">
                      {topicForm.id ? 'Save topic' : 'Create topic'}
                    </button>
                    {topicForm.id && (
                      <button className={styles.dangerButton} disabled={saving} onClick={archiveTopic} type="button">
                        Hide topic
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>{articleForm.id ? 'Edit article' : 'Create article'}</h2>
              </div>
              <form className={styles.panelBody} onSubmit={saveArticle}>
                <div className={styles.stack}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="article-title">Title</label>
                      <input
                        className={styles.input}
                        id="article-title"
                        value={articleForm.title}
                        onChange={(event) =>
                          setArticleForm((current) => ({
                            ...current,
                            title: event.target.value,
                            slug: current.slug || slugify(event.target.value),
                          }))
                        }
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="article-slug">Slug</label>
                      <input
                        className={styles.input}
                        id="article-slug"
                        value={articleForm.slug}
                        onChange={(event) =>
                          setArticleForm((current) => ({ ...current, slug: slugify(event.target.value) }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="article-topic">Topic</label>
                      <select
                        className={styles.select}
                        id="article-topic"
                        value={articleForm.topic_id}
                        onChange={(event) => setArticleForm((current) => ({ ...current, topic_id: event.target.value }))}
                      >
                        <option value="">No topic</option>
                        {topics.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="article-status">Status</label>
                      <select
                        className={styles.select}
                        id="article-status"
                        value={articleForm.status}
                        onChange={(event) =>
                          setArticleForm((current) => ({
                            ...current,
                            status: event.target.value as HelpdeskArticleStatus,
                          }))
                        }
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="article-excerpt">Excerpt</label>
                    <textarea
                      className={styles.textarea}
                      id="article-excerpt"
                      value={articleForm.excerpt}
                      onChange={(event) => setArticleForm((current) => ({ ...current, excerpt: event.target.value }))}
                    />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="article-tags">Tags</label>
                      <input
                        className={styles.input}
                        id="article-tags"
                        placeholder="metadata, stores, claims"
                        value={articleForm.tags}
                        onChange={(event) => setArticleForm((current) => ({ ...current, tags: event.target.value }))}
                      />
                    </div>
                    <label className={styles.checkRow}>
                      <input
                        checked={articleForm.featured}
                        onChange={(event) =>
                          setArticleForm((current) => ({ ...current, featured: event.target.checked }))
                        }
                        type="checkbox"
                      />
                      Featured on helpdesk home
                    </label>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="article-body">Article body</label>
                    <RichMarkdownEditor
                      markdown={articleForm.body_markdown}
                      onChange={(value) =>
                        setArticleForm((current) => ({ ...current, body_markdown: value }))
                      }
                    />
                  </div>

                  <div className={styles.actions}>
                    <button className={styles.button} disabled={saving} type="submit">
                      {articleForm.id ? 'Save article' : 'Create article'}
                    </button>
                    {articleForm.id && (
                      <button className={styles.dangerButton} disabled={saving} onClick={archiveArticle} type="button">
                        Archive article
                      </button>
                    )}
                    <Link className={styles.secondaryButton} href="/helpdesk">
                      View public helpdesk
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
