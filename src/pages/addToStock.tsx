import React, { useEffect } from 'react'
import { useUserauthenticationQuery } from '../utils/graphql'
import AddToStockComponent from '../components/stock/addStock'

const AddToStock = () => {
 


  
  return (
    <div className='w-full'>
        <AddToStockComponent/>
    </div>
  )
}

export default AddToStock





