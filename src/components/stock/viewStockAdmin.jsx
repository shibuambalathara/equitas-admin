import React, { useEffect, useMemo,useState } from 'react'
import {useNavigate} from 'react-router-dom'
import {useDeleteEventMutation, useEventTableQuery, useEventsbyCategoryQuery, useUpdateEventMutation} from '../../utils/graphql'
// import Report from './report'
import Swal from "sweetalert2";
import TableComponent from '../utils/table'
import LimitedDataPaginationComponents from '../utils/limitedDataPagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faFileArrowDown, faFileArrowUp, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays,  } from '@fortawesome/free-regular-svg-icons'
import  { ConvertToExcel } from '../utils/excelFormat'
import { FormatDate } from '../utils/dateFormat'


const StockTableComponent = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);


    const {data,loading,error,refetch}=useEventsbyCategoryQuery({variables:{where:{eventCategory:{equals:'stock'}}}})
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

      if (loading) return <p>Loading...</p>;
      
    

  return (
    <div className="flex  flex-col w-full justify-around ">
         <div className='flex  justify-between  m-2'> 
        <div>
    <button
      onClick={() => navigate("/createStockLocation")}
      className="btn btn-outline"
    >
     CREATE  STOCK LOCATION
    </button>
    <button
      onClick={() => navigate("/addBankStaff")}
      className="btn btn-outline"
    >
     ADD BANK STAFF
    </button>
    </div>
    <div>
        {/* <Report/> */}
        </div>
        </div> 
    <div className=" flex flex-col w-full justify-center m-auto ">
    <div className="mb-2">
  <div className="text-center font-extrabold my-5 text-lg min-w-full">  STOCK  TABLE </div>

    
 
 
  
   </div>
     
       <TableComponent tableData={data?.events} columns={columns} sortBy='start Date'/>
  
          {/* <LimitedDataPaginationComponents   
          currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}/> */}
  </div> 
  </div>
  
  )
}

export default StockTableComponent