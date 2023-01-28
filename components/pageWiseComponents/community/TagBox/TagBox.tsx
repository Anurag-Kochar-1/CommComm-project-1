import React from 'react'

interface IProps {
  tagName: string
  tagColor: string
}

const TagBox = ({ tagName, tagColor }: IProps) => {
  return (
    <div className='min-w-[128px] h-7 bg-black border border-black flex justify-center items-center my-2 rounded-full'>

      <div className={`w-full h-full -mt-1 -mr-1 flex justify-center items-center border border-black ${tagColor} hover:cursor-pointer rounded-full `} > <p className='font-BebasNeue text-base font-medium text-black'> {tagName} </p> </div>
    </div>
  )
}

export default TagBox
