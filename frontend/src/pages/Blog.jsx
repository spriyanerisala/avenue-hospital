import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight, Heart, Brain, Activity, ShieldCheck } from 'lucide-react';

import bannerCheckup from '../assets/images/banners/banner_checkup.jpg';
import bannerTelehealth from '../assets/images/banners/banner_telehealth.jpg';
import consultationImg from '../assets/images/hospital/consultation.jpg';
import icuImg from '../assets/images/facilities/icu.jpg';

export const Blog = () => {
  const articles = [
    {
      id: 1,
      title: 'Recognizing Early Warning Signs of Stroke: The F.A.S.T Protocol',
      category: 'Neurology',
      author: 'Dr. Sarah Jenkins',
      date: 'March 1, 2026',
      readTime: '5 min read',
      image: consultationImg,
      summary: 'Time is brain tissue. Learn how rapid identification of facial drooping, arm weakness, and slurred speech saves neurological function in acute stroke situations.'
    },
    {
      id: 2,
      title: 'Modern Interventional Cardiology: Beyond Traditional Bypass',
      category: 'Cardiology',
      author: 'Dr. Anthony F. Chen',
      date: 'February 24, 2026',
      readTime: '6 min read',
      image: icuImg,
      summary: 'Discover how transcatheter aortic valve replacements (TAVR) and robotic-guided coronary angioplasty enable heart patients to walk out of the hospital within 48 hours.'
    },
    {
      id: 3,
      title: 'Preventive Executive Health Screenings: What You Actually Need',
      category: 'General Medicine',
      author: 'Dr. David Miller',
      date: 'February 18, 2026',
      readTime: '4 min read',
      image: bannerCheckup,
      summary: 'Evidence-based guide to essential biomarkers, lipid sub-fraction testing, calcium scoring, and lifestyle adaptations for metabolic wellness.'
    },
    {
      id: 4,
      title: 'The Future of Pediatric Immunization and Childhood Allergy Defense',
      category: 'Pediatrics',
      author: 'Dr. Emily Rodriguez',
      date: 'February 10, 2026',
      readTime: '5 min read',
      image: bannerTelehealth,
      summary: 'Navigating modern pediatric vaccines, early childhood peanut allergen introduction protocols, and boosting adolescent immune resilience.'
    }
  ];

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-cyan-400">
            Medical Insights & Wellness
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white mt-1">
            Avenue Healthcare Journal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3">
            Authoritative clinical insights, preventive healthcare wisdom, and advanced medical breakthroughs published by our faculty physicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-card transition duration-300 flex flex-col group"
            >
              <div className="h-60 overflow-hidden relative">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-primary-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {art.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-primary-500" /> {art.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary-600 dark:text-cyan-400 flex items-center gap-1">
                    <span>Read Clinical Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <Link
                    to="/book"
                    className="text-xs font-medium text-slate-500 hover:text-primary-600"
                  >
                    Consult Doctor
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
