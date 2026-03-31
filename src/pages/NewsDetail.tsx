import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc, OperationType, handleFirestoreError } from '../firebase';
import { News } from '../types';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNews({ id: docSnap.id, ...docSnap.data() } as News);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">সংবাদটি পাওয়া যায়নি</h2>
        <Link to="/" className="text-red-600 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> মূল পাতায় ফিরে যান
        </Link>
      </div>
    );
  }

  const formattedDate = format(news.createdAt.toDate(), 'd MMMM, yyyy, h:mm a', { locale: bn });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft size={18} /> ফিরে যান
      </Link>

      <header className="mb-8">
        <div className="mb-4">
          <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
            {news.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 font-serif">
          {news.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-y py-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-red-600" />
            <span className="font-medium text-gray-700">{news.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-red-600" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      <div className="aspect-video rounded-xl overflow-hidden mb-10 shadow-lg">
        <img 
          src={news.imageUrl || `https://picsum.photos/seed/${news.id}/1200/675`} 
          alt={news.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="prose prose-lg max-w-none prose-red">
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-xl">
          <ReactMarkdown>{news.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
};
