/**
 * Community Discussion Forum & Peer Muraja'ah Room
 * Allows students, mentors, and alumni to ask questions and share mnemonic tips
 */
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Heart, 
  Send, 
  PlusCircle, 
  Tag, 
  HelpCircle,
  Sparkles,
  Share2
} from 'lucide-react';

export const CommunityForum: React.FC = () => {
  const { forumPosts, addForumPost, likeForumPost, addForumReply } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('Surah Al-Mulk');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');

  const tags = ['all', 'Surah Al-Mulk', 'Tips Orang Dewasa', 'Tajwid & Makhraj', 'Partner Muraja\'ah', 'Juz \'Amma'];

  const filteredPosts = forumPosts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTag = selectedTag === 'all' || p.surahTag === selectedTag;
    return matchSearch && matchTag;
  });

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    addForumPost(newTitle, newContent, newTag);
    setNewTitle('');
    setNewContent('');
    setIsCreatingPost(false);
  };

  const handleSubmitReply = (postId: string) => {
    if (!replyInput.trim()) return;
    addForumReply(postId, replyInput);
    setReplyInput('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-4 h-4" />
            <span>Halaqah & Ruang Diskusi Santri</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Forum Interaksi & Berbagi Tips Kota Memori
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diskusikan jangkar visual ayat, konsultasikan tajwid, dan temukan sahabat muraja'ah sebaya.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPost(!isCreatingPost)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Topik Diskusi Baru</span>
        </button>
      </div>

      {/* New Post Creator Modal/Drawer */}
      {isCreatingPost && (
        <form onSubmit={handleSubmitPost} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-emerald-500/40 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Tulis Topik Baru untuk Komunitas
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul pertanyaan atau tips (contoh: Cara mengunci ayat 1-5 saat berkendara...)"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {tags.filter(t => t !== 'all').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <textarea
            required
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Jelaskan pertanyaan atau pengalaman Anda secara ramah..."
            className="w-full p-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingPost(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Terbitkan Diskusi (+25 XP)</span>
            </button>
          </div>
        </form>
      )}

      {/* Search & Tag Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi pembelajaran, tips kota memori, atau pertanyaan santri..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter tags (Interactive filter buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === t
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'all' ? 'Semua Topik' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-3"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {post.authorAvatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{post.author}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      · {post.role} · {post.createdAt}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    #{post.surahTag}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                {post.title}
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Interactions Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
              <button
                onClick={() => likeForumPost(post.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  post.isLiked ? 'text-rose-600 font-semibold' : 'hover:text-rose-600'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-rose-600' : ''}`} />
                <span>{post.likes} Doa & Suka</span>
              </button>

              <button
                onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{post.replies.length} Tanggapan</span>
              </button>
            </div>

            {/* Replies List */}
            {post.replies.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{reply.author}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                          ({reply.role})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input Box */}
            {activeReplyId === post.id && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(post.id)}
                  placeholder="Tuliskan jawaban atau doa untuk santri ini..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleSubmitReply(post.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  Kirim
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
