import { useState, useEffect, useCallback } from 'react';
import shopifyService from '../services/shopifyService';

// Custom hook for managing products from Shopify
export const useProducts = (initialLimit = 20) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  });

  // Fetch products
  const fetchProducts = useCallback(async (first = initialLimit, after = null) => {
    if (!shopifyService.isConfigured()) {
      setError('Shopify is not properly configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await shopifyService.getProducts(first, after);
      setProducts(data.products);
      setPageInfo(data.pageInfo);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  // Load more products (pagination)
  const loadMore = useCallback(() => {
    if (pageInfo.hasNextPage && !loading) {
      fetchProducts(initialLimit, pageInfo.endCursor);
    }
  }, [pageInfo.hasNextPage, pageInfo.endCursor, loading, fetchProducts, initialLimit]);

  // Refresh products
  const refresh = useCallback(() => {
    fetchProducts(initialLimit, null);
  }, [fetchProducts, initialLimit]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pageInfo,
    loadMore,
    refresh,
    hasMore: pageInfo.hasNextPage,
  };
};

// Custom hook for fetching a single product by handle
export const useProduct = (handle) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async (productHandle) => {
    if (!productHandle) return;

    if (!shopifyService.isConfigured()) {
      setError('Shopify is not properly configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await shopifyService.getProductByHandle(productHandle);
      setProduct(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduct(handle);
  }, [handle, fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: () => fetchProduct(handle),
  };
};
