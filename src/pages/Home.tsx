import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db, collection, query, where, orderBy, onSnapshot, OperationType, handleFirestoreError } from '../firebase';
import { News } from '../types';
import { NewsCard } from '../components/NewsCard';
import { Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    setLoading(true);
    const newsRef = collection(db, 'news');
    let q = query(
      newsRef,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );

    if (category) {
      q = query(
        newsRef,
        where('isPublished', '==', true),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      setNewsList(newsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          {category ? `${category} সংবাদ` : 'সর্বশেষ সংবাদ'}
        </h1>
      </div>

      {newsList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">কোন সংবাদ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
};
