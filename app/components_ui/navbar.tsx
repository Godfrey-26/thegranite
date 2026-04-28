'use client'
import {useSearchParams, usePathname} from 'next/navigation'
import Navigation from './navigation'

export default function NavBar()
{
   const path = usePathname()

   const isAuthPage = path.startsWith('/auth/')
   return (
    <>
        {!isAuthPage && <Navigation />}
    </>    
    )

}