import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, MonitorPlay, CheckCircle2, Play, BookOpen, Sparkles, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import VisualizerPage from "../visualizer/VisualizerPage";
import AlgorithmsWorkspace from "../workspace/AlgorithmsWorkspace";
import type { AlgoType } from "../workspace/AlgorithmsWorkspace";

import makeItASecVideo from '../../assets/ll.mp4';
import queueVideo from '../../assets/PixVerse_V6_Image_Text_540P_make_a_game_like_v.mp4';
import binaryTreeVideo from '../../assets/bt.mp4';
import arr from '../../assets/i_want_the_video_to_explain_ab.mp4';
import ss from '../../assets/create_a_video_explaining_abou.mp4';
import hash from '../../assets/hash.mp4';
import heapVideo from '../../assets/WhatsApp Video 2026-07-22 at 10.44.31 AM.mp4';

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  completed: boolean;
  videoUrl?: string;
  videoType?: 'youtube' | 'mp4';
  type?: 'ds' | 'algo' | 'video';
  target?: string;
  transcript: string[];
}

const lessons: VideoLesson[] = [
  {
    id: 'arrays',
    title: 'Understanding Arrays',
    duration: '00:10',
    description: 'Learn array structure, indexes, and layout.',
    completed: true,
    videoUrl: arr,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "An array is a collection of items stored at contiguous memory locations.",
      "The idea is to store multiple items of the same type together.",
      "This makes it easier to calculate the position of each element by simply adding an offset to a base value."
    ]
  },
  {
    id: 'linked-list-viz',
    title: 'Linked List Node Pointers',
    duration: 'Visualizer',
    description: 'Interactive 3D pointers, nodes, and chains.',
    completed: false,
    type: 'ds',
    target: 'Linked List',
    transcript: [
      "Interactive 3D Sandbox for Linked Lists.",
      "Use the controls inside the visualizer panel to perform inserts, deletes, and searches.",
      "Observe how node addresses dynamically update and links align in 3D space."
    ]
  },
  {
    id: 'binary-search-algo',
    title: 'Binary Search Algorithm',
    duration: 'Workspace',
    description: 'Practice division logic in coding sandbox.',
    completed: false,
    type: 'algo',
    target: 'binary-search',
    transcript: [
      "Launch binary search execution workspace.",
      "Observe pointers low, high and mid calculate middle boundaries dynamically.",
      "Solve the challenge and hit submit to verify correct execution logic."
    ]
  },
  {
    id: 'linked-lists',
    title: 'Linked List Operations',
    duration: '00:10',
    description: 'Pointers, Node links, and traversal.',
    completed: false,
    videoUrl: makeItASecVideo,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "Unlike arrays, linked lists do not store elements in contiguous memory.",
      "Each element is a separate object called a Node, storing data and a next pointer."
    ]
  },
  {
    id: 'queues',
    title: 'Circular & Simple Queues',
    duration: '00:10',
    description: 'FIFO data transfer and rings.',
    completed: false,
    videoUrl: queueVideo,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "A Queue is a linear structure which follows First In First Out order.",
      "Circular Queues wrap the tail back to index zero to maximize memory utilization."
    ]
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort Mechanics',
    duration: '00:10',
    description: 'Minimum swaps and sorting index.',
    completed: false,
    videoUrl: ss,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "Selection Sort divides the array into sorted and unsorted portions.",
      "It repeatedly selects the minimum element from the unsorted part and swaps it to the front."
    ]
  },
  {
    id: 'binary-tree',
    title: 'Binary Tree',
    duration: '00:10',
    description: 'Binary Tree .',
    completed: false,
    videoUrl: binaryTreeVideo,
    type: 'video',
    transcript: [
      "Binary Tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child."
    ]
  },
  {
    id: 'hash',
    title: 'Hash Map Explained',
    duration: '00:10',
    description: 'Explore Hashing',
    completed: false,
    videoUrl: hash,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "Hash maps, also known as hash tables or dictionaries, are one of the most important data structures used in computer science.",
      "They provide a way to store and retrieve data using a key-value pair system.",
      "The primary advantage of using a hash map is its average-case time complexity of O(1) for insertion, deletion, and search operations."
    ]
  },
  {
    id: 'heap',
    title: 'Heap Data Structure',
    duration: '00:10',
    description: 'Understand Min-Heaps and Max-Heaps.',
    completed: false,
    videoUrl: heapVideo,
    videoType: 'mp4',
    type: 'video',
    transcript: [
      "A Heap is a special Tree-based data structure in which the tree is a complete binary tree.",
      "In a Max-Heap, the root node key must be greatest among all keys present in the heap.",
      "In a Min-Heap, the root node key must be minimum among all keys present in the heap."
    ]
  }
];

// Stagger Animation Variants
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

