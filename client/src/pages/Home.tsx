import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Users, Smartphone, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * Design Philosophy: Organic Minimalism
 * - Mint green (#10B981) primary accent for CTAs and highlights
 * - Charcoal (#1F2937) for text and depth
 * - Soft gradients and rounded corners throughout
 * - Asymmetric layout with generous whitespace
 * - Smooth animations and micro-interactions
 */

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [queuePosition, setQueuePosition] = useState(0);
  const [socialProofCount, setSocialProofCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Initialize queue position and social proof
  useEffect(() => {
    setQueuePosition(Math.floor(Math.random() * 500) + 1);
    setSocialProofCount(Math.floor(Math.random() * 2000) + 500);
    setReferralCode(`VOICE${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 30);
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">DoneByVoice</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">Features</Button>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">Join Waitlist</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Headline */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">
                ✨ Early Access Available
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Convert Voice Notes to <span className="text-emerald-600">Invoices in Minutes</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              DoneByVoice transforms field technicians' spoken job notes into formatted invoices and Stripe payment links—automatically, in under 3 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-12 px-8 font-semibold">
                Join Early Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-lg h-12 px-8 font-semibold border-2">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Right: Countdown Timer & Email Form */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            <div className="bg-white rounded-2xl border border-border p-8 shadow-lg">
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Offer Closes In</p>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 mb-2">
                      <div className="text-3xl font-bold text-emerald-600 font-mono">
                        {String(item.value).padStart(2, '0')}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground uppercase">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Capture Form */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 border border-emerald-200">
              <h3 className="text-lg font-bold text-foreground mb-4">Get Early Access</h3>
              {!submitted ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 rounded-lg border-emerald-200 bg-white text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 rounded-lg"
                  >
                    Claim Your Spot
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-200">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">You're in!</p>
                    <p className="text-sm text-muted-foreground">Check your email for next steps.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Counter */}
      <section className="py-16 px-6 bg-gradient-to-r from-emerald-50 to-white border-y border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 font-mono mb-2">{socialProofCount.toLocaleString()}+</div>
            <p className="text-muted-foreground font-medium">Technicians Signed Up</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 font-mono mb-2">3 min</div>
            <p className="text-muted-foreground font-medium">Average Processing Time</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-600 font-mono mb-2">$0</div>
            <p className="text-muted-foreground font-medium">Setup Cost</p>
          </div>
        </div>
      </section>

      {/* Why Join Early Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Join Early?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Early access members get exclusive benefits and lifetime pricing locked in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: 'Lifetime Pricing',
                description: 'Lock in early-bird rates forever. No price increases for founding members.',
              },
              {
                icon: Users,
                title: 'Priority Support',
                description: 'Direct access to our team. Get dedicated onboarding and custom integrations.',
              },
              {
                icon: MessageCircle,
                title: 'Shape the Product',
                description: 'Your feedback directly influences our roadmap. Be part of building the future.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Tracker */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border p-12 shadow-lg">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Referral Progress</h2>
              <p className="text-muted-foreground">Share your unique code and climb the waitlist</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Queue Position */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-8 border border-emerald-200">
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Your Position</p>
                <div className="text-5xl font-bold text-emerald-600 font-mono mb-4">#{queuePosition}</div>
                <p className="text-muted-foreground">
                  Move up by referring friends. Each referral moves you {Math.floor(Math.random() * 5) + 5} spots closer.
                </p>
              </div>

              {/* Referral Code */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-8 border border-blue-200">
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-4">Your Code</p>
                <div className="flex items-center gap-3 mb-4">
                  <code className="text-2xl font-bold text-blue-600 font-mono">{referralCode}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(referralCode)}
                    className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                  >
                    📋
                  </button>
                </div>
                <p className="text-muted-foreground">
                  Share this code with friends. They'll get priority access, and you'll move up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to automate your invoicing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Record Voice Notes',
                description: 'Technicians speak job details via WhatsApp or SMS. No typing needed.',
              },
              {
                step: '2',
                title: 'AI Processes Instantly',
                description: 'Our AI converts voice to structured invoice data in seconds.',
              },
              {
                step: '3',
                title: 'Send Payment Link',
                description: 'Automatic Stripe invoice link sent to customers. Get paid faster.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white rounded-2xl border border-border p-8">
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Invoicing?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of field service teams already using DoneByVoice to save hours every week.
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold h-12 px-8 rounded-lg">
            Claim Your Spot Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">DoneByVoice</span>
              </div>
              <p className="text-sm text-gray-400">Voice AI for field service teams.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 DoneByVoice. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
