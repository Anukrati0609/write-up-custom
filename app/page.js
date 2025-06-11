import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-tech-grid -z-10" />
        <div className="absolute inset-0 bg-dot-matrix -z-10" />
        <div className="absolute inset-0 bg-gradient-animate -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[50rem] h-[50rem] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <div className="flex-1 max-w-2xl space-y-6">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-md">
              Registration Open Until June 14, 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              Matrix{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-300% animate-gradient">
                WriteItUp
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Unleash your creative potential in the ultimate content writing
              competition organized by Matrix JEC - the skill enhancement
              community of Jabalpur Engineering College.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                asChild
                size="lg"
                className="font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 border-none"
              >
                <Link href="/register">Register Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
              >
                <Link href="/guidelines">Learn More</Link>
              </Button>
            </div>

            <div className="pt-6 flex gap-4 items-center">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-700/80 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">120+</span>{" "}
                participants already registered
              </p>
            </div>
          </div>

          {/* Right content - Register Card */}
          <div className="w-full md:w-auto relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-md opacity-50"></div>
            <Card className="backdrop-blur-sm border shadow-xl md:min-w-[400px] relative">
              <div className="absolute inset-0 bg-dot-matrix opacity-40 rounded-xl pointer-events-none"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Image
                      src="/file.svg"
                      alt="WriteItUp"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <CardTitle>WriteItUp Competition</CardTitle>
                    <CardDescription>2025 Edition</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <Image src="/globe.svg" alt="Date" width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm">
                      Competition Date
                    </h3>
                    <p className="font-medium">June 15 - June 30, 2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <Image
                      src="/window.svg"
                      alt="Prize"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm">
                      Prize Pool
                    </h3>
                    <p className="font-medium">₹10,000 + Certificates</p>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                  <strong className="font-medium">Only 5 days left!</strong>{" "}
                  Register before June 14 to secure your spot in the
                  competition.
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  asChild
                  className="w-full font-medium relative overflow-hidden group"
                >
                  <Link href="/register">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 group-hover:opacity-90 transition-opacity opacity-80"></span>
                    <span className="relative z-10">Register Now</span>
                  </Link>
                </Button>
                <p className="text-center text-muted-foreground text-xs">
                  Registration closes on June 14, 2025
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Competition Categories</h2>
            <p className="text-muted-foreground">
              Choose from diverse writing categories to showcase your talent
            </p>
          </div>

          <Tabs defaultValue="article" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="creative">Creative Writing</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            <TabsContent value="article">
              <Card>
                <CardHeader>
                  <CardTitle>Article Writing</CardTitle>
                  <CardDescription>
                    Opinion pieces, features, and news articles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>1500-2000 word count limit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Research-backed content required</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>
                        Topics include technology, society, environment
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="creative">
              <Card>
                <CardHeader>
                  <CardTitle>Creative Writing</CardTitle>
                  <CardDescription>
                    Short stories, poetry, and flash fiction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Up to 3000 words for short stories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Maximum 30 lines for poetry</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Free choice of theme and genre</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Writing</CardTitle>
                  <CardDescription>
                    Documentation, guides, and technical blogs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>2000-2500 word count limit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Clear explanations of complex topics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                        ✓
                      </div>
                      <span>Diagrams and visual aids encouraged</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">Why Participate?</h2>
            <p className="text-muted-foreground">
              Benefits of joining Matrix WriteItUp competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/file.svg"
                    alt="Showcase"
                    width={24}
                    height={24}
                    className="text-blue-500"
                  />
                </div>
                <CardTitle>Showcase Your Talent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Display your writing skills to a wider audience and gain
                  recognition among peers and industry professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/window.svg"
                    alt="Feedback"
                    width={24}
                    height={24}
                    className="text-purple-500"
                  />
                </div>
                <CardTitle>Expert Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive valuable feedback from industry experts and
                  experienced writers to improve your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Image
                    src="/globe.svg"
                    alt="Network"
                    width={24}
                    height={24}
                    className="text-green-500"
                  />
                </div>
                <CardTitle>Networking Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals and build relationships
                  that can help in your professional journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <Badge>Limited Spots Available</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to showcase your writing talent?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join Matrix WriteItUp 2025 and take your first step towards becoming
            a recognized writer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="font-medium">
              <Link href="/register">Register Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/guidelines">View Guidelines</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
