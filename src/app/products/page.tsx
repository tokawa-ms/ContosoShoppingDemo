'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockProducts, categories, getProductsByCategory, searchProducts, sortProducts } from '@/lib/products';
import { Product } from '@/types';

type SortOption = 'name' | 'price-asc' | 'price-desc' | 'newest';

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const productsPerPage = 12;

  // Filter and sort products
  useEffect(() => {
    setIsLoading(true);
    let filtered = [...mockProducts];

    // Apply category filter
    if (selectedCategory) {
      filtered = getProductsByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = searchProducts(searchQuery).filter(product => 
        !selectedCategory || product.category === selectedCategory
      );
    }

    // Apply sorting
    filtered = sortProducts(filtered, sortBy);

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  }, [selectedCategory, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddToCart = (productId: string) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ホーム
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">商品一覧</li>
            {selectedCategory && (
              <>
                <li className="text-gray-300">/</li>
                <li className="text-gray-900 font-medium">{selectedCategory}</li>
              </>
            )}
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {/* Search */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  商品検索
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="商品名で検索..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">カテゴリ</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">すべて</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">並び順</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">新着順</option>
                  <option value="name">名前順</option>
                  <option value="price-asc">価格の安い順</option>
                  <option value="price-desc">価格の高い順</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="商品名で検索..."
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">すべてのカテゴリ</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="newest">新着順</option>
                  <option value="name">名前順</option>
                  <option value="price-asc">価格の安い順</option>
                  <option value="price-desc">価格の高い順</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length}件の商品が見つかりました
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3"></div>
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <Link href={`/products/${product.id}`}>
                        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                          <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">商品画像</span>
                          </div>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/products/${product.id}`}>
                          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-600">
                            ¥{product.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
                          >
                            カートに追加
                          </button>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          {product.stock > 0 ? (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                              在庫あり
                            </span>
                          ) : (
                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-2">
                              在庫切れ
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        前へ
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        次へ
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}