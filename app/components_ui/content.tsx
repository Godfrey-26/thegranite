/**
 * This contains the contents 
 * */
import {ReactNode} from "react"

interface ContentsProps
{
	children: ReactNode;
	path : string;
}

export default function Content({children} : ContentsProps) 
{
	
	return(
	<>	
	    {children} 
	</> 
	)
}