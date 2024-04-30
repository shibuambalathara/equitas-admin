import React from 'react'
import AddLocation from '../components/Locations/addLocation'
import AddState from '../components/Locations/addState'
import ViewLocationComponent from '../components/Locations/viewLocationComponent'

const ViewLocations = () => {
  return (
    <div className='w-full'>
        <div className='flex justify-end'>

      <AddLocation/>
        </div>
      <ViewLocationComponent/>
      </div>
  )
}

export default ViewLocations