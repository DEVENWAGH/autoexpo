'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Search, BarChart2, Star } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <Car className="h-6 w-6" />
          <span className="sr-only">AutoExplorer</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AutoExplorer: Your Ultimate Vehicle Discovery Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Discover, compare, and choose your perfect ride with ease. Explore cars and bikes in India like never before.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Search className="h-12 w-12 mb-2" />
                  <h3 className="text-xl font-bold">Rich Specifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Detailed information on every car and bike model in India.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <BarChart2 className="h-12 w-12 mb-2" />
                  <h3 className="text-xl font-bold">Side-by-Side Comparisons</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Compare multiple vehicles to find your perfect match.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Star className="h-12 w-12 mb-2" />
                  <h3 className="text-xl font-bold">User Reviews & Ratings</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Real insights from actual owners and experts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Explore Vehicles</h2>
            <Tabs defaultValue="cars" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cars">Cars</TabsTrigger>
                <TabsTrigger value="bikes">Bikes</TabsTrigger>
              </TabsList>
              <TabsContent value="cars">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="Sedan"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">Sedan</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="SUV"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">SUV</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="Hatchback"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">Hatchback</h3>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="bikes">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="Sport Bike"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">Sport</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="Cruiser Bike"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">Cruiser</h3>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-2 p-6">
                      <Image
                        alt="Adventure Bike"
                        className="aspect-[1.5] object-cover"
                        height={150}
                        src="/placeholder.svg"
                        width={300}
                      />
                      <h3 className="text-xl font-bold">Adventure</h3>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">Compare Vehicles</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <Card className="w-full max-w-sm">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Image
                    alt="Car Model A"
                    className="aspect-[1.5] object-cover rounded-lg"
                    height={200}
                    src="/placeholder.svg"
                    width={300}
                  />
                  <h3 className="text-xl font-bold">Car Model A</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Specifications for Car Model A</p>
                </CardContent>
              </Card>
              <div className="text-4xl font-bold">VS</div>
              <Card className="w-full max-w-sm">
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Image
                    alt="Car Model B"
                    className="aspect-[1.5] object-cover rounded-lg"
                    height={200}
                    src="/placeholder.svg"
                    width={300}
                  />
                  <h3 className="text-xl font-bold">Car Model B</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Specifications for Car Model B</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button>Compare Now</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">What Our Users Say</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    &quot;AutoExplorer made finding my dream car so easy! The comparison tool is fantastic.&quot;
                  </p>
                  <p className="font-semibold">- Rahul S.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    &quot;I love how comprehensive the bike specifications are. It helped me make an informed decision.&quot;
                  </p>
                  <p className="font-semibold">- Priya M.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-2 p-6">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <Star className="h-6 w-6 text-yellow-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    &quot;The expert video reviews are a game-changer. They provide insights you can&apos;t get anywhere else.&quot;
                  </p>
                  <p className="font-semibold">- Amit K.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Find Your Perfect Ride?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join AutoExplorer today and revolutionize the way you discover your next vehicle.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Sign Up Now</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 AutoExplorer. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