export default function VideoLearningPage() {
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeLesson = lessons.find(l => l.id === activeLessonId) || lessons[0];
  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      
      {/* Premium Header Panel */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] backdrop-blur-md z-10 relative overflow-hidden">
        {/* Soft elegant neon glow */}
        <div className="absolute top-0 left-10 w-96 h-20 bg-[var(--color-accent-primary)] opacity-10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--color-bg-hover)] border border-[var(--color-border-default)] text-[var(--color-text-accent)] shadow-[var(--shadow-glow)]">
              <MonitorPlay size={22} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Personalized Syllabus <Sparkles size={16} className="text-[var(--color-accent-primary)]" />
              </h1>
              <p className="text-xs font-semibold text-[var(--color-text-secondary)] mt-0.5">
                Learn data structures and algorithms from your personalized AI tutor.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" className="px-3.5 py-1.5 flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <CheckCircle2 size={12} /> {completedCount} / {lessons.length} Completed
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Main Visualizer/Video Content Column */}
          <div className="flex flex-col gap-6">

            {/* Premium Interactive Player Frame */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden relative border border-[var(--color-border-default)] bg-black/40 shadow-2xl flex flex-col group">
              {activeLesson.type === 'ds' ? (
                <div className="w-full h-full">
                  <VisualizerPage initialDs={activeLesson.target} hideUI={false} />
                </div>
              ) : activeLesson.type === 'algo' ? (
                <div className="w-full h-full">
                  <AlgorithmsWorkspace initialAlgo={activeLesson.target as AlgoType} immersive={true} hideSidebar={true} />
                </div>
              ) : (
                activeLesson.videoType === 'mp4' ? (
                  <video
                    src={activeLesson.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                )
              )}
            </div>

            {/* Transcript Card using design systems */}
            <Card strong gradientBorder className="flex flex-col overflow-hidden shadow-2xl rounded-3xl">
              <div className="p-5 border-b border-[var(--color-border-subtle)] flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-[var(--color-text-accent)]" />
                  <h3 className="font-extrabold text-white tracking-tight text-sm">Lesson Transcript</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
                  <Activity size={10} className="text-[var(--color-success)] animate-pulse" /> Live transcript
                </div>
              </div>
              <div className="p-5 space-y-4 max-h-60 overflow-y-auto font-medium text-[var(--color-text-secondary)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeLesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {activeLesson.transcript.map((line, idx) => (
                      <p key={idx} className="text-sm leading-relaxed">
                        <span className="text-[10px] font-mono font-bold text-[var(--color-text-accent)] mr-3 bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)] px-2 py-0.5 rounded-md select-none">
                          {`0${Math.floor(idx * 1.5)}:${(idx * 30 % 60).toString().padStart(2, '0')}`}
                        </span>
                        {line}
                      </p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Card>

          </div>

          {/* Playlist Sidebar */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-text-muted)] mb-1 px-1">Syllabus Progression</h3>

            <motion.div 
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {lessons.map((lesson) => {
                const isActive = lesson.id === activeLessonId;

                return (
                  <motion.button
                    key={lesson.id}
                    variants={itemVariants}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setIsPlaying(true);
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4.5 rounded-2xl border transition-all ${isActive
                      ? 'border-[var(--color-accent-primary)] bg-[var(--color-surface-glass-hover)] shadow-[var(--shadow-glow)]'
                      : 'border-[var(--color-border-subtle)] bg-[var(--color-surface-glass)] hover:bg-[var(--color-surface-glass-hover)] hover:border-[var(--color-border-default)]'
                      }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[var(--color-accent-primary)] text-white shadow-[0_0_10px_rgba(161,98,247,0.5)]'
                        : lesson.completed ? 'bg-[var(--color-success-muted)] border border-[var(--color-success)] text-[var(--color-success)]'
                          : 'bg-[var(--color-bg-hover)] border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]'
                        }`}>
                        {isActive ? <Play size={10} fill="currentColor" className="ml-0.5 animate-pulse" /> :
                          lesson.completed ? <CheckCircle2 size={12} /> :
                            <PlayCircle size={12} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-extrabold text-sm text-white line-clamp-1">
                            {lesson.title}
                          </h4>
                          {lesson.type && (
                            <span className="text-[8px] font-black uppercase tracking-wider text-[var(--color-text-accent)] bg-[var(--color-border-subtle)] px-1.5 py-0.5 rounded shrink-0">
                              {lesson.type}
                            </span>
                          )}
                        </div>
                        <p className="text-xs line-clamp-2 leading-relaxed text-[var(--color-text-secondary)] font-medium mt-1">
                          {lesson.description}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[9px] font-mono font-bold text-[var(--color-text-muted)] tracking-wider">
                          <span className="px-2 py-0.5 rounded border border-[var(--color-border-subtle)] bg-black/20">
                            {lesson.duration}
                          </span>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded border border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary-light)] animate-pulse uppercase tracking-wider">
                              NOW PLAYING
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
