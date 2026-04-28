/**
 * This contains the contents 
 * */
import {ReactNode} from "react"

interface ContentsProps
{
	children: ReactNode;
}

export default function Content({children} : ContentsProps) 
{
	
	return(
	<>	
	    {children} 
	</> 
	)
}