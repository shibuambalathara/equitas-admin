import format from 'date-fns/format'
export const FormatDate = (dateString) => {

    return format(new Date(dateString), 'dd/MM/yy, HH:mm');
  };

export const DateConvert=(date)=>{
  const dateObj = new Date(date);
const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');
const hours = String(dateObj.getHours()).padStart(2, '0');
const minutes = String(dateObj.getMinutes()).padStart(2, '0');

const formattedString = `${year}-${month}-${day}T${hours}:${minutes}`;
return formattedString
}

export const TimeDifference=(date)=>{

const currentDate = new Date();
const createdDate=new Date(date)

 const timeDifferenceMs = currentDate.getTime() - createdDate.getTime();


 const daysDifference = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));
 console.log("Number of days since createdAt:",currentDate,"date",daysDifference);
 return daysDifference
}
