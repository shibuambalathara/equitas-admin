import React, { useMemo } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {usePaymentOfUserQuery} from '../../utils/graphql'
import format from 'date-fns/format'
import Swal from "sweetalert2";
import jsPDF from 'jspdf';
import TableComponent from '../utils/table';

import { FormatDate } from '../utils/dateFormat';

const PaymentPerUser = () => {
    const {id}=useParams()
    const {data,loading}=usePaymentOfUserQuery({variables:{where:{id:id}}})
    
    
    const navigate=useNavigate()
    // const handleUserDetails=(userId)=>{
    
    //   navigate(`/view-user/${userId}`)
    // }

   
    const handlePaymentStatus=(paymentId)=>{
navigate(`/update-payment/${paymentId}`)
    }
    const handleMessage=(payment)=>{
      const {amount,paymentFor,createdAt}=payment
      const formatedDate=format(new Date( createdAt),`dd/MM/yy, HH:mm`)
     const  {firstName,lastName}=data.user
     
      Swal.fire({
        html: `<div>
            <h1>Message From Team AutoBse </h1>
            
            <p>Dear: ${firstName} ${lastName},</p>
           <p>Thank You for the payment of Rs.${amount}.Created at ${formatedDate}.  for ${paymentFor}. </p>
            <p>For more details please contact our team . </p>
            <p>Thank you.</p>
          </div>`
      
      })
    }
    const handleDownload=(paymentData)=>{
      convertToPDF(paymentData,data.user)
    }


    const columns = useMemo(
        () => [
           { Header: "Ref No", accessor: "refNo" },
            { Header: "Amount", accessor: "amount" },
            {Header:"Payment For",accessor:"paymentFor"},
           { Header: "Status", accessor: "status" },
           { Header: "Created At", accessor: ({createdAt})=>{return FormatDate(createdAt)} },
           { Header: "Updated At",  accessor: ({updatedAt})=>{return FormatDate( updatedAt)} },
           {
            Header: "Registration Expire",
               accessor: ({ RegistrationExpire }) =>RegistrationExpire && new Date( RegistrationExpire),
        
   Cell: ({ value }) =>value ? FormatDate(value):'-',
           },
            { Header: "Created By ",  accessor: data => data.createdBy ? data.createdBy.firstName : "self" },
            {
            Header: "Update Payment",
            Cell: ({ row }) => (
              <button className="btn bg-rose-500" onClick={() => handlePaymentStatus(row.original?.id)}>Update Payment</button>
            )
          },
          {
            Header: "Emd Details",
            Cell: ({ row }) => (
     row.original.emdUpdateCount!==0 &&         <a className="btn bg-zinc-500" href={`/emdDetails/${row.original.id}`} target="_blank" rel="noopener noreferrer">Emd Details </a>
            )
          },
          {
            Header: "Create Buying Limit",
            Cell: ({ row }) => {
              if (
                row.original.emdUpdateCount === 0 &&
                row.original.paymentFor === 'emd' &&
                row.original.status === 'success'
              ) {
                return (
                  <a
                    className="btn btn-secondary"
                    href={`/add-emd/${row.original.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Increase Buying Limit
                  </a>
                );
              }
               else {
                return(
                  <>
                  Increment by:{ row.original.emdUpdate[0]?.vehicleBuyingLimitIncrement ??'0'},
                  <br /> Status: {row.original.status}
                  </>
                  );
              }
            }
          },
          {
            Header: "Payment Message",
            Cell: ({ row }) => {
              
    if(row.original.status==='success' ){return(   <button className="btn bg-teal-500" onClick={() => handleMessage(row.original)}>Message To:{data?.user?.mobile}</button>)}
    else {
      
      return row.original.status;}
        
    }
          },
          {
            Header: "Download",
            Cell: ({ row }) => {
              
    if(row.original.status==='success' ){return(   <button className="btn bg-pink-500" onClick={() => handleDownload(row.original)}>PDF</button>)}
    else {
      
      return row.original.status;}
        
    }
          },
    
          
        ],
        [data]
      );


     

    
     
    
      if (loading) return <p>Loading...</p>;
      

  return (
    <div className="flex  flex-col w-full justify-around ">
 
    
    <div className=" flex flex-col w-full justify-center m-auto ">
    <div className="mb-2">
  <div className="text-center  font-extrabold my-5 text-lg min-w-full">  Payment Data Table of {data?.user?.firstName} {data?.user?.lastName} </div>

  </div>
  
          <TableComponent tableData={data.user.payments} columns={columns} sortBy='Created At'/>

  
  </div>
  </div>
  )
}

export default PaymentPerUser

function convertToPDF(paymentDetails,user){

  const pdf = new jsPDF();
  const logoImg = '../logo.jpeg';
  
  const datePrinted=`Printed Date : ${new Date().toLocaleDateString()}`
  const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

const createdPayment=new Date(paymentDetails.createdAt).toLocaleDateString(undefined,options)
const UpdatedPayment=new Date(paymentDetails.createdAt).toLocaleDateString(undefined,options)
const createdBy=paymentDetails?.createdBy ? paymentDetails?.createdBy.firstName : user.firstName

  pdf.addImage(logoImg, 'JPEG', 10, 10, 30, 30);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold'); 
  pdf.text(datePrinted, 150, 50,);
 pdf.text('Sub : Payment status active letter',10, 60)
        pdf.setFont('helvetica', 'normal'); 
       
    
        pdf.setFontSize(12);
        pdf.text(`Amount              : ${paymentDetails.amount}`, 10, 80);
        pdf.text(`Created At          : ${createdPayment}`, 10, 90);
        pdf.text(`Updated At          : ${UpdatedPayment}`, 10, 100);
        pdf.text(`payment For         : ${paymentDetails.paymentFor}`, 10, 110);
        pdf.text(`Payment Created By  : ${createdBy}`, 10, 120);
      
        pdf.setFontSize(10);
  pdf.text('User registration details on AUTOBSe are as follows:',10,138)
  pdf.setFontSize(12);

  pdf.text(`First Name  : ${user.firstName}`, 10, 148) 
  pdf.text(`Last Name   : ${user.lastName}`, 10, 158)

  pdf.text(`Mobile      : ${user.mobile}`, 10, 168)
  pdf.save(`payment of ${user.firstName}`.pdf)
}