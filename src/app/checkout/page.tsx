'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Address, Order, OrderItem } from '@/types';

export default function CheckoutPage() {
  const { getCartItems, total, itemCount, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const cartItems = getCartItems();

  // Form state
  const [shippingAddress, setShippingAddress] = useState<Address>({
    zipCode: '',
    prefecture: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Redirect if not logged in or cart is empty (but not during processing)
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?returnUrl=/checkout');
    } else if (cartItems.length === 0 && !isProcessing) {
      router.push('/cart');
    }
  }, [isLoggedIn, cartItems.length, isProcessing, router]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setCardHolder(`${user.firstName} ${user.lastName}`);
      if (user.phone) {
        setShippingAddress(prev => ({ ...prev, phone: user.phone || '' }));
      }
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validate shipping address
    if (!shippingAddress.zipCode) newErrors.zipCode = '郵便番号は必須です';
    if (!shippingAddress.prefecture) newErrors.prefecture = '都道府県は必須です';
    if (!shippingAddress.city) newErrors.city = '市区町村は必須です';
    if (!shippingAddress.addressLine1) newErrors.addressLine1 = '住所は必須です';
    if (!shippingAddress.phone) newErrors.phone = '電話番号は必須です';

    // Validate payment info
    if (paymentMethod === 'credit') {
      if (!cardNumber) newErrors.cardNumber = 'カード番号は必須です';
      if (!expiryDate) newErrors.expiryDate = '有効期限は必須です';
      if (!cvv) newErrors.cvv = 'セキュリティコードは必須です';
      if (!cardHolder) newErrors.cardHolder = 'カード名義は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order data before clearing cart
      const orderData: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: user?.id || '',
        items: cartItems.map((item): OrderItem => ({
          productId: item.productId,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress,
        status: 'confirmed',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store order data in localStorage for the success page
      localStorage.setItem('latestOrder', JSON.stringify(orderData));

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      setErrors({ general: '決済処理中にエラーが発生しました' });
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn || cartItems.length === 0) {
    return null; // Will redirect
  }

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
              <Link href="/cart" className="text-gray-500 hover:text-gray-700">
                ショッピングカート
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium">チェックアウト</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">チェックアウト</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-red-800">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">配送先住所</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      郵便番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="郵便番号を入力してください"
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                  </div>

                  <div>
                    <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
                      都道府県 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="prefecture"
                      value={shippingAddress.prefecture}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, prefecture: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.prefecture ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="都道府県を入力してください"
                    />
                    {errors.prefecture && <p className="text-red-500 text-xs mt-1">{errors.prefecture}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      市区町村 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="市区町村を入力してください"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="電話番号を入力してください"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                    住所1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.addressLine1 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="住所を入力してください"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                </div>

                <div className="mt-4">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                    住所2（建物名・部屋番号など）
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="建物名・部屋番号を入力してください（任意）"
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">支払い方法</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="credit"
                      name="payment"
                      type="radio"
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                      クレジットカード
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="cod"
                      name="payment"
                      type="radio"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      代金引換
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit' && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        カード番号 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="カード番号を入力してください"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        有効期限 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="有効期限を入力してください"
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        セキュリティコード <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.cvv ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="セキュリティコードを入力してください"
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                        カード名義 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardHolder"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.cardHolder ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="カード名義を入力してください"
                      />
                      {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Link
                  href="/cart"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                  カートに戻る
                </Link>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      処理中...
                    </div>
                  ) : (
                    '注文を確定する'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">注文内容</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">画像</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ¥{item.product.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ¥{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品数:</span>
                  <span className="font-medium">{itemCount}個</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">小計:</span>
                  <span className="font-medium">¥{total.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">送料:</span>
                  <span className="font-medium">無料</span>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="text-lg font-semibold text-gray-900">合計:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">
                    安全な決済システム
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  お客様の情報は暗号化されて保護されています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}