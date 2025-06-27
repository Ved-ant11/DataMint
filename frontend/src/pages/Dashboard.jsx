// src/pages/Dashboard.jsx
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Download, Database, User } from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Dashboard = () => {
  const { user } = useAuth();
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    
    gsap.fromTo(
      cardRefs.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    
    gsap.utils.toArray(".stat-number").forEach((stat) => {
      const target = +stat.getAttribute("data-target");
      gsap.to(stat, {
        innerText: target,
        duration: 2,
        ease: "power4.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-300">
          Welcome back, {user?.name || "User"}! Here's your activity summary.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            title: "Generations",
            value: 42,
            icon: <Database className="w-6 h-6" />,
          },
          {
            title: "Downloads",
            value: 28,
            icon: <Download className="w-6 h-6" />,
          },
          {
            title: "Templates",
            value: 8,
            icon: <Activity className="w-6 h-6" />,
          },
          {
            title: "Active Users",
            value: 3,
            icon: <User className="w-6 h-6" />,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3
                  className="text-3xl font-bold text-white mt-2 stat-number"
                  data-target={stat.value}
                >
                  0
                </h3>
              </div>
              <div className="bg-primary-500/20 p-3 rounded-full">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Generate Data",
            description: "Create new JSON datasets using AI or templates.",
            buttonText: "Go to Generator",
            link: "/generator",
          },
          {
            title: "Download as Excel",
            description: "Convert your generated data to Excel format.",
            buttonText: "Try Now",
            link: "/generator",
          },
          {
            title: "History",
            description: "View your past generated datasets.",
            buttonText: "View History",
            link: "/history",
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            ref={(el) => (cardRefs.current[i + 4] = el)}
            whileHover={{ y: -5 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
          >
            <Card className="border-0 bg-transparent h-full">
              <CardHeader>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <a href={feature.link}>
                  <Button className="btn-primary w-full">
                    {feature.buttonText}
                  </Button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      
      <motion.div
        ref={(el) => (cardRefs.current[7] = el)}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { action: "Generated", type: "User Data", time: "2 hours ago" },
            { action: "Downloaded", type: "Product Data", time: "5 hours ago" },
            { action: "Created", type: "Employee Template", time: "Yesterday" },
            {
              action: "Generated",
              type: "Healthcare Data",
              time: "2 days ago",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start border-b border-white/10 pb-4 last:border-0 last:pb-0"
            >
              <div className="bg-primary-500/20 p-2 rounded-full mr-4">
                <Activity className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="font-medium">{item.action}</span> {item.type}
                </p>
                <p className="text-gray-400 text-sm">{item.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
