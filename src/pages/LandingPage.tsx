import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  School,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'AI-powered algorithm ensures fair and balanced duty allocation across all faculty members.'
  },
  {
    icon: Users,
    title: 'Faculty Management',
    description: 'Comprehensive faculty database with department-wise filtering and specialization tracking.'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Real-time insights and detailed reports on duty allocation patterns and workload distribution.'
  },
  {
    icon: Shield,
    title: 'Transparent Process',
    description: 'Complete visibility into scheduling decisions with audit trails and change request tracking.'
  },
  {
    icon: Clock,
    title: 'Time Saving',
    description: 'Reduces planning time by 80% compared to manual scheduling methods.'
  },
  {
    icon: CheckCircle,
    title: 'Constraint Handling',
    description: 'Intelligent handling of maximum duties, gaps between duties, and department preferences.'
  }
];

const stats = [
  { label: 'Time Saved', value: '80%' },
  { label: 'Satisfaction Rate', value: '95%' },
  { label: 'Automated Tasks', value: '100%' },
  { label: 'Error Reduction', value: '99%' }
];

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Department Head',
    content: 'This system has transformed how we manage exam duties. What used to take days now takes minutes.',
    avatar: 'SJ'
  },
  {
    name: 'Prof. Michael Chen',
    role: 'Faculty Member',
    content: 'The fairness and transparency in duty allocation is remarkable. I can see exactly why I was assigned.',
    avatar: 'MC'
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Admin Coordinator',
    content: 'The reporting features and automated notifications have made coordination seamless.',
    avatar: 'ER'
  }
];

export const LandingPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SEO
        title="Home - Smart Exam Duty Scheduling"
        description="Transform your exam duty scheduling with AI-powered allocation. Fair, fast, and transparent scheduling for academic institutions."
        keywords="exam scheduling, faculty management, duty allocation, academic scheduling software"
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <School className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                ExamDuty
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 bg-clip-text text-transparent">
                Smart Exam Duty Scheduling
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground mb-8">
                Fair, Fast & Transparent
              </p>
              <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                Transform your exam duty allocation with AI-powered scheduling. Save time, ensure fairness,
                and maintain complete transparency in your academic operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage exam duties efficiently
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied faculty and administrators
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-card border border-border shadow-lg"
                >
                  <p className="text-lg mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Scheduling?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join leading institutions using ExamDuty for fair and efficient exam duty management
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 shadow-xl">
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <footer className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <School className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">ExamDuty</span>
              </div>
              <div className="text-center text-muted-foreground">
                © 2025 ExamDuty. All rights reserved.
              </div>
              <div className="flex gap-6 text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
