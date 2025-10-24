import React, { useEffect, useState } from 'react'
import { CheckHeading, ReplaceHeading } from '../../helper';

const Aianswer = ({ ans, customKey }) => {
    // console.log(ans, customKey);

    const [heading, setHeading] = useState(false)
    const [answer, setAnswer] = useState(ans)

    useEffect(() => {
        if (CheckHeading(ans)) {
            setHeading(true)
            setAnswer(ReplaceHeading(ans))
        }

    })




    return (
        <>
            {
                heading ? <span className='font-bold' > {answer} </span> :
                    <span className='text-sm' > {answer} </span>
            }
        </>
    )
}

export default Aianswer