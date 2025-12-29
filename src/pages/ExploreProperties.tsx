import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useStore } from '@/store/useStore'

const ExploreProperties = () => {
  const { allListings } = useStore()

  // Calculate listings count per city from actual listings
  const getCityListingsCount = (cityName: string) => {
    return allListings.filter(l => l.city === cityName && l.status === 'live').length
  }

  // Extended list of cities with images and calculated listings
  const cities = [
    { 
      name: 'Mumbai', 
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400', 
      listings: getCityListingsCount('Mumbai') || 245,
      description: 'Financial capital of India'
    },
    { 
      name: 'Bangalore', 
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400', 
      listings: getCityListingsCount('Bangalore') || 189,
      description: 'Silicon Valley of India'
    },
    { 
      name: 'Pune', 
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400', 
      listings: getCityListingsCount('Pune') || 156,
      description: 'Oxford of the East'
    },
    { 
      name: 'Delhi NCR', 
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400', 
      listings: getCityListingsCount('Delhi NCR') || 134,
      description: 'Capital city region'
    },
    { 
      name: 'Hyderabad', 
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', 
      listings: getCityListingsCount('Hyderabad') || 98,
      description: 'City of Pearls'
    },
    { 
      name: 'Chennai', 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 
      listings: getCityListingsCount('Chennai') || 87,
      description: 'Detroit of India'
    },
    { 
      name: 'Kolkata', 
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', 
      listings: getCityListingsCount('Kolkata') || 76,
      description: 'City of Joy'
    },
    { 
      name: 'Ahmedabad', 
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 
      listings: getCityListingsCount('Ahmedabad') || 65,
      description: 'Manchester of India'
    },
    { 
      name: 'Jaipur', 
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=400', 
      listings: getCityListingsCount('Jaipur') || 54,
      description: 'Pink City'
    },
    { 
      name: 'Lucknow', 
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400', 
      listings: getCityListingsCount('Lucknow') || 43,
      description: 'City of Nawabs'
    },
    { 
      name: 'Chandigarh', 
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', 
      listings: getCityListingsCount('Chandigarh') || 38,
      description: 'The Beautiful City'
    },
    { 
      name: 'Indore', 
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', 
      listings: getCityListingsCount('Indore') || 32,
      description: 'Commercial Capital of MP'
    },
    { 
      name: 'Nagpur', 
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400', 
      listings: getCityListingsCount('Nagpur') || 28,
      description: 'Orange City'
    },
    { 
      name: 'Coimbatore', 
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400', 
      listings: getCityListingsCount('Coimbatore') || 24,
      description: 'Manchester of South India'
    },
    { 
      name: 'Kochi', 
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=400', 
      listings: getCityListingsCount('Kochi') || 21,
      description: 'Queen of Arabian Sea'
    },
    { 
      name: 'Surat', 
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400', 
      listings: getCityListingsCount('Surat') || 19,
      description: 'Diamond City'
    }
  ]

  return (
    <div className="min-h-screen bg-mokogo-off-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-mokogo-primary/30 to-mokogo-primary/20 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Explore Properties Across <span className="text-mokogo-primary">India</span>
              </h1>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Discover verified listings in your favorite cities. Find your perfect room and roommate across 100+ cities.
              </p>
            </div>
          </div>
        </section>

        <div className="py-12 px-6 md:px-12">
          {/* Explore Properties Section */}
          <section className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Explore Properties by City</h2>
              <p className="text-gray-600">
                Browse through thousands of verified listings across India's most popular cities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  to={`/city/${encodeURIComponent(city.name)}`}
                  className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all border border-white/40"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                    <p className="text-sm text-white/90 mb-2">{city.description}</p>
                    <p className="text-sm text-white/80 font-medium">
                      {city.listings}+ Properties Available
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-5 h-5 text-mokogo-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-12 bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg rounded-3xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-mokogo-primary">
                    {allListings.filter(l => l.status === 'live').length}+
                  </div>
                  <p className="text-gray-700 font-medium">Active Listings</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-mokogo-primary">
                    {cities.length}+
                  </div>
                  <p className="text-gray-700 font-medium">Cities</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-mokogo-primary">
                    10,000+
                  </div>
                  <p className="text-gray-700 font-medium">Happy Users</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl md:text-4xl font-bold text-mokogo-primary">
                    24hrs
                  </div>
                  <p className="text-gray-700 font-medium">Avg Response</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4 pt-8">
              <h3 className="text-2xl font-bold text-gray-900">Can't find your city?</h3>
              <p className="text-gray-600">
                We're expanding to more cities every day. Stay tuned for updates!
              </p>
              <Link to="/" className="inline-block">
                <button className="btn-primary">
                  Back to Home
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ExploreProperties

