import React from 'react';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const YouTubeCarousel: React.FC = () => {
  const channels = [
    {
      name: 'Dany Unique',
      url: 'https://www.youtube.com/@danyuniqueofficial',
      letter: 'D'
    },
    {
      name: 'Bhanu Pala',
      url: 'https://www.youtube.com/@bhanupala2600',
      letter: 'B'
    },
    {
      name: 'Sandies Music',
      url: 'https://www.youtube.com/@SandiesMusic',
      letter: 'S'
    },
    {
      name: 'Noel Jyothi',
      url: 'https://www.youtube.com/@NoelJyothi',
      letter: 'N'
    },
    {
      name: 'Prem Keys',
      url: 'https://www.youtube.com/@premkeys6616',
      letter: 'P'
    },
    {
      name: 'Bobby Keys',
      url: 'https://www.youtube.com/@BOBBYMSJ',
      letter: 'B'
    },
    {
      name: 'Eliya Keys',
      url: 'https://www.youtube.com/@PremMusicOfficial92',
      letter: 'E'
    },
    {
      name: 'John wesly Keys',
      url: 'https://www.youtube.com/@KeysJohnWesly4611',
      letter: 'J'
    }
  ];

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-500 mb-2">
            Watch Videos from my inspiration players
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto font-medium">
            Please Watch inspiring instrumental songs and learn Chording from talented musicians because I learned from these videos still more...
          </p>
        </motion.div>

        {/* Channel Boxes */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-6 text-center">
            Visit My Inspiration Channels
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-4xl mx-auto">
            {channels.map((channel, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative bg-gradient-to-br from-purple-600/30 via-pink-500/25 to-blue-600/20 border border-purple-400/60 rounded-xl p-3 sm:p-4 md:p-6 text-center hover:from-purple-600/40 hover:via-pink-500/35 hover:to-blue-600/30 hover:border-purple-400/80 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/50 overflow-hidden backdrop-blur-sm h-[160px] sm:h-[180px] md:h-[200px] flex flex-col justify-between"
                >
                  {/* Background Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Channel Avatar */}
                  <div className="relative flex items-center justify-center mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 via-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/60 transition-all duration-300 group-hover:scale-110">
                      <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                        {channel.letter}
                      </span>
                    </div>
                    {/* Glow around avatar */}
                    <div className="absolute inset-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-500/60 via-purple-400/50 to-blue-500/60 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Channel Name */}
                  <h4 className="font-semibold text-white text-lg sm:text-xs md:text-base lg:text-lg mb-2 sm:mb-3 group-hover:text-purple-200 transition-colors duration-300 relative z-10 leading-tight px-1 min-h-[1.5rem] flex items-center justify-center">
                    {channel.name}
                  </h4>
                  
                  {/* Visit Channel Link */}
                  <div className="flex items-center justify-center text-[10px] sm:text-xs md:text-sm text-slate-200 group-hover:text-pink-200 transition-colors duration-300 relative z-10 mt-auto">
                    <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Visit Channel</span>
                  </div>
                  
                  {/* Hover Border Animation */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-400/70 transition-all duration-500"></div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subscribe CTA */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a
            href="https://www.youtube.com/@abhimusickeys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe to My Channel
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default YouTubeCarousel; 
