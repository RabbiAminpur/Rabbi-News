import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import { News } from '../types';

interface NewsCardProps {
  news: News;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formattedDate = format(news.createdAt.toDate(), 'd MMMM, yyyy', { locale: bn });

  return (
    <Link to={`/news/${news.id}`} className="group bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img 
          src={news.imageUrl || `https://picsum.photos/seed/${news.id}/800/450`} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {news.category}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            {formattedDate}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="mt-2 text-gray-600 text-sm line-clamp-3">
          {news.content}
        </p>
      </div>
    </Link>
  );
};
