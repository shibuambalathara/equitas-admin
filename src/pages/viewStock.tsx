import React, { useEffect, useMemo } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useUserauthenticationQuery, useVehicleByEventQuery, useVehicleDetailsPerEventQuery } from '../utils/graphql'
import TableComponent from '../components/utils/table'
import ViewStockComponent from '../components/stock/viewStockComponent';
import StockTableComponent from '../components/stock/viewStockAdmin';

const ViewStock = () => {
  const  {data:auth,refetch:changeUser}=useUserauthenticationQuery()
  const navigate=useNavigate()









  return (
    <div className='w-full'>
         <div>
    {/* <button
      onClick={() => navigate("/addToStock")}
      className="btn btn-outline"
    >
     Add Vehicle to Stocks
    </button> */}

    
    </div> 

  {auth?.authenticatedItem?.role==='staff' &&    <ViewStockComponent/>}
  {auth?.authenticatedItem?.role==='admin' &&    <StockTableComponent/>}

 
    </div>
  )
}

export default ViewStock