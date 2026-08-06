import { Outlet } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { WishlistContext } from './WishlistContext';

export const WishlistProvider = () => {
  const wishlist = useWishlist();
  return (
    <WishlistContext.Provider value={wishlist}>
      <Outlet />
    </WishlistContext.Provider>
  );
};