import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const footerLinks = {
    home: "Home",
    news: "News",
    sport: "Sport",
    business: "Business",
    entertainment: "Entertainment"
  }

  const contactIcons = {
    facebook: "facebook-svgrepo-com.svg",
    instagram: "instagram-svgrepo-com.svg",
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
    <footer className="bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-12">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Brand + Navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <h1 className="text-3xl font-bold">The Granite</h1>

          <ul className="flex flex-wrap gap-4 text-sm">
            {Object.entries(footerLinks).map(([key, value]) => (
              <li key={key}>
                <Link href={`/${key}`} className="hover:text-yellow-400 transition">
                  {value}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="font-semibold text-sm">
            Follow The Granite on:
          </h2>

          <ul className="flex gap-4">
            {Object.entries(contactIcons).map(([key, value]) => (
              <li key={key}>
                <Link href={`/${key}`}>
                  <Image
                    src={`/${value}`}
                    alt={key}
                    width={20}
                    height={20}
                    className="hover:scale-110 transition"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Extra Links */}
        <div>
	          <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm">
					  {Object.entries(footerLinks).map(([key, value]) => (
					    <li key={key}>
					      <Link
					        href={`/${key}`}
					        className="block hover:text-yellow-400 transition"
					      >
					        {value}
					      </Link>
					    </li>
					  ))}
			  </ul>
        </div>

        {/* Bottom Text */}
        <div className="border-t border-gray-700 pt-6 text-xs text-gray-400">
          <p>
            Copyright {new Date().getFullYear()}, The Granite. All rights reserved.
            The Granite is not responsible for the content of external sites.
            Read about our approach to external linking.
          </p>
        </div>

      </div>
    </footer>
  )
}