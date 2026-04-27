/**
 * This contains the contents 
 * */
import {ReactNode} from "react"

interface ContentProps{
	children: ReactNode
	className?: string
}

export default function Content({children, className}: ContentProps)
{
	return(
		  <div className={className}>
		     {children}
		  </div>
		)
}