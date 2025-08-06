'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductById, mockProducts } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProductById(productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">商品が見つかりません</h1>
          <p className="text-gray-600 mb-6">お探しの商品は存在しないか、削除された可能性があります。</p>
          <Link
            href="/products"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            商品一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    alert(`${product.name} を ${quantity}個 カートに追加しました！`);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
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
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                商品一覧
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-gray-700">
                {product.category}
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Product Images */}
            <div className="p-6">
              <div className="aspect-w-1 aspect-h-1 mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {/* Thumbnail images - show same image for now */}
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                    title={`商品画像 ${index + 1}`}
                  >
                    <Image
                      src={product.images[0]}
                      alt={`${product.name} 画像 ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-4">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="text-4xl font-bold text-primary-600 mb-6">
                ¥{product.price.toLocaleString()}
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">商品説明</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-700 font-medium">在庫あり ({product.stock}個)</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-red-700 font-medium">在庫切れ</span>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      数量
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="数量を減らす"
                        aria-label="数量を減らす"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="w-16 text-center text-lg font-medium">{quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="数量を増やす"
                        aria-label="数量を増やす"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m0 0l1.5 3M7 18a2 2 0 11-4 0 2 2 0 014 0zM21 18a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>カートに追加</span>
                  </button>
                </div>
              )}

              {/* Product Details */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">商品詳細</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">商品ID:</dt>
                    <dd className="text-gray-900">{product.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">カテゴリ:</dt>
                    <dd className="text-gray-900">{product.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">在庫数:</dt>
                    <dd className="text-gray-900">{product.stock}個</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">登録日:</dt>
                    <dd className="text-gray-900">{product.createdAt.toLocaleDateString('ja-JP')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">関連商品</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${relatedProduct.id}`}>
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                      <Image
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        ¥{relatedProduct.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/products/${relatedProduct.id}`}
                        className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 transition-colors"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}