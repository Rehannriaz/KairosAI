import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <><div>This is all jobs listing</div><Link href='/single-job/1'>
          Click here
      </Link></>
  )
}

export default Page