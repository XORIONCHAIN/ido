import { useState } from "react"

type Props = {}

const PostIDO = (props: Props) => {
  const [show, setShow] = useState(false)

  const toggle = () => setShow(!show)
  return (
     <div className="flex w-full h-full py-10 flex-col gap-6 mt-3">

        <button 
        onClick={toggle}
        className="bg-gray-50 w-fit text-[20px] text-gray-900 border-1 border-gray-800 px-5 py-4 mx-auto rounded-md">Claim</button>
        {show && <p className='mx-auto my-auto text-2xl'>Coming soon</p>}
  
    </div>

  )
}

export default PostIDO