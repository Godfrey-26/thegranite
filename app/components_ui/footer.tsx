import Link from 'next/link'
import Image from 'next/image'
export default function Footer()
{
	const footerLinks = {home:"Home", news:"News", sport:"Sport", business:"Business", entertainment:"Entertainment"}
	const contactIcons = {
							facebook: "facebook-svgrepo-com.svg",
							instagram:"instagram-svgrepo-com.svg",
							whatsapp: "whatsapp-svgrepo-com.svg",
							youtube: "youtube-svgrepo-com.svg"

				     	  }
    const extraInfo = {
					    	terms: "Terms of use",
					    	privacy: "Privacy and Policy",
					    	subsription: "Subscription Policy",
					    	about: "About The Granite",
					    	cookies: "Cookies Policy",
					    	advertise: "Advertise with us"
					    }

	return (

            <div className="py-8 px-3 black-48">
                 <div className="">
                        <div><h1 className="pt-8 px-3 text-4xl text-start font-bold">The Granite</h1></div>
		            	<div className="navigation pt-3 px-3 divide-y divide-yellow-500">
		          	  		<ul className="flex flex-row justify-start px-3">
		                        {Object.entries(footerLinks).map(([key, value])=>(
		                              <li key={key}><Link className="px-2" href={key}>{value}</Link></li>
		                        ))}
		          	  		</ul>
		          	  	</div>
                </div>
                <div className="flex flex-row">
                        <div><h1 className="pt-8 px-3 text-base text-start font-bold">Follow The Granite on:</h1></div>
		            	<div className="navigation pt-3">
		          	  		<ul className="flex flex-row justify-start px-3">
		                        {Object.entries(contactIcons).map(([key, value])=>(
		                              <li key={key}>
		                                     <Link className="px-4" href={key}>
		                                     <Image src={value}
		                                     alt={key}
		                                     width={18}
		                                     height={18}
		                                     />
		                                     </Link>
		                              </li>
		                        ))}
		          	  		</ul>
		          	  	</div>
                </div>

                <div className="flex flex-row">
                        
		            	<div className="navigation pt-3">
		          	  		<ul className="flex flex-row justify-start px-3">
		                        {Object.entries(extraInfo).map(([key, value])=>(
		                              <li key={key}>
		                                     <Link className="px-4" href={key}>
		                                     {value}
		                                     </Link>
		                              </li>
		                        ))}
		          	  		</ul>
		          	  	</div>
                </div>
                



                <div>
                	<p className="px-6">Copyright {new Date().getFullYear()}, The Granite. All rights reserved. The Granite is not responsible for the content of external sites. Read about our approach to external linking.</p>
                </div>
            </div>
		)
}