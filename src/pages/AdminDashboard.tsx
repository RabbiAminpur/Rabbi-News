import React, { useState, useEffect } from 'react';
import { auth, db, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, OperationType, handleFirestoreError } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, Loader2, Image as ImageIcon } from 'lucide-react';
import { News, CATEGORIES, Category } from '../types';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

export const AdminDashboard: React.FC = () => {
  const [user, loadingAuth] = useAuthState(auth);
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<News>>({
    title: '',
    content: '',
    category: 'রাজনীতি',
    imageUrl: '',
    isPublished: true
  });
  const [editId, setEditId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate('/login');
    }
  }, [user, loadingAuth, navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as News[];
      setNewsList(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
    });

    return () => unsubscribe();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newsData = {
        ...currentNews,
        authorUid: user.uid,
        authorName: user.displayName || 'Admin',
        updatedAt: serverTimestamp(),
      };

      if (editId) {
        await updateDoc(doc(db, 'news', editId), newsData);
      } else {
        await addDoc(collection(db, 'news'), {
          ...newsData,
          createdAt: serverTimestamp(),
        });
      }

      setIsEditing(false);
      setEditId(null);
      setCurrentNews({
        title: '',
        content: '',
        category: 'রাজনীতি',
        imageUrl: '',
        isPublished: true
      });
    } catch (error) {
      handleFirestoreError(error, editId ? OperationType.UPDATE : OperationType.CREATE, 'news');
    }
  };

  const handleEdit = (news: News) => {
    setCurrentNews({
      title: news.title,
      content: news.content,
      category: news.category as Category,
      imageUrl: news.imageUrl,
      isPublished: news.isPublished
    });
    setEditId(news.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই নিউজটি ডিলিট করতে চান?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
      }
    }
  };

  const togglePublish = async (news: News) => {
    try {
      await updateDoc(doc(db, 'news', news.id), {
        isPublished: !news.isPublished,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `news/${news.id}`);
    }
  };

  if (loadingAuth || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-red-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">নিউজ ড্যাশবোর্ড</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Plus size={20} /> নতুন নিউজ যোগ করুন
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {editId ? 'নিউজ এডিট করুন' : 'নতুন নিউজ লিখুন'}
            </h2>
            <button onClick={() => { setIsEditing(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
                <input
                  type="text"
                  required
                  value={currentNews.title}
                  onChange={(e) => setCurrentNews({ ...currentNews, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="নিউজের শিরোনাম লিখুন"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিভাগ</label>
                <select
                  value={currentNews.category}
                  onChange={(e) => setCurrentNews({ ...currentNews, category: e.target.value as Category })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ছবির ইউআরএল (ঐচ্ছিক)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={currentNews.imageUrl}
                      onChange={(e) => setCurrentNews({ ...currentNews, imageUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">বিস্তারিত খবর (Markdown সমর্থিত)</label>
                <textarea
                  required
                  rows={10}
                  value={currentNews.content}
                  onChange={(e) => setCurrentNews({ ...currentNews, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="নিউজের বিস্তারিত এখানে লিখুন..."
                ></textarea>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={currentNews.isPublished}
                  onChange={(e) => setCurrentNews({ ...currentNews, isPublished: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">পাবলিশ করুন</label>
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditId(null); }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <Save size={18} /> সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">শিরোনাম</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">বিভাগ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থা</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsList.map((news) => (
              <tr key={news.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{news.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    {news.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {news.createdAt ? format(news.createdAt.toDate(), 'd MMM, yyyy', { locale: bn }) : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => togglePublish(news)}
                    className={`flex items-center gap-1 text-sm ${news.isPublished ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {news.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                    {news.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => handleEdit(news)} className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(news.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {newsList.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            কোন নিউজ পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
};
