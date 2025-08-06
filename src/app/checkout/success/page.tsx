'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?returnUrl=/checkout/success');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Icon */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ご注文ありがとうございます！
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              ご注文が正常に処理されました。<br />
              商品の発送準備を開始いたします。
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">注文詳細</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">注文番号:</span>
                  <span className="font-medium">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">注文日時:</span>
                  <span className="font-medium">{new Date().toLocaleString('ja-JP')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">支払い方法:</span>
                  <span className="font-medium">クレジットカード</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">配送方法:</span>
                  <span className="font-medium">通常配送（無料）</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">今後の流れ</h2>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">注文確認メール送信</p>
                    <p className="text-gray-600">注文内容の確認メールをお送りします。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">商品準備・発送</p>
                    <p className="text-gray-600">1-2営業日以内に商品を発送いたします。</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">配送完了</p>
                    <p className="text-gray-600">通常2-3日でお手元に届きます。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/products"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                他の商品を見る
              </Link>
              
              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                ホームに戻る
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ご不明な点がございましたら、
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 underline">
                  お問い合わせ
                </Link>
                までご連絡ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}