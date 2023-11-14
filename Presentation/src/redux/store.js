import { configureStore } from '@reduxjs/toolkit'
import CartSlice from './cart/CartSlice'

export default configureStore({
    reducer: {
        cart: CartSlice
    }
})