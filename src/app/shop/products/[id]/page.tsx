'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    inventory: number;
  }

  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const foundProduct = await response.json()
        setProduct(foundProduct)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product && typeof product === 'object' && '_id' in product && typeof product._id === 'string') {
      addItem({
        id: product._id,
        name: product.name as string,
        price: product.price as number,
        quantity,
        image: product.image as string
      })
    }
  }
  if (loading) {
    return <div className="container mx-auto px-4 py-16">Loading...</div>
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-16">Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <div>
          <h1 className="heading-1 mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="body-text mb-8">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="cart-quantity-controls">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="cart-quantity-btn rounded-l-lg"
              >
                -
              </button>
              <span className="cart-quantity-text">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="cart-quantity-btn rounded-r-lg"
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddToCart} 
              className="btn-primary w-full sm:w-auto"
            >
              Add to Cart
            </button>
          </div>

          <div className="text-text-light">
            <p>Category: {product.category}</p>
            <p>Available: {product.inventory} items</p>
          </div>
        </div>
      </div>
    </div>
  )
}