// import React, { useMemo } from 'react'
// import { useEventsReportQuery, useLocationQuery, useUserauthenticationQuery, useVehicleByEventQuery } from '../../utils/graphql';
// import TableComponent from '../utils/table';

// const ViewStockComponent = () => {
//   const {data:auth,refetch:changeUser}=useUserauthenticationQuery()
//   const {data:location}=useLocationQuery({variables:{where:{name:{equals:auth?.authenticatedItem?.city}}}})
  
//   const {data:events,loading:eventDataLoading}=useEventsReportQuery({variables:{
//     where: {
//       location: {
//         name: {
//           equals:location?.locations[0]?.name
//         }
//       },
//       AND: [
//         {
//           eventCategory: {
//             equals: "stock"
//           }
//         }
//       ]
//     }
//         }
      
// })
// console.log("events",events,"location",location)

//     const {data,loading,error,refetch}=useVehicleByEventQuery({variables:{where:{id:events?.events[0]?.id}}})
//  console.log("events vehicle details",data)

//     const columns = useMemo(
//         () => [
        
//            { Header: "Vehicle ID", accessor: "vehicleIndexNo" },
//            {
//             Header: "Vehicle Details",accessor: "registrationNumber",
//             Cell: ({ row }) => (
//               <a className="btn bg-sky-500 w-24" href={`/edit-vehicle/${row.original.id}`} target="_blank" rel="noopener noreferrer">{row.original.registrationNumber}</a>
      
//               )
//           },
//           { Header: "State", accessor: "state" },
//          { Header: "City", accessor: "city" },
      
//         //  { Header: "Vehicle Status", accessor: "vehicleEventStatus" },
         
//           { Header: "Bid Status", accessor: "bidStatus" },
//           // { Header: "Bid Start Time", accessor: ({bidStartTime,id})=>{return <button onClick={()=>setUpdateDate({date: bidStartTime,id,updateItem:'startTime'})} className='btn bg-rose-500'> {format(new Date (bidStartTime),`dd/MM/yy,  HH:mm:ss`)}</button>}  },
          
//           //  { Header: "Bid Time Expire", accessor: ({bidTimeExpire,id})=>{return <button onClick={()=>setUpdateDate({date: bidTimeExpire,id,updateItem:'endtime'})} className='btn bg-orange-500'>{format(new Date (bidTimeExpire),`dd/MM/yy,  HH:mm:ss`)}</button>   }},
      
//         {
//           Header: "Bid Details",
//           Cell: ({ row }) => (
//             // <button className="btn btn-accent" onClick={()=>handleBidDetails(row.original.id) }>Bid Details</button>
          
//       row.original.totalBids !==0 ?        <a className="btn btn-primary" href={`/bid-details/${row.original.id}`} target="_blank" rel="noopener noreferrer"> {row.original.totalBids}</a>:'0'
//             )
//         },
//         // {
//         //   Header: "About Bid",
//         //   Cell: ({ row }) => (
//         //     row.original.totalBids !==0 ? <button className="btn bg-teal-500" onClick={() => handleAboutBid(row.original)}>About Bid</button>   :"No Bids"
//         //     )
//         // },
         
      
//           // {
//           //   Header: "Apply Coupen",
//           //   Cell: ({ row }) => (
//           //     row.original.totalBids !==0 ? ( row.original.coupenDetail ? <button onClick={()=>handleMessage(row.original)} className='btn bg-yellow-500'>Message to { row.original.currentBidUser.mobile}</button>   : <button className="btn bg-red-500" onClick={() => handleCoupen(row.original)}>Apply Coupen</button>):"0"
//           //     )
//           // },
//           {
//               Header:"Have Image?",
//               Cell:({row})=>(
//                 row.original.frontImage.startsWith("http")?"Yes":"No"
//               )
//           },
         
      
//           // {
//           //   Header: "Vehicle",
//           //   Cell: ({ row }) => (
//           //     <button className="btn btn-error" onClick={() => handleDelete(row.original.id,row.original.totalBids)}>Remove</button>
//           //   )
//           // }
          
//         ],
//         [data]
//       );
//       if (loading || eventDataLoading) return <p>Loading...</p>;
//   return (
//     <div className='w-full '>
      
//         <h2 className="flex text-xl py-3 leading-3 font-bold text-gray-900 justify-center">
//          VIEW VEHICLES IN STOCK -{location?.locations[0]?.name.toUpperCase()}
//         </h2>
//     <TableComponent tableData={data?.event?.vehicles} columns={columns} sortBy='vehicleIndexNo' />

//     </div>
//   )
// }

// export default ViewStockComponent




import React, { useEffect, useMemo,useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {useDeleteEventMutation, useEventTableQuery, useEventsbyCategoryQuery, useLocationQuery, useUpdateEventMutation, useUserauthenticationQuery} from '../../utils/graphql'
// import Report from './report'
import Swal from "sweetalert2";
import TableComponent from '../utils/table'
import LimitedDataPaginationComponents from '../utils/limitedDataPagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faFileArrowDown, faFileArrowUp, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays,  } from '@fortawesome/free-regular-svg-icons'
import  { ConvertToExcel } from '../utils/excelFormat'
import { FormatDate } from '../utils/dateFormat'


const ViewStockComponent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {data:auth,refetch:changeUser}=useUserauthenticationQuery()
     const {data:location,loading:locationLoading}=useLocationQuery({variables:{where:{name:{equals:auth?.authenticatedItem?.city}}}})

    const {data,loading,error,refetch}=useEventsbyCategoryQuery({variables:{
      where: {
        eventCategory: {
          equals: "stock"
        },
        AND: [
          {
            location: {
              name: {
                equals:location?.locations[0]?.name
              }
            }
          }
        ]
      }
    }
  })
const [addParticipants]=useUpdateEventMutation()

useEffect(()=>{
  refetch()

  
},[data])

    const navigate=useNavigate()
   const [deleteEvent]=useDeleteEventMutation()






  
   
   const handleDealer=async(eventId)=>{




const { value: input } = await Swal.fire({
  title: 'Enter Mobile Number',
  html: '<input id="mobile" class="swal2-select"></input>',
  focusConfirm: false,
  preConfirm: () => {
    return [
      document.getElementById('mobile').value
    ];
  }
});

  const mobileNumber=input[0]
 
  addParticipants({variables:{where: {id:eventId},
 data:{participants:{connect:{mobile:mobileNumber}}}
}}).then(()=>{
  Swal.fire({
    icon:'success',
    title:"Dealer Added Successfully" 
  })
  refetch()
}).catch((err)=>{
  Swal.fire({
    icon:'error',
    title:"User Does not Exist"
    
  })
})
}
const handleDelete=(id)=>{
  deleteEvent({variables:{where:{id}}})
  refetch()
}
   

    const columns = useMemo(
        () => [
        
           {
            Header: "Location ID",
            Cell: ({ row }) => (
       row.original.endDate>new Date().toISOString() ?row.original?.eventCategory==='open'? 
        <a className="btn bg-red-500 " href={`/openAuctionUpdatedByAdmin/${row.original.id}`} target="_blank" rel="noopener noreferrer">{row.original.eventNo}</a>
        :<span class="relative  h-3 w-3  ">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-30"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500">{row.original.eventNo}</span>
      </span>
        :row.original.eventNo
            
            )
          },
          { Header: "State", accessor: "location.state.name" },
          { Header: "Location", accessor: "location.name" },
        
       
    
        {
          Header: "Add Vehicles ",
          Cell: ({ row }) => (
<p className='flex justify-center'>       


  
      <a className="btn btn-accent text-xl" href={`/add-vehicle/${row.original.id}`} target="_blank" rel="noopener noreferrer">+ <FontAwesomeIcon icon={faCar}  /></a>
</p>
            )
        },
          {
            Header: "View Vehicles",
            Cell: ({ row }) => (
                <a className="btn bg-pink-500" href={`/view-vehicls/${row.original.id}`} target="_blank" rel="noopener noreferrer">{row.original.vehiclesCount}</a>
              )
          },
         
          {
            Header: "Upload Excel File",
            Cell: ({ row }) => (
      //        <button className="btn btn-info" onClick={()=>handleUploadExcelFile(row.original.id) }>Upload</button>
      <a className="btn bg-emerald-500 text-xl " href={`/excel-upload/${row.original.id}`} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFileArrowUp} /></a>
   
      )
          },
   
      
          {
            Header: "ACR (excel)",
            Cell: ({ row }) => (
              <button className="btn bg-red-500 text-xl " onClick={() => ConvertToExcel(row.original.Report)}><FontAwesomeIcon icon={faFileArrowDown} /></button>
            )
          },
  // {
  //   Header:"delete",
  //   Cell: ({ row }) => (
  //     <button className="text-2xl" onClick={() => handleDelete(row.original.id)}><FontAwesomeIcon icon={faTrashCan} /></button>
  //   )
  // }
        
          
        ],
        []
      );

     
    
        const handlePageChange = (newPage) => {
          setCurrentPage(newPage);
        };

        
        const totalPages = (data?.events?.length );

        useEffect(() => {
          const intervalId = setInterval(() => {
            refetch(); 
          }, 2000);
        
          return () => {
            clearInterval(intervalId);
          };
        }, []);

      if (loading||locationLoading) return <p>Loading...</p>;
      
    

  return (
    <div className="flex  flex-col w-full justify-around ">
   
    <div className=" flex flex-col w-full justify-center m-auto ">
    <div className="mb-2">
  <div className="text-center font-extrabold my-5 text-lg min-w-full">  STOCK  TABLE -{location?.locations[0]?.name.toUpperCase()} </div>

    
 
 
  
   </div>
     
       <TableComponent tableData={data?.events} columns={columns} sortBy='start Date'/>
  
          <LimitedDataPaginationComponents   
          currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}/>
  </div> 
  </div>
  
  )
}

export default ViewStockComponent